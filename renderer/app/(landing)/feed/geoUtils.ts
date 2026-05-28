import type { NearbyIncident } from '@/app/(landing)/feed/_types/types'
import { INCIDENT_PROXIMITY_METERS } from '@/app/(landing)/feed/constants'

export function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

export function computeDangerScore(
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

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
