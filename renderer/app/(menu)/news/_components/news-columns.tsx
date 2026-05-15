'use client'

import { ColumnDef } from '@tanstack/react-table'
import { PencilIcon, TrashIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/common/datatable/data-table-column-header'
import { formatDate } from '@/lib/utils'
import type { News } from '../_types/news'

const TAG_COLORS: Record<string, string> = {
  seguridad: 'bg-blue-100 text-blue-700',
  robo: 'bg-red-100 text-red-700',
  clima: 'bg-sky-100 text-sky-700',
  tránsito: 'bg-yellow-100 text-yellow-700',
}

interface Actions {
  onEdit: (news: News) => void
  onDelete: (news: News) => void
}

export function getNewsColumns({ onEdit, onDelete }: Actions): ColumnDef<News>[] {
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
      accessorKey: 'image',
      header: 'Imagen',
      size: 100,
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const src = row.getValue<string>('image')
        return src ? (
          <img src={src} alt={row.getValue('title')} className="h-10 w-16 rounded object-cover" />
        ) : (
          <div className="h-10 w-16 rounded bg-muted" />
        )
      },
    },
    {
      accessorKey: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Título" />,
      cell: ({ row }) => (
        <div className="max-w-xs">
          <p className="font-medium leading-snug line-clamp-2">{row.getValue('title')}</p>
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
            {row.original.summary}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'date',
      size: 130,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha" />,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{formatDate(row.getValue<string>('date'))}</span>
      ),
    },
    {
      accessorKey: 'tag',
      size: 120,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Etiqueta" />,
      cell: ({ row }) => {
        const tag = row.getValue<string>('tag')
        const color = TAG_COLORS[tag] ?? 'bg-muted text-muted-foreground'
        return (
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>
            {tag}
          </span>
        )
      },
    },
  ]
}
