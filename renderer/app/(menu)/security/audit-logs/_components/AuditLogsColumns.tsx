'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { EyeIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { AuditLogBadge } from '@/app/(menu)/security/audit-logs/_components/AuditLogBadge'
import { formatDateTime } from '@/lib/utils'
import type { AuditLog } from '@/app/(menu)/security/audit-logs/_types/types'

interface GetAuditLogsColumnsParams {
  onShowDetail: (log: AuditLog) => void
}

export function getAuditLogsColumns({ onShowDetail }: GetAuditLogsColumnsParams): ColumnDef<AuditLog>[] {
  return [
    {
      accessorKey: 'createdAt',
      header: 'Fecha y hora',
      size: 160,
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDateTime(row.original.createdAt)}
        </span>
      ),
    },
    {
      accessorKey: 'action',
      header: 'Acción',
      size: 140,
      enableSorting: false,
      cell: ({ row }) => <AuditLogBadge action={row.original.action} />,
    },
    {
      accessorKey: 'entity',
      header: 'Módulo',
      size: 140,
      enableSorting: false,
      cell: ({ row }) => <span className="font-mono text-xs">{row.original.entity}</span>,
    },
    {
      id: 'admin',
      header: 'Administrador',
      enableSorting: false,
      cell: ({ row }) => {
        const admin = row.original.admin
        return (
          <div className="flex flex-col">
            <span className="font-medium text-sm">
              {admin.firstName} {admin.lastName}
            </span>
            <span className="text-xs text-muted-foreground">
              @{admin.username}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: 'ip',
      header: 'IP',
      size: 130,
      enableSorting: false,
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.original.ip ?? '—'}
        </span>
      ),
    },
    {
      accessorKey: 'mensaje',
      header: 'Mensaje',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="max-w-105">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="block truncate text-sm">{row.original.mensaje}</span>
              </TooltipTrigger>
              <TooltipContent className="max-w-md">
                <p className="text-xs">{row.original.mensaje}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
    {
      id: 'detail',
      header: 'Detalle',
      size: 80,
      enableSorting: false,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onShowDetail(row.original)}
          title="Ver cambios"
        >
          <EyeIcon />
        </Button>
      ),
    },
  ]
}
