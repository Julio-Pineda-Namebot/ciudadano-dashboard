export type IncidentType = 'robo' | 'accidente' | 'vandalismo'

export interface NearbyIncident {
  id: string
  incidentType: IncidentType
  description: string
  geolocation: {
    latitude: number
    longitude: number
  }
  multimediaUrl?: string
  createdAt: string
}

export type ReportIncidentState =
  | { ok: true; message: string }
  | { error: string }
  | null

export interface CitizenFeedPanelProps {
  initialIncidents: NearbyIncident[]
  defaultCenter: { lat: number; lon: number }
}

export type FeedMode = 'view' | 'report' | 'route'

export interface RoutePoint {
  lat: number
  lon: number
}

export interface RouteResult {
  coordinates: [number, number][]
  dangerScore: number
  isSafe: boolean
  distanceMeters: number
  durationSeconds: number
}

export type RouteOptionLabel = 'safest' | 'middle' | 'shortest'

export interface RouteOption extends RouteResult {
  id: string
  label: RouteOptionLabel
  color: string
}

export interface RoutePlan {
  options: RouteOption[]
  selectedId: string
}
