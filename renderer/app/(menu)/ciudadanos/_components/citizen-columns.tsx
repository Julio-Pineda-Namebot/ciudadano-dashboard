'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/common/datatable/data-table-column-header'
import { formatDate } from '@/lib/utils'
import type { Citizen } from '../_types/citizen'

export function getCitizenColumns(): ColumnDef<Citizen>[] {
  return [
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
      accessorKey: 'dni',
      size: 120,
      header: ({ column }) => <DataTableColumnHeader column={column} title="DNI" />,
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.getValue('dni')}</span>
      ),
    },
    {
      accessorKey: 'phone',
      size: 150,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Teléfono" />,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.getValue<string | null>('phone') ?? '—'}
        </span>
      ),
    },
    {
      accessorKey: 'isEmailVerified',
      size: 130,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Verificación" />,
      cell: ({ row }) => {
        const verified = row.getValue<boolean>('isEmailVerified')
        return (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
              verified
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            {verified ? 'Verificado' : 'Pendiente'}
          </span>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      size: 140,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Registrado" />,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.getValue<string>('createdAt'))}
        </span>
      ),
    },
  ]
}
