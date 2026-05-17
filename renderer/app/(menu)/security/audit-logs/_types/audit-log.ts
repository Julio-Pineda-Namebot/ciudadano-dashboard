export type AuditAction = 'INSERT' | 'UPDATE' | 'DELETE'

export interface AuditAdminRef {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
}

export type AuditChanges =
  | { new: Record<string, unknown> }
  | { old: Record<string, unknown>; new: Record<string, unknown> }
  | { old: Record<string, unknown> }
  | null

export interface AuditLog {
  id: string
  action: AuditAction
  entity: string
  entityId: string
  mensaje: string
  changes: AuditChanges
  ip: string | null
  createdAt: string
  admin: AuditAdminRef
}

export interface AuditLogsMeta {
  total: number
  page: number
  perPage: number
  totalPages: number
}

export interface AuditLogsResponse {
  data: AuditLog[]
  meta: AuditLogsMeta
}

export interface AuditLogsFilters {
  action?: AuditAction
  dateFrom?: string
  dateTo?: string
  page?: number
  perPage?: number
}
