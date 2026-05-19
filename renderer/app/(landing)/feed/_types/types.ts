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
