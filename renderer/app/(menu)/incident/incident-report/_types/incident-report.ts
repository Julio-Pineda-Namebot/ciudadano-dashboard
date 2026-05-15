export interface Geolocation {
  latitude: number
  longitude: number
}

export interface IncidentReport {
  id: string
  userId: string
  incidentType: string
  description: string
  multimediaUrl: string
  geolocation: Geolocation
  createdAt: string
}

export interface IncidentReportUpdateData {
  incidentType?: string
  description?: string
}
