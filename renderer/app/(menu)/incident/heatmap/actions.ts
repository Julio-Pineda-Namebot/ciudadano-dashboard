'use server'

import { get } from '@/lib/backendService'
import { getSession } from '@/lib/session'

// Centro por defecto (Ica) — ajustar si la ciudad cambia
const DEFAULT_LAT = -14.0755
const DEFAULT_LNG = -75.7285

interface Incident {
  id: string
  incidentType: string
  geolocation: { latitude: number; longitude: number }
}

interface NearbyResponse {
  data: Incident[]
}

export interface IncidentData {
  points: [number, number, number][]
  typeCounts: Record<string, number>
}

export async function getIncidents(
  lat = DEFAULT_LAT,
  lng = DEFAULT_LNG,
): Promise<IncidentData> {
  const token = await getSession()
  if (!token) return { points: [], typeCounts: {} }
  try {
    const params = new URLSearchParams({ lat: String(lat), lon: String(lng) })
    const res = await get<NearbyResponse>(`/incidents/nearby?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const points: [number, number, number][] = res.data.map(
      (i) => [i.geolocation.latitude, i.geolocation.longitude, 1.0]
    )
    const typeCounts: Record<string, number> = {}
    for (const i of res.data) {
      typeCounts[i.incidentType] = (typeCounts[i.incidentType] ?? 0) + 1
    }
    return { points, typeCounts }
  } catch {
    return { points: [], typeCounts: {} }
  }
}
