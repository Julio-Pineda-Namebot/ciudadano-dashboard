import type {
  NearbyIncident,
  RouteOption,
  RouteOptionLabel,
  RoutePoint,
  RouteResult,
} from '@/app/(landing)/feed/_types/types'
import {
  DANGER_THRESHOLD,
  LABEL_COLOR,
  MAX_ROUTE_OPTIONS,
} from '@/app/(landing)/feed/constants'
import { computeDangerScore } from '@/app/(landing)/feed/geoUtils'

type DirectionsRoute = {
  geometry: { coordinates: [number, number][] }
  distance: number
  duration: number
}

async function fetchDirections(coords: string, token: string): Promise<DirectionsRoute[]> {
  // `driving` profile sticks to the street network (no pedestrian shortcuts,
  // alleys, or plaza crossings) — that produces visually clean polylines.
  const url =
    `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}` +
    `?alternatives=true&geometries=geojson&overview=full&access_token=${token}`
  const res = await fetch(url)
  if (!res.ok) return []
  const json: { routes?: DirectionsRoute[] } = await res.json()
  return json.routes ?? []
}

function buildDetourCoords(origin: RoutePoint, destination: RoutePoint): string[] {
  // Detour candidates via perpendicular waypoints. We push a waypoint
  // sideways (north/south/east/west of the direct line) at several
  // positions along the trajectory to force the router into different
  // streets and explore zones with fewer incidents.
  const dLon = destination.lon - origin.lon
  const dLat = destination.lat - origin.lat
  const len = Math.hypot(dLon, dLat) || 1
  const perpLon = -dLat / len
  const perpLat = dLon / len
  // Anchors along the route + perpendicular offsets in degrees
  // (~0.003° ≈ 330 m at this latitude).
  const anchors = [0.33, 0.5, 0.67]
  const offsets = [0.004, -0.004, 0.008, -0.008]
  const detourCoords: string[] = []
  for (const t of anchors) {
    const ax = origin.lon + dLon * t
    const ay = origin.lat + dLat * t
    for (const o of offsets) {
      const wpLon = ax + perpLon * o
      const wpLat = ay + perpLat * o
      detourCoords.push(
        `${origin.lon},${origin.lat};${wpLon},${wpLat};${destination.lon},${destination.lat}`
      )
    }
  }
  return detourCoords
}

function dedupeRoutes(list: RouteResult[]): RouteResult[] {
  const kept: RouteResult[] = []
  for (const r of list) {
    const dup = kept.some(
      (k) =>
        Math.abs(k.distanceMeters - r.distanceMeters) / r.distanceMeters < 0.04 &&
        Math.abs(k.dangerScore - r.dangerScore) < 0.02
    )
    if (!dup) kept.push(r)
  }
  return kept
}

export type CalculateRouteResult =
  | { ok: true; options: RouteOption[] }
  | { ok: false; error: string }

export async function calculateSafeRoute(
  origin: RoutePoint,
  destination: RoutePoint,
  incidents: NearbyIncident[],
  token: string
): Promise<CalculateRouteResult> {
  // 1) Direct request — Mapbox already returns up to 3 alternatives.
  const directCoords = `${origin.lon},${origin.lat};${destination.lon},${destination.lat}`
  const detourCoords = buildDetourCoords(origin, destination)

  const allBatches = await Promise.all([
    fetchDirections(directCoords, token),
    ...detourCoords.map((c) => fetchDirections(c, token)),
  ])
  const pool = allBatches.flat()
  if (pool.length === 0) {
    return { ok: false, error: 'No se encontró un recorrido entre los puntos' }
  }

  // Score, dedupe by distance similarity, and pick up to 3 diverse options.
  const allScored: RouteResult[] = pool.map((r) => {
    const danger = computeDangerScore(r.geometry.coordinates, incidents)
    return {
      coordinates: r.geometry.coordinates,
      dangerScore: danger,
      isSafe: danger <= DANGER_THRESHOLD,
      distanceMeters: r.distance,
      durationSeconds: r.duration,
    }
  })

  // Drop candidates whose detour is disproportionately longer than the
  // direct route — those are the ones with zigzag spikes because the
  // injected waypoint sits far from the natural path.
  const shortestDistance = Math.min(...allScored.map((s) => s.distanceMeters))
  const scored = allScored.filter(
    (s) => s.distanceMeters <= shortestDistance * 1.6
  )
  if (scored.length === 0) {
    // Fallback: at least keep the shortest one so we always return something.
    scored.push(
      allScored.reduce((a, b) => (a.distanceMeters <= b.distanceMeters ? a : b))
    )
  }

  const byDanger = dedupeRoutes(
    [...scored].sort((a, b) => {
      if (a.dangerScore !== b.dangerScore) return a.dangerScore - b.dangerScore
      return a.distanceMeters - b.distanceMeters
    })
  )
  const byDistance = [...scored].sort(
    (a, b) => a.distanceMeters - b.distanceMeters
  )

  // Pick: safest, shortest, and (if different) a middle option.
  const selected: RouteResult[] = []
  const pushUnique = (r: RouteResult | undefined) => {
    if (!r) return
    if (selected.includes(r)) return
    if (
      selected.some(
        (s) =>
          Math.abs(s.distanceMeters - r.distanceMeters) / r.distanceMeters < 0.04 &&
          Math.abs(s.dangerScore - r.dangerScore) < 0.02
      )
    ) {
      return
    }
    selected.push(r)
  }

  pushUnique(byDanger[0])
  pushUnique(byDistance[0])
  for (const cand of byDanger) {
    if (selected.length >= MAX_ROUTE_OPTIONS) break
    pushUnique(cand)
  }

  const safestRef = byDanger[0]
  const shortestRef = byDistance[0]
  const options: RouteOption[] = selected.slice(0, MAX_ROUTE_OPTIONS).map((r, i) => {
    let label: RouteOptionLabel
    if (r === safestRef) label = 'safest'
    else if (r === shortestRef) label = 'shortest'
    else label = 'middle'
    return {
      ...r,
      id: `opt-${i}`,
      label,
      color: LABEL_COLOR[label],
    }
  })

  return { ok: true, options }
}
