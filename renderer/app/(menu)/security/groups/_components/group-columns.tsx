'use client'

import { ColumnDef } from '@tanstack/react-table'
import { PencilIcon, TrashIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/common/datatable/data-table-column-header'
import { formatDate } from '@/lib/utils'
import type { Group } from '../_types/group'

interface Actions {
  onEdit: (group: Group) => void
  onDelete: (group: Group) => void
}

export function getGroupColumns({ onEdit, onDelete }: Actions): ColumnDef<Group>[] {
  return [
    {
      id: 'actions',
      size: 80,
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(row.original)}
            title="Editar"
          >
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
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre" />,
      cell: ({ row }) => <span className="font-medium">{row.getValue('name')}</span>,
    },
    {
      accessorKey: 'description',
      header: 'Descripción',
      enableSorting: false,
      cell: ({ row }) => {
        const desc = row.getValue<string | null>('description')
        return desc ? (
          <span className="text-sm text-muted-foreground line-clamp-2">{desc}</span>
        ) : (
          <span className="text-sm text-muted-foreground/60">—</span>
        )
      },
    },
    {
      accessorKey: 'adminCount',
      size: 120,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Admins" />,
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
          {row.getValue('adminCount')}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      size: 140,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Creado" />,
      cell: ({ row }) => {
        const value = row.getValue<string>('createdAt')
        return (
          <span className="text-sm text-muted-foreground">
            {formatDate(value)}
          </span>
        )
      },
    },
  ]
}
