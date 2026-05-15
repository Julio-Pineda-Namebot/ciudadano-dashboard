'use client'

import { EyeIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { useModuleTheme, MODULE_HEADER_CLASS } from '@/components/common/module-theme'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { AuditLogBadge } from './AuditLogBadge'
import { DataState } from '@/components/common/data-state'
import type { AuditLog } from '../_types/audit-log'
import { formatDateTime } from '@/lib/utils'

interface Props {
  logs: AuditLog[]
  loading: boolean
  onShowDetail: (log: AuditLog) => void
}

export function AuditLogsTable({ logs, loading, onShowDetail }: Props) {
  const theme = useModuleTheme()
  const headerClass = theme?.color ? MODULE_HEADER_CLASS[theme.color] : 'bg-[#1a3a6b] [&_th]:text-white [&_th]:border-[#1a3a6b]/30'

  if (loading || logs.length === 0) {
    return (
      <DataState
        loading={loading}
        title="Sin registros"
        description="No se encontraron registros de auditoría con los filtros aplicados."
      />
    )
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader className={cn(headerClass)}>
          <TableRow className="hover:bg-transparent border-b-0">
            <TableHead style={{ width: 160 }}>Fecha y hora</TableHead>
            <TableHead style={{ width: 140 }}>Acción</TableHead>
            <TableHead style={{ width: 140 }}>Módulo</TableHead>
            <TableHead>Administrador</TableHead>
            <TableHead style={{ width: 130 }}>IP</TableHead>
            <TableHead>Mensaje</TableHead>
            <TableHead style={{ width: 80 }}>Detalle</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="text-sm text-muted-foreground">
                {formatDateTime(log.createdAt)}
              </TableCell>
              <TableCell>
                <AuditLogBadge action={log.action} />
              </TableCell>
              <TableCell>
                <span className="font-mono text-xs">{log.entity}</span>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">
                    {log.admin.firstName} {log.admin.lastName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    @{log.admin.username}
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {log.ip ?? '—'}
              </TableCell>
              <TableCell className="max-w-105">
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="block truncate text-sm">{log.mensaje}</span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-md">
                      <p className="text-xs">{log.mensaje}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onShowDetail(log)}
                  title="Ver cambios"
                >
                  <EyeIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
