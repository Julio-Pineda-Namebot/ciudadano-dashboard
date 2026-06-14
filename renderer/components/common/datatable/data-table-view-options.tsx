'use client'

import { isValidElement } from 'react'
import { Settings2Icon } from 'lucide-react'
import type { Column, RowData, Table } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Permite que una columna declare una etiqueta legible explícita para este menú.
declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    label?: string
  }
}

interface Props<TData> {
  table: Table<TData>
}

// Resuelve el texto legible de una columna: etiqueta explícita en meta, header
// string, el `title` del DataTableColumnHeader, y como último recurso el id.
function getColumnLabel<TData>(column: Column<TData>): string {
  const { meta, header } = column.columnDef
  if (meta?.label) return meta.label
  if (typeof header === 'string') return header
  if (typeof header === 'function') {
    try {
      const el = header({ column } as never)
      if (isValidElement(el)) {
        const title = (el.props as { title?: unknown }).title
        if (typeof title === 'string') return title
      }
    } catch {
      // El header necesita más contexto del que tenemos aquí: caemos al id.
    }
  }
  return column.id
}

export function DataTableViewOptions<TData>({ table }: Props<TData>) {
  const hideable = table.getAllColumns().filter((col) => col.getCanHide())

  if (hideable.length === 0) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings2Icon />
          Columnas
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuLabel>Mostrar columnas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {hideable.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={column.getIsVisible()}
            onCheckedChange={(value) => column.toggleVisibility(!!value)}
          >
            {getColumnLabel(column)}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
