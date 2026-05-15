'use client'

import { useMemo } from 'react'
import { DataTable } from '@/components/common/datatable/data-table'
import { getCitizenColumns } from './citizen-columns'
import type { Citizen } from '../_types/citizen'

interface Props {
  citizens: Citizen[]
  loading?: boolean
}

export function CitizensTable({ citizens, loading }: Props) {
  const columns = useMemo(() => getCitizenColumns(), [])

  return (
    <DataTable
      data={citizens}
      columns={columns}
      searchPlaceholder="Buscar ciudadano..."
      searchColumn="fullName"
      loading={loading}
      emptyTitle="Sin ciudadanos"
      emptyDescription="No se encontraron ciudadanos con los filtros aplicados."
    />
  )
}
