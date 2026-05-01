'use client'

import { useEffect } from 'react'
import { useBreadcrumb, type BreadcrumbSegment } from './breadcrumb-context'

export function BreadcrumbSetter({ items }: { items: BreadcrumbSegment[] }) {
  const { setItems } = useBreadcrumb()

  useEffect(() => {
    setItems(items)
    return () => setItems([])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
