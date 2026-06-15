export type IncidentStatus = 'pendiente' | 'verificado' | 'resuelto'
export type VerifiedBy = 'ciudadania' | 'seguridad'
export type IncidentVote = 'confirm' | 'dispute'

export const STATUS_OPTIONS: { value: IncidentStatus; label: string }[] = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'verificado', label: 'Verificado' },
  { value: 'resuelto', label: 'Resuelto' },
]
