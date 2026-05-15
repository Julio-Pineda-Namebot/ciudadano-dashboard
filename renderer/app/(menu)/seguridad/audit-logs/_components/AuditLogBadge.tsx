import type { AuditAction } from '../_types/audit-log'

const STYLES: Record<AuditAction, string> = {
  INSERT:
    'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/30',
  UPDATE:
    'bg-amber-50 text-amber-800 ring-amber-600/20 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-400/30',
  DELETE:
    'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/15 dark:text-red-300 dark:ring-red-400/30',
}

const LABELS: Record<AuditAction, string> = {
  INSERT: 'Creación',
  UPDATE: 'Actualización',
  DELETE: 'Eliminación',
}

export function AuditLogBadge({ action }: { action: AuditAction }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${STYLES[action]}`}
    >
      {LABELS[action]}
    </span>
  )
}
