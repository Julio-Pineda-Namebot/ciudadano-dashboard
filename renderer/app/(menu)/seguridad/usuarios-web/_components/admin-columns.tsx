'use client'

import { ColumnDef } from '@tanstack/react-table'
import { PencilIcon, TrashIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/common/datatable/data-table-column-header'
import type { Admin } from '../_types/admin'

interface Actions {
  onEdit: (admin: Admin) => void
  onDelete: (admin: Admin) => void
}

export function getAdminColumns({ onEdit, onDelete }: Actions): ColumnDef<Admin>[] {
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
      accessorKey: 'username',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Usuario" />,
      cell: ({ row }) => <span className="font-mono text-sm">{row.getValue('username')}</span>,
    },
    {
      id: 'fullName',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre" />,
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.firstName} {row.original.lastName}
        </span>
      ),
    },
    {
      accessorKey: 'email',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Correo" />,
      cell: ({ row }) => <span className="text-sm">{row.getValue('email')}</span>,
    },
    {
      id: 'group',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Grupo" />,
      accessorFn: (row) => row.group?.name ?? '',
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
          {row.original.group?.name ?? '—'}
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
            {value ? new Date(value).toLocaleDateString() : '—'}
          </span>
        )
      },
    },
  ]
}
