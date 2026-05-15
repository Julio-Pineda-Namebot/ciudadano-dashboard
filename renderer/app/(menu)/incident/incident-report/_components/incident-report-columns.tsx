'use client'

import { ColumnDef } from '@tanstack/react-table'
import { PencilIcon, TrashIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/common/datatable/data-table-column-header'
import { formatDateTime } from '@/lib/utils'
import type { IncidentReport } from '../_types/incident-report'

const TYPE_COLORS: Record<string, string> = {
  accidente: 'bg-orange-100 text-orange-700',
  robo: 'bg-red-100 text-red-700',
  incendio: 'bg-rose-100 text-rose-700',
  vandalismo: 'bg-yellow-100 text-yellow-700',
}

interface Actions {
  onEdit: (report: IncidentReport) => void
  onDelete: (report: IncidentReport) => void
}

export function getIncidentReportColumns({ onEdit, onDelete }: Actions): ColumnDef<IncidentReport>[] {
  return [
    {
      id: 'actions',
      size: 80,
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => onEdit(row.original)} title="Editar">
            <PencilIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(row.original)}
            title="Eliminar"
            className="text-destructive hover:text-destructive"
          >
            <TrashIcon />
          </Button>
        </div>
      ),
    },
    {
      accessorKey: 'incidentType',
      size: 130,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tipo" />,
      cell: ({ row }) => {
        const type = row.getValue<string>('incidentType')
        const color = TYPE_COLORS[type] ?? 'bg-muted text-muted-foreground'
        return (
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${color}`}>
            {type}
          </span>
        )
      },
    },
    {
      accessorKey: 'description',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Descripción" />,
      cell: ({ row }) => (
        <p className="max-w-sm line-clamp-2 text-sm">{row.getValue('description')}</p>
      ),
    },
    {
      accessorKey: 'multimediaUrl',
      header: 'Media',
      size: 90,
      enableSorting: false,
      cell: ({ row }) => {
        const url = row.getValue<string>('multimediaUrl')
        return url ? (
          <img src={url} alt="media" className="h-10 w-16 rounded object-cover" />
        ) : (
          <div className="h-10 w-16 rounded bg-muted" />
        )
      },
    },
    {
      accessorKey: 'createdAt',
      size: 160,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha" />,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDateTime(row.getValue<string>('createdAt'))}
        </span>
      ),
    },
  ]
}
