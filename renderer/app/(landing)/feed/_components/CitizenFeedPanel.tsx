'use client'

import { useActionState, useEffect, useRef, useState, useTransition } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Icon, LogoMark } from '@/app/(landing)/_components/icons'
import { getNearbyIncidents, reportIncident } from '@/app/(landing)/feed/actions'
import type {
  CitizenFeedPanelProps,
  IncidentType,
  NearbyIncident,
  ReportIncidentState,
} from '@/app/(landing)/feed/_types/types'

const STYLE_MAP = 'mapbox://styles/mapbox/streets-v12'
const MIN_ZOOM = 10
const DEFAULT_ZOOM = 13
const ICA_BOUNDS: mapboxgl.LngLatBoundsLike = [
  [-75.9, -14.22],
  [-75.55, -13.92],
]

const TYPE_LABEL: Record<IncidentType, string> = {
  robo: 'Robo',
  accidente: 'Accidente',
  vandalismo: 'Vandalismo',
}

const TYPE_COLOR: Record<IncidentType, string> = {
  robo: '#E04B5E',
  accidente: '#D9A55E',
  vandalismo: '#9CA3B0',
}

type FeedMode = 'view' | 'report' | 'route'

interface RoutePoint {
  lat: number
  lon: number
}

interface RouteResult {
  coordinates: [number, number][]
  dangerScore: number
  isSafe: boolean
  distanceMeters: number
  durationSeconds: number
}

type RouteOptionLabel = 'safest' | 'middle' | 'shortest'

interface RouteOption extends RouteResult {
  id: string
  label: RouteOptionLabel
  color: string
}

interface RoutePlan {
  options: RouteOption[]
  selectedId: string
}

const DANGER_THRESHOLD = 0.2
const INCIDENT_PROXIMITY_METERS = 120
const MAX_ROUTE_OPTIONS = 3

const LABEL_TEXT: Record<RouteOptionLabel, string> = {
  safest: 'Más segura',
  middle: 'Alternativa',
  shortest: 'Ruta corta',
}

const LABEL_COLOR: Record<RouteOptionLabel, string> = {
  safest: '#6BAE7A',
  middle: '#D9A55E',
  shortest: '#E04B5E',
}

function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

function computeDangerScore(
  coords: [number, number][],
  incidents: NearbyIncident[]
): number {
  if (coords.length === 0) return 0
  let dangerous = 0
  for (const [lon, lat] of coords) {
    const hit = incidents.some(
      (inc) =>
        haversineMeters(
          lat,
          lon,
          inc.geolocation.latitude,
          inc.geolocation.longitude
        ) <= INCIDENT_PROXIMITY_METERS
    )
    if (hit) dangerous++
  }
  return dangerous / coords.length
}

