'use client'

import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  ChevronDownIcon,
  PlusIcon,
  SearchIcon,
  ChevronsLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { DataState } from '../data-state'
import { useModuleTheme, MODULE_HEADER_CLASS, MODULE_BUTTON_CLASS, type ModuleColor } from '../module-theme'

const PAGE_SIZE_OPTIONS = [10, 20, 50]

export type TableHeaderColor = ModuleColor

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchPlaceholder?: string
  searchColumn?: string
  pageSize?: number
  onCreate?: () => void
  createLabel?: string
  loading?: boolean
  emptyTitle?: string
  emptyDescription?: string
  headerColor?: TableHeaderColor
  buttonClassName?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = 'Búsqueda rápida',
  searchColumn,
  pageSize = 10,
  onCreate,
  createLabel = 'Nuevo',
  loading = false,
  emptyTitle,
  emptyDescription,
  headerColor,
  buttonClassName,
}: DataTableProps<TData, TValue>) {
  const theme = useModuleTheme()
  const resolvedColor = headerColor ?? theme?.color
  const resolvedButtonClass = buttonClassName ?? (resolvedColor ? MODULE_BUTTON_CLASS[resolvedColor] : undefined)
  const headerColorClass = resolvedColor ? MODULE_HEADER_CLASS[resolvedColor] : undefined

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState('')

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
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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

  const pageIndex = table.getState().pagination.pageIndex
  const currentPageSize = table.getState().pagination.pageSize
  const totalPages = table.getPageCount()
  const current = pageIndex + 1
  const totalCount = table.getFilteredRowModel().rows.length
  const from = totalCount === 0 ? 0 : pageIndex * currentPageSize + 1
  const to = Math.min(current * currentPageSize, totalCount)
  const showEmptyOrLoading = loading || table.getRowModel().rows.length === 0

  return (
    <div className="space-y-3">
      {/* toolbar */}
      <div className="flex items-center gap-2">
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
          <div className="overflow-hidden rounded-md border">
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

          {/* pagination */}
          <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
            {/* left: ver por página */}
            <div className="flex items-center gap-1.5">
              <span>Ver:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 gap-1 px-2">
                    {currentPageSize}
                    <ChevronDownIcon className="size-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <DropdownMenuItem key={size} onClick={() => table.setPageSize(size)}>
                      {size}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* center: nav buttons */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsLeftIcon className="size-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeftIcon className="size-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRightIcon className="size-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => table.setPageIndex(totalPages - 1)}
                disabled={!table.getCanNextPage()}
              >
                <ChevronsRightIcon className="size-3.5" />
              </Button>
            </div>

            {/* right: counter */}
            <span>[{from} a {to} de {totalCount}]</span>
          </div>
        </>
      )}
    </div>
  )
}
