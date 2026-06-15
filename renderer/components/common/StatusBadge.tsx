import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { IncidentStatus, VerifiedBy } from '@/lib/incidentStatus'

interface StatusBadgeProps {
  status: IncidentStatus
  verifiedBy?: VerifiedBy | null
  className?: string
}

function resolve(status: IncidentStatus, verifiedBy?: VerifiedBy | null) {
  if (status === 'verificado') {
    if (verifiedBy === 'ciudadania') {
      return {
        label: 'Verificado por la ciudadanía',
        classes: 'bg-emerald-100 text-emerald-700',
      }
    }
    if (verifiedBy === 'seguridad') {
      return {
        label: 'Verificado por seguridad',
        classes: 'bg-blue-100 text-blue-700',
      }
    }
    return { label: 'Verificado', classes: 'bg-emerald-100 text-emerald-700' }
  }
  if (status === 'resuelto') {
    return { label: 'Resuelto', classes: 'bg-slate-200 text-slate-700' }
  }
  return { label: 'Pendiente', classes: 'bg-amber-100 text-amber-700' }
}

export function StatusBadge({ status, verifiedBy, className }: StatusBadgeProps) {
  const { label, classes } = resolve(status, verifiedBy)
  return (
    <Badge variant="secondary" className={cn(classes, className)}>
      {label}
    </Badge>
  )
}
