import { z } from 'zod'
import type { ServerPagination } from '@/components/common/datatable/data-table'

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

export interface AuditLogsQuery {
  action?: AuditAction
  dateFrom?: string
  dateTo?: string
  page?: number
  perPage?: number
}

export const AUDIT_ACTIONS = ['', 'INSERT', 'UPDATE', 'DELETE'] as const

export const auditLogsFilterSchema = z.object({
  range: z.object({ from: z.string(), to: z.string() }),
  action: z.enum(AUDIT_ACTIONS),
})

export type AuditLogsFilterFormValues = z.infer<typeof auditLogsFilterSchema>

export interface AuditLogsFilterValue {
  dateFrom: string
  dateTo: string
  action: AuditAction | ''
}

export interface AuditLogsFiltersProps {
  value: AuditLogsFilterValue
  onApply: (value: AuditLogsFilterValue) => void
}

export interface AuditLogsTableProps {
  logs: AuditLog[]
  loading: boolean
  onShowDetail: (log: AuditLog) => void
  serverPagination: ServerPagination
}

export interface AuditLogDetailModalProps {
  log: AuditLog | null
  onClose: () => void
}

export interface AuditLogBadgeProps {
  action: AuditAction
}
