'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ExternalLinkIcon, PencilIcon, TrashIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/common/datatable/data-table-column-header'
import { formatDate } from '@/lib/utils'
import { NEWS_TAG_COLORS } from '@/app/(menu)/news/_types/types'
import type { News, NewsColumnsActions } from '@/app/(menu)/news/_types/types'

export function getNewsColumns({ onEdit, onDelete }: NewsColumnsActions): ColumnDef<News>[] {
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
        const color = NEWS_TAG_COLORS[tag] ?? 'bg-muted text-muted-foreground'
        return (
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>
            {tag}
          </span>
        )
      },
    },
    {
      id: 'origin',
      size: 120,
      accessorFn: (row) => row.origin ?? 'MANUAL',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Origen" />,
      cell: ({ row }) => {
        const isAuto = row.original.origin === 'AUTO'
        return (
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                isAuto ? 'bg-violet-100 text-violet-700' : 'bg-muted text-muted-foreground'
              }`}
            >
              {isAuto ? 'Automática' : 'Manual'}
            </span>
            {isAuto && row.original.sourceUrl && (
              <a
                href={row.original.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Ver fuente original"
                className="text-muted-foreground hover:text-foreground"
              >
                <ExternalLinkIcon className="size-3.5" />
              </a>
            )}
          </div>
        )
      },
    },
  ]
}
