import { InboxIcon } from 'lucide-react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface DataStateProps {
  loading?: boolean
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
  skeletonRows?: number
}

export function DataState({
  loading = false,
  title = 'Sin resultados',
  description = 'No se encontraron registros para mostrar.',
  icon,
  action,
  className,
  skeletonRows = 6,
}: DataStateProps) {
  if (loading) {
    return (
      <div
        data-slot="data-state-loading"
        className={cn(
          'overflow-hidden rounded-md border bg-card',
          className
        )}
      >
        <div className="flex items-center gap-4 border-b bg-muted/30 px-4 py-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="ml-auto h-4 w-16" />
        </div>
        <div className="divide-y">
          {Array.from({ length: skeletonRows }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="ml-auto h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Empty
      className={cn(
        'rounded-md border bg-card py-16',
        className
      )}
    >
      <EmptyHeader>
        <EmptyMedia variant="icon">
          {icon ?? <InboxIcon />}
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {action && <EmptyContent>{action}</EmptyContent>}
    </Empty>
  )
}