export function CitizenFeedPanel({ initialIncidents, defaultCenter }: CitizenFeedPanelProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const draftMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const incidentMarkersRef = useRef<mapboxgl.Marker[]>([])
  const originMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const destinationMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const drawnRouteLayersRef = useRef<Set<string>>(new Set())

  const [incidents, setIncidents] = useState<NearbyIncident[]>(initialIncidents)
  const [selected, setSelected] = useState<{ lat: number; lon: number } | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [mode, setMode] = useState<FeedMode>('view')
  const [origin, setOrigin] = useState<RoutePoint | null>(null)
  const [destination, setDestination] = useState<RoutePoint | null>(null)
  const [route, setRoute] = useState<RoutePlan | null>(null)
  const [routeError, setRouteError] = useState<string | null>(null)
  const [calculatingRoute, setCalculatingRoute] = useState(false)
  const modeRef = useRef(mode)
  const originRef = useRef(origin)
  const destinationRef = useRef(destination)
  useEffect(() => {
    modeRef.current = mode
  }, [mode])
  useEffect(() => {
    originRef.current = origin
  }, [origin])
  useEffect(() => {
    destinationRef.current = destination
  }, [destination])
  const [state, action, pending] = useActionState<ReportIncidentState, FormData>(reportIncident, null)
  const [refreshing, startRefresh] = useTransition()
  const formRef = useRef<HTMLFormElement | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ''

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: STYLE_MAP,
      center: [defaultCenter.lon, defaultCenter.lat],
      zoom: DEFAULT_ZOOM,
      minZoom: MIN_ZOOM,
      maxBounds: ICA_BOUNDS,
    })
    mapRef.current = map

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')
    map.addControl(new mapboxgl.ScaleControl({ unit: 'metric' }), 'bottom-left')

    // Mapbox can mount with a 0×0 container if the parent flex hasn't settled —
    // observe size changes and force resize until it has dimensions.
    map.once('load', () => map.resize())
    const ro = new ResizeObserver(() => map.resize())
    ro.observe(mapContainerRef.current)

    map.on('click', (e) => {
      const { lng, lat } = e.lngLat
      if (modeRef.current === 'report') {
        setSelected({ lat, lon: lng })
        return
      }
      if (modeRef.current === 'route') {
        const o = originRef.current
        const d = destinationRef.current
        if (!o) {
          setOrigin({ lat, lon: lng })
        } else if (!d) {
          setDestination({ lat, lon: lng })
        } else {
          // Replace the closest of the two so the user can refine either point.
          const distToO = haversineMeters(lat, lng, o.lat, o.lon)
          const distToD = haversineMeters(lat, lng, d.lat, d.lon)
          if (distToO <= distToD) setOrigin({ lat, lon: lng })
          else setDestination({ lat, lon: lng })
        }
        setRoute(null)
        setRouteError(null)
      }
    })

    return () => {
      ro.disconnect()
      incidentMarkersRef.current.forEach((m) => m.remove())
      incidentMarkersRef.current = []
      draftMarkerRef.current?.remove()
      draftMarkerRef.current = null
      originMarkerRef.current?.remove()
      originMarkerRef.current = null
      destinationMarkerRef.current?.remove()
      destinationMarkerRef.current = null
      map.remove()
      mapRef.current = null
    }
  }, [defaultCenter.lat, defaultCenter.lon])

  // Render incident markers.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    incidentMarkersRef.current.forEach((m) => m.remove())
    incidentMarkersRef.current = []

    for (const inc of incidents) {
      const el = document.createElement('div')
      const color = TYPE_COLOR[inc.incidentType] ?? '#FFFFFF'
      el.style.width = '14px'
      el.style.height = '14px'
      el.style.borderRadius = '999px'
      el.style.background = color
      el.style.border = '2px solid rgba(255,255,255,0.85)'
      el.style.boxShadow = `0 0 14px ${color}`

      const mediaHtml = inc.multimediaUrl
        ? `<div class="cp-media" style="background-image:url('${encodeURI(inc.multimediaUrl)}')"></div>`
        : ''

      const popup = new mapboxgl.Popup({
        offset: 16,
        closeButton: false,
        className: 'ciudadano-popup',
        maxWidth: '260px',
      }).setHTML(
        `${mediaHtml}<div class="cp-body">
          <div class="cp-type" style="color:${color}">
            <span class="cp-dot" style="background:${color};box-shadow:0 0 8px ${color}"></span>${TYPE_LABEL[inc.incidentType]}
          </div>
          <div class="cp-desc">${escapeHtml(inc.description)}</div>
          <div class="cp-date">${escapeHtml(new Date(inc.createdAt).toLocaleString('es-PE'))}</div>
        </div>`
      )

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([inc.geolocation.longitude, inc.geolocation.latitude])
        .setPopup(popup)
        .addTo(map)

      incidentMarkersRef.current.push(marker)
    }
  }, [incidents])

  // Render draft marker for the user's selected point.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    draftMarkerRef.current?.remove()
    draftMarkerRef.current = null

    if (!selected) return

    const el = document.createElement('div')
    el.style.width = '20px'
    el.style.height = '20px'
    el.style.borderRadius = '999px'
    el.style.background = '#FFFFFF'
    el.style.border = '3px solid rgba(217,165,94,0.95)'
    el.style.boxShadow = '0 0 20px rgba(217,165,94,0.7)'

    draftMarkerRef.current = new mapboxgl.Marker({ element: el, draggable: true })
      .setLngLat([selected.lon, selected.lat])
      .addTo(map)

    draftMarkerRef.current.on('dragend', () => {
      const lngLat = draftMarkerRef.current?.getLngLat()
      if (lngLat) setSelected({ lat: lngLat.lat, lon: lngLat.lng })
    })
  }, [selected])

  // Render origin/destination markers for route mode.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const renderRoutePin = (
      point: RoutePoint | null,
      ref: React.RefObject<mapboxgl.Marker | null>,
      color: string,
      onDrag: (p: RoutePoint) => void
    ) => {
      ref.current?.remove()
      ref.current = null
      if (!point) return
      const el = document.createElement('div')
      el.style.width = '22px'
      el.style.height = '22px'
      el.style.borderRadius = '999px'
      el.style.background = color
      el.style.border = '3px solid rgba(255,255,255,0.95)'
      el.style.boxShadow = `0 0 18px ${color}`
      const marker = new mapboxgl.Marker({ element: el, draggable: true })
        .setLngLat([point.lon, point.lat])
        .addTo(map)
      marker.on('dragend', () => {
        const ll = marker.getLngLat()
        onDrag({ lat: ll.lat, lon: ll.lng })
      })
      ref.current = marker
    }

    renderRoutePin(origin, originMarkerRef, '#6BAE7A', (p) => {
      setOrigin(p)
      setRoute(null)
      setRouteError(null)
    })
    renderRoutePin(destination, destinationMarkerRef, '#5BA3D9', (p) => {
      setDestination(p)
      setRoute(null)
      setRouteError(null)
    })

    // Hide the route pins entirely when leaving route mode.
    if (mode !== 'route') {
      originMarkerRef.current?.remove()
      originMarkerRef.current = null
      destinationMarkerRef.current?.remove()
      destinationMarkerRef.current = null
    }
  }, [origin, destination, mode])

  // Render every route option on the map. The selected one is drawn solid and on top;
  // the rest are drawn dashed and dimmer underneath.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const drawnLayerIds = drawnRouteLayersRef.current

    const apply = () => {
      // Remove all previously drawn route layers/sources.
      for (const layerId of drawnLayerIds) {
        if (map.getLayer(layerId)) map.removeLayer(layerId)
        const sourceId = layerId.replace('-line', '')
        if (map.getSource(sourceId)) map.removeSource(sourceId)
      }
      drawnLayerIds.clear()

      if (!route || mode !== 'route') return

      // Draw non-selected options first (underneath).
      const ordered = [...route.options].sort((a, b) =>
        a.id === route.selectedId ? 1 : b.id === route.selectedId ? -1 : 0
      )

      for (const opt of ordered) {
        const sourceId = `route-${opt.id}`
        const layerId = `${sourceId}-line`
        const isSelected = opt.id === route.selectedId
        const data: GeoJSON.Feature<GeoJSON.LineString> = {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: opt.coordinates },
        }
        map.addSource(sourceId, { type: 'geojson', data })
        map.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: {
            'line-color': opt.color,
            'line-width': isSelected ? 7 : 5,
            'line-opacity': isSelected ? 0.95 : 0.8,
            ...(isSelected ? {} : { 'line-dasharray': [1.4, 1.6] }),
          },
        })
        drawnLayerIds.add(layerId)
      }

      // Fit map to all coords so the user sees every option.
      const allCoords: [number, number][] = route.options.flatMap((o) => o.coordinates)
      if (allCoords.length > 0) {
        const first = allCoords[0]
        const bounds = allCoords.reduce(
          (b: mapboxgl.LngLatBounds, c) => b.extend(c),
          new mapboxgl.LngLatBounds(first, first)
        )
        map.fitBounds(bounds, { padding: 60, duration: 600, maxZoom: 16 })
      }
    }

    if (map.isStyleLoaded()) apply()
    else map.once('load', apply)
  }, [route, mode])

  const handleCalculateRoute = async () => {
    if (!origin || !destination) return
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token) {
      setRouteError('Falta configurar el token de Mapbox')
      return
    }
    setCalculatingRoute(true)
    setRouteError(null)
    setRoute(null)
    try {
      type DirectionsRoute = {
        geometry: { coordinates: [number, number][] }
        distance: number
        duration: number
      }
      const fetchDirections = async (coords: string): Promise<DirectionsRoute[]> => {
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

      // 1) Direct request — Mapbox already returns up to 3 alternatives.
      const directCoords = `${origin.lon},${origin.lat};${destination.lon},${destination.lat}`

      // 2) Detour candidates via perpendicular waypoints. We push a waypoint
      //    sideways (north/south/east/west of the direct line) at several
      //    positions along the trajectory to force the router into different
      //    streets and explore zones with fewer incidents.
      const dLon = destination.lon - origin.lon
      const dLat = destination.lat - origin.lat
      const len = Math.hypot(dLon, dLat) || 1
      // Perpendicular unit vector to the direct line.
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

      const allBatches = await Promise.all([
        fetchDirections(directCoords),
        ...detourCoords.map(fetchDirections),
      ])
      const pool = allBatches.flat()
      if (pool.length === 0) {
        setRouteError('No se encontró un recorrido entre los puntos')
        return
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

      const dedupe = (list: RouteResult[]): RouteResult[] => {
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

      const byDanger = dedupe(
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

      pushUnique(byDanger[0]) // safest
      pushUnique(byDistance[0]) // shortest
      // Middle: best safety among the remaining that's clearly different from both.
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

      // Selected by default = safest.
      const initial = options.find((o) => o.label === 'safest') ?? options[0]
      setRoute({ options, selectedId: initial.id })
    } catch (err) {
      setRouteError('No se pudo calcular la ruta, intenta nuevamente')
      console.error('safe-route failed', err)
    } finally {
      setCalculatingRoute(false)
    }
  }

  const handleSelectRoute = (id: string) => {
    setRoute((prev) => (prev ? { ...prev, selectedId: id } : prev))
  }

  const clearRoute = () => {
    setOrigin(null)
    setDestination(null)
    setRoute(null)
    setRouteError(null)
  }

  // Refresh incidents and reset form when a report succeeds.
  useEffect(() => {
    if (state && 'ok' in state && state.ok) {
      formRef.current?.reset()
      setSelected(null)
      setMediaPreview(null)
      const map = mapRef.current
      const center = map?.getCenter()
      const lat = center?.lat ?? defaultCenter.lat
      const lon = center?.lng ?? defaultCenter.lon
      startRefresh(async () => {
        const next = await getNearbyIncidents(lat, lon)
        setIncidents(next)
      })
    }
  }, [state, defaultCenter.lat, defaultCenter.lon])

  const handleRecenter = () => {
    const map = mapRef.current
    if (!map) return
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        map.flyTo({ center: [longitude, latitude], zoom: 15, essential: true })
        startRefresh(async () => {
          const next = await getNearbyIncidents(latitude, longitude)
          setIncidents(next)
        })
      },
      () => {
        // Silent: keep current center if user denies geolocation.
      },
      { enableHighAccuracy: true, timeout: 5000 }
    )
  }

  const errorMessage = state && 'error' in state ? state.error : null
  const successMessage = state && 'ok' in state && state.ok ? state.message : null

  return (
    <main
      data-lenis-prevent
      className="fixed inset-0 z-30 flex flex-col-reverse bg-[#050505] text-white lg:flex-row"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse at 0% 0%, rgba(255,255,255,0.05), transparent 55%), radial-gradient(ellipse at 100% 100%, rgba(217,165,94,0.06), transparent 55%), linear-gradient(180deg, rgba(11,15,28,0.95), rgba(5,7,15,1))',
        }}
      />

      {/* Form panel (left on desktop, bottom on mobile) */}
      <aside className="relative z-10 flex h-[45svh] min-h-0 shrink-0 flex-col gap-5 overflow-y-auto border-t border-white/8 bg-black/40 p-6 backdrop-blur-md sm:p-8 lg:h-full lg:w-[420px] lg:border-r lg:border-t-0">
        <a href="/" className="flex items-center gap-2">
          <LogoMark size={22} />
          <span className="font-display text-[14px] font-semibold tracking-tight">Ciudadano</span>
        </a>

        {mode !== 'route' && (
          <div>
            <div className="eyebrow">Reportar · Mi cuadra</div>
            <h1 className="mt-3 font-display text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[28px]">
              <span className="gradient-text">Registra una </span>
              <span className="gradient-text-accent italic">incidencia</span>
            </h1>
            <p className="mt-2 text-[13px] text-white/55">
              Toca un punto del mapa para marcar la ubicación. Luego describe lo ocurrido.
            </p>
          </div>
        )}

        {mode === 'route' && (
          <div>
            <div className="eyebrow">Recorrido · Seguro</div>
            <h1 className="mt-3 font-display text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[28px]">
              <span className="gradient-text">Planifica una </span>
              <span className="gradient-text-accent italic">ruta segura</span>
            </h1>
            <p className="mt-2 text-[13px] text-white/55">
              Toca el mapa para fijar el punto de inicio y el destino. Calcularemos
              un recorrido evitando zonas con muchas incidencias.
            </p>
          </div>
        )}

        {mode === 'route' && (
          <div className="flex flex-col gap-4">
            {routeError && (
              <div className="rounded-lg border border-[#E04B5E]/30 bg-[#E04B5E]/10 px-3 py-2 text-[12.5px] text-[#FF8A99]">
                {routeError}
              </div>
            )}
            {route && (
              <div className="flex flex-col gap-2">
                <div className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-white/55">
                  {route.options.length === 1
                    ? '1 opción encontrada'
                    : `${route.options.length} opciones · toca una para verla`}
                </div>
                {route.options.map((opt) => {
                  const isSelected = opt.id === route.selectedId
                  const dangerPct = Math.round(opt.dangerScore * 100)
                  const shortestRef = route.options.find((o) => o.label === 'shortest')
                  const deltaM =
                    shortestRef && opt.id !== shortestRef.id
                      ? Math.round(opt.distanceMeters - shortestRef.distanceMeters)
                      : null
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectRoute(opt.id)}
                      className={`text-left rounded-lg border px-3 py-2 text-[12.5px] transition ${
                        isSelected
                          ? 'border-white/40 bg-white/8'
                          : 'border-white/10 bg-white/3 hover:bg-white/6'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em]">
                        <span className="flex items-center gap-2 text-white/80">
                          <span
                            className="inline-block h-0.5 w-5"
                            style={{
                              background: isSelected
                                ? opt.color
                                : `repeating-linear-gradient(90deg, ${opt.color} 0 4px, transparent 4px 8px)`,
                            }}
                          />
                          {LABEL_TEXT[opt.label]}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9.5px] ${
                            opt.isSafe
                              ? 'bg-[#6BAE7A]/15 text-[#A8DDB5]'
                              : 'bg-[#E04B5E]/15 text-[#FF8A99]'
                          }`}
                        >
                          {opt.isSafe ? 'Segura' : 'No segura'}
                        </span>
                      </div>
                      <div className="mt-1 text-white/75">
                        {dangerPct === 0
                          ? 'Sin incidencias en el trayecto'
                          : `${dangerPct}% del trayecto cerca de incidencias`}
                      </div>
                      <div className="mt-1 flex items-center justify-between font-mono text-[10.5px] text-white/50">
                        <span>
                          {(opt.distanceMeters / 1000).toFixed(2)} km · {Math.round(opt.durationSeconds / 60)} min
                        </span>
                        {deltaM !== null && (
                          <span className="text-white/40">
                            {deltaM > 0 ? `+${deltaM} m` : `${deltaM} m`} vs corta
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            <label className="flex flex-col gap-2">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-white/55">
                Origen
              </span>
              <div className="rounded-xl border border-white/10 bg-white/4 px-3 py-2.5 text-[12.5px]">
                {origin ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 font-mono text-white/85">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: '#6BAE7A', boxShadow: '0 0 8px #6BAE7A' }}
                      />
                      {origin.lat.toFixed(5)}, {origin.lon.toFixed(5)}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setOrigin(null)
                        setRoute(null)
                        setRouteError(null)
                      }}
                      className="text-white/40 transition hover:text-white"
                      aria-label="Limpiar origen"
                    >
                      <Icon name="x" size={13} />
                    </button>
                  </div>
                ) : (
                  <span className="text-white/40">Toca el mapa para fijar el punto de inicio.</span>
                )}
              </div>
            </label>

            <label className="flex flex-col gap-2">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-white/55">
                Destino
              </span>
              <div className="rounded-xl border border-white/10 bg-white/4 px-3 py-2.5 text-[12.5px]">
                {destination ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 font-mono text-white/85">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: '#5BA3D9', boxShadow: '0 0 8px #5BA3D9' }}
                      />
                      {destination.lat.toFixed(5)}, {destination.lon.toFixed(5)}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setDestination(null)
                        setRoute(null)
                        setRouteError(null)
                      }}
                      className="text-white/40 transition hover:text-white"
                      aria-label="Limpiar destino"
                    >
                      <Icon name="x" size={13} />
                    </button>
                  </div>
                ) : (
                  <span className="text-white/40">
                    {origin
                      ? 'Toca el mapa para fijar el destino.'
                      : 'Primero fija el origen.'}
                  </span>
                )}
              </div>
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCalculateRoute}
                disabled={!origin || !destination || calculatingRoute}
                className="landing-btn landing-btn-primary h-12 flex-1 text-[14px] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {calculatingRoute ? 'Calculando…' : <>Calcular ruta segura <Icon name="arrow" size={14} /></>}
              </button>
              {(origin || destination || route) && (
                <button
                  type="button"
                  onClick={clearRoute}
                  className="h-12 rounded-xl border border-white/10 bg-white/4 px-4 text-[12.5px] text-white/70 transition hover:bg-white/8 hover:text-white"
                >
                  Limpiar
                </button>
              )}
            </div>

            <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/40">
              Umbral de seguridad: ≤ 20% del trayecto cerca de incidencias
            </p>
          </div>
        )}

        {mode !== 'route' && successMessage && (
          <div className="rounded-lg border border-[#6BAE7A]/30 bg-[#6BAE7A]/10 px-3 py-2 text-[12.5px] text-[#A8DDB5]">
            {successMessage}
          </div>
        )}
        {mode !== 'route' && errorMessage && (
          <div className="rounded-lg border border-[#E04B5E]/30 bg-[#E04B5E]/10 px-3 py-2 text-[12.5px] text-[#FF8A99]">
            {errorMessage}
          </div>
        )}

        {mode !== 'route' && <form ref={formRef} action={action} className="flex flex-col gap-4">
          <input type="hidden" name="latitude" value={selected?.lat ?? ''} />
          <input type="hidden" name="longitude" value={selected?.lon ?? ''} />

          <label className="flex flex-col gap-2">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-white/55">
              Tipo
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(TYPE_LABEL) as IncidentType[]).map((t) => (
                <label
                  key={t}
                  className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/4 px-2 py-2.5 text-[12.5px] text-white/70 transition hover:bg-white/8 has-[input:checked]:border-white/40 has-[input:checked]:bg-white/10 has-[input:checked]:text-white"
                >
                  <input type="radio" name="incident_type" value={t} required className="sr-only" />
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: TYPE_COLOR[t], boxShadow: `0 0 8px ${TYPE_COLOR[t]}` }}
                  />
                  {TYPE_LABEL[t]}
                </label>
              ))}
            </div>
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-white/55">
              Descripción
            </span>
            <textarea
              name="description"
              required
              minLength={10}
              maxLength={191}
              placeholder="Describe brevemente lo que ocurrió (10–191 caracteres)…"
              rows={4}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/4 px-3 py-2.5 text-[13.5px] text-white placeholder:text-white/30 outline-none transition focus:border-white/30 focus:bg-white/8"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-white/55">
              Ubicación
            </span>
            <div className="rounded-xl border border-white/10 bg-white/4 px-3 py-2.5 text-[12.5px]">
              {selected ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="font-mono text-white/85">
                    {selected.lat.toFixed(5)}, {selected.lon.toFixed(5)}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="text-white/40 transition hover:text-white"
                    aria-label="Limpiar ubicación"
                  >
                    <Icon name="x" size={13} />
                  </button>
                </div>
              ) : (
                <span className="text-white/40">Toca el mapa para seleccionar un punto.</span>
              )}
            </div>
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-white/55">
              Foto o video
            </span>
            <div className="relative flex items-center gap-3 rounded-xl border border-dashed border-white/15 bg-white/3 px-3 py-3">
              <input
                type="file"
                name="multimedia"
                accept="image/*,video/*"
                required
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) {
                    setMediaPreview(null)
                    return
                  }
                  if (file.type.startsWith('image/')) {
                    setMediaPreview(URL.createObjectURL(file))
                  } else {
                    setMediaPreview(null)
                  }
                }}
              />
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/8 text-white/80">
                <Icon name="camera" size={15} />
              </div>
              <div className="flex-1 text-[12.5px] text-white/55">
                {mediaPreview ? 'Archivo listo' : 'Adjunta una foto o video del incidente'}
              </div>
              {mediaPreview && (
                <img
                  src={mediaPreview}
                  alt="preview"
                  className="h-10 w-10 rounded-md object-cover ring-1 ring-white/15"
                />
              )}
            </div>
          </label>

          <button
            type="submit"
            disabled={pending || !selected}
            className="landing-btn landing-btn-primary mt-1 h-12 w-full text-[14px] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? 'Reportando…' : <>Reportar <Icon name="arrow" size={14} /></>}
          </button>
        </form>}

        <div className="mt-auto flex items-center justify-between border-t border-white/8 pt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
          <span>
            {mode === 'route'
              ? route
                ? (() => {
                    const sel = route.options.find((o) => o.id === route.selectedId)
                    if (!sel) return ''
                    return `${LABEL_TEXT[sel.label]}: ${Math.round(sel.dangerScore * 100)}% en riesgo`
                  })()
                : 'Selecciona origen y destino'
              : `${incidents.length} reportes activos`}
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="landing-dot"
              style={{
                background: refreshing ? '#D9A55E' : '#6BAE7A',
                boxShadow: `0 0 10px ${refreshing ? '#D9A55E' : '#6BAE7A'}`,
              }}
            />
            {refreshing ? 'Actualizando' : 'En vivo'}
          </span>
        </div>
      </aside>

      {/* Map panel (right on desktop, top on mobile) */}
      <section className="relative min-h-0 flex-1">
        <div ref={mapContainerRef} className="h-full w-full" />

        {/* Top-left toolbar: mode toggle + geolocation */}
        <div className="absolute left-3 top-3 z-10 flex items-center gap-2 sm:left-4 sm:top-4">
          <div
            role="tablist"
            aria-label="Modo de interacción del mapa"
            className="flex items-center rounded-xl border border-white/10 bg-black/70 p-1 backdrop-blur-md shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)]"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'view'}
              onClick={() => {
                setMode('view')
                setSelected(null)
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] transition ${
                mode === 'view'
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              <Icon name="eye" size={13} />
              Ver
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'report'}
              onClick={() => setMode('report')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] transition ${
                mode === 'report'
                  ? 'bg-white text-black'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              <Icon name="plus" size={13} />
              Reportar
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'route'}
              onClick={() => {
                setMode('route')
                setSelected(null)
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] transition ${
                mode === 'route'
                  ? 'bg-[#6BAE7A] text-black'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              <Icon name="pin" size={13} />
              Ruta segura
            </button>
          </div>
          <button
            type="button"
            onClick={handleRecenter}
            title="Centrar en mi ubicación"
            aria-label="Centrar en mi ubicación"
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-black/70 text-white/70 backdrop-blur-md shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)] transition hover:bg-black/85 hover:text-white"
          >
            <Icon name="pin" size={14} />
          </button>
        </div>

        {mode === 'report' && !selected && (
          <div className="pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2 rounded-full border border-white/10 bg-black/70 px-4 py-1.5 text-center text-[10.5px] uppercase tracking-[0.25em] text-white/70 backdrop-blur-sm sm:top-4 sm:text-[11px]">
            Toca el mapa para marcar
          </div>
        )}

        {mode === 'route' && (!origin || !destination) && (
          <div className="pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2 rounded-full border border-white/10 bg-black/70 px-4 py-1.5 text-center text-[10.5px] uppercase tracking-[0.25em] text-white/70 backdrop-blur-sm sm:top-4 sm:text-[11px]">
            {!origin ? 'Toca el mapa para fijar el origen' : 'Toca el mapa para fijar el destino'}
          </div>
        )}
      </section>
    </main>
  )
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
