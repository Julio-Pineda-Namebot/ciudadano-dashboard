'use client'

import { useMemo } from 'react'
import { DataTable } from '@/components/common/datatable/data-table'
import { getCitizenColumns } from '@/app/(menu)/citizens/_components/CitizenColumns'
import type { CitizensTableProps } from '@/app/(menu)/citizens/_types/types'

export function CitizensTable({ citizens }: CitizensTableProps) {
  const columns = useMemo(() => getCitizenColumns(), [])

  return (
    <DataTable
      data={citizens}
      columns={columns}
      searchPlaceholder="Buscar ciudadano..."
      searchColumn="fullName"
      emptyTitle="Sin ciudadanos"
      emptyDescription="No se encontraron ciudadanos con los filtros aplicados."
    />
  )
}
