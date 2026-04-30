export interface Geolocation {
  lat: number
  lng: number
}

export interface IncidentReport {
  id: string
  userId: string
  incidentType: string
  description: string
  multimediaUrl: string
  multimediaKey: string
  geolocation: Geolocation
  createdAt: string
}

export type IncidentReportFormData = Omit<IncidentReport, 'id' | 'multimediaKey' | 'createdAt'>
