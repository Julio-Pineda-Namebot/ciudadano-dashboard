'use client'

import {
  ChevronDownIcon,
  ChevronsLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { AuditLogsMeta } from '../_types/audit-log'

const PAGE_SIZE_OPTIONS = [10, 20, 50]

interface Props {
  meta: AuditLogsMeta | null
  onPageChange: (page: number) => void
  onPerPageChange: (perPage: number) => void
}

export function AuditLogsPagination({ meta, onPageChange, onPerPageChange }: Props) {
  const perPage = meta?.perPage ?? 20
  const current = meta?.page ?? 1
  const totalPages = meta?.totalPages ?? 0
  const total = meta?.total ?? 0

  const from = total === 0 ? 0 : (current - 1) * perPage + 1
  const to = Math.min(current * perPage, total)

  return (
    <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
      {/* left: ver por página */}
      <div className="flex items-center gap-1.5">
        <span>Ver:</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 gap-1 px-2">
              {perPage}
              <ChevronDownIcon className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {PAGE_SIZE_OPTIONS.map((size) => (
              <DropdownMenuItem key={size} onClick={() => onPerPageChange(size)}>
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
          onClick={() => onPageChange(1)}
          disabled={current <= 1}
        >
          <ChevronsLeftIcon className="size-3.5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onPageChange(current - 1)}
          disabled={current <= 1}
        >
          <ChevronLeftIcon className="size-3.5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onPageChange(current + 1)}
          disabled={current >= totalPages}
        >
          <ChevronRightIcon className="size-3.5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onPageChange(totalPages)}
          disabled={current >= totalPages}
        >
          <ChevronsRightIcon className="size-3.5" />
        </Button>
      </div>

      {/* right: counter */}
      <span>[{from} a {to} de {total}]</span>
    </div>
  )
}
