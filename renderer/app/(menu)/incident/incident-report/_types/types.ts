import { z } from 'zod'

export const INCIDENT_TYPES = [
  { value: 'robo', label: 'Robo' },
  { value: 'accidente', label: 'Accidente' },
  { value: 'vandalismo', label: 'Vandalismo' },
] as const

export const updateSchema = z.object({
  incidentType: z.string().min(1, 'El tipo de incidencia es obligatorio'),
  description: z.string().trim().min(1, 'La descripción es obligatoria'),
})

export type IncidentReportFormValues = z.infer<typeof updateSchema>

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

export const filterSchema = z.object({
  range: z.object({ from: z.string(), to: z.string() }),
})

export type FilterValues = z.infer<typeof filterSchema>

export interface IncidentReportPanelProps {
  initialReports: IncidentReport[]
}

export interface IncidentReportTableProps {
  reports: IncidentReport[]
  onEdit: (report: IncidentReport) => void
  onDelete: (report: IncidentReport) => void
  onView: (report: IncidentReport) => void
}

export interface IncidentReportFormModalProps {
  open: boolean
  report: IncidentReport | null
  onClose: () => void
  onSubmit: (data: IncidentReportUpdateData) => Promise<void>
}

export interface IncidentReportDeleteDialogProps {
  report: IncidentReport | null
  onClose: () => void
  onConfirm: (id: string) => Promise<void>
}

export interface IncidentReportViewModalProps {
  open: boolean
  report: IncidentReport | null
  onClose: () => void
}

export interface IncidentReportColumnActions {
  onEdit: (report: IncidentReport) => void
  onDelete: (report: IncidentReport) => void
  onView: (report: IncidentReport) => void
}
