'use client'

import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  Updater,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { PlusIcon, SearchIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { DataTableViewOptions } from './data-table-view-options'
import { DataTablePagination } from './data-table-pagination'
import { DataState } from '../data-state'
import { useModuleTheme, MODULE_HEADER_CLASS, MODULE_BUTTON_CLASS, type ModuleColor } from '../module-theme'

export type TableHeaderColor = ModuleColor

export interface ServerPagination {
  page: number
  perPage: number
  totalPages: number
  totalRows?: number
  onPageChange: (page: number) => void
  onPerPageChange: (perPage: number) => void
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchPlaceholder?: string
  searchColumn?: string
  showSearch?: boolean
  pageSize?: number
  onCreate?: () => void
  createLabel?: string
  loading?: boolean
  emptyTitle?: string
  emptyDescription?: string
  headerColor?: TableHeaderColor
  buttonClassName?: string
  serverPagination?: ServerPagination
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = 'Búsqueda rápida',
  searchColumn,
  showSearch,
  pageSize = 10,
  onCreate,
  createLabel = 'Nuevo',
  loading = false,
  emptyTitle,
  emptyDescription,
  headerColor,
  buttonClassName,
  serverPagination,
}: DataTableProps<TData, TValue>) {
  const theme = useModuleTheme()
  const resolvedColor = headerColor ?? theme?.color
  const resolvedButtonClass = buttonClassName ?? (resolvedColor ? MODULE_BUTTON_CLASS[resolvedColor] : undefined)
  const headerColorClass = resolvedColor ? MODULE_HEADER_CLASS[resolvedColor] : undefined
  const resolvedShowSearch = showSearch ?? !serverPagination

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState('')

  function handlePaginationChange(updater: Updater<PaginationState>) {
    if (!serverPagination) return
    const prev: PaginationState = {
      pageIndex: serverPagination.page - 1,
      pageSize: serverPagination.perPage,
    }
    const next = typeof updater === 'function' ? updater(prev) : updater
    if (next.pageSize !== prev.pageSize) {
      serverPagination.onPerPageChange(next.pageSize)
    } else if (next.pageIndex !== prev.pageIndex) {
      serverPagination.onPageChange(next.pageIndex + 1)
    }
  }

  const table = useReactTable({
    data,
    columns,
    initialState: { pagination: { pageSize } },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: searchColumn ? undefined : globalFilter,
      ...(serverPagination
        ? { pagination: { pageIndex: serverPagination.page - 1, pageSize: serverPagination.perPage } }
        : {}),
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    ...(serverPagination
      ? {
          manualPagination: true,
          pageCount: serverPagination.totalPages,
          onPaginationChange: handlePaginationChange,
        }
      : {}),
    ...(searchColumn
      ? {}
      : { onGlobalFilterChange: setGlobalFilter, globalFilterFn: 'includesString' }),
  })

  const searchValue = searchColumn
    ? ((table.getColumn(searchColumn)?.getFilterValue() as string) ?? '')
    : globalFilter

  function handleSearch(value: string) {
    if (searchColumn) {
      table.getColumn(searchColumn)?.setFilterValue(value)
    } else {
      setGlobalFilter(value)
    }
  }

  const showEmptyOrLoading = loading || table.getRowModel().rows.length === 0

  return (
    <div className="space-y-3">
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {resolvedShowSearch && (
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8 max-w-xs"
              disabled={loading}
            />
          </div>
        )}
        <div className="ml-auto flex items-center gap-2">
          <DataTableViewOptions table={table} />
          {onCreate && (
            <Button onClick={onCreate} disabled={loading} className={cn(resolvedButtonClass)}>
              <PlusIcon />
              {createLabel}
            </Button>
          )}
        </div>
      </div>

      {showEmptyOrLoading ? (
        <DataState
          loading={loading}
          title={emptyTitle}
          description={emptyDescription}
        />
      ) : (
        <>
          {/* table */}
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader
                className={cn(headerColorClass)}
              >
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className={cn(headerColor && 'hover:bg-transparent border-b-0')}
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        style={{ width: header.column.columnDef.size ? `${header.column.columnDef.size}px` : undefined }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? 'selected' : undefined}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <DataTablePagination table={table} />
        </>
      )}
    </div>
  )
}
