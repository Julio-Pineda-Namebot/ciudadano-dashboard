'use client'

import { useMemo } from 'react'
import { DataTable } from '@/components/common/datatable/data-table'
import { getIncidentReportColumns } from '@/app/(menu)/incident/incident-report/_components/IncidentReportColumns'
import type { IncidentReportTableProps } from '@/app/(menu)/incident/incident-report/_types/types'

export function IncidentReportTable({ reports, onEdit, onDelete, onView }: IncidentReportTableProps) {
  const columns = useMemo(() => getIncidentReportColumns({ onEdit, onDelete, onView }), [onEdit, onDelete, onView])

  return (
    <DataTable
      data={reports}
      columns={columns}
      searchPlaceholder="Buscar incidencia..."
      searchColumn="description"
      emptyTitle="Sin incidencias"
      emptyDescription="No se encontraron incidencias con los filtros aplicados."
    />
  )
}
