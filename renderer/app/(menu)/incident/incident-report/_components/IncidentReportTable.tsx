'use client'

import { useMemo } from 'react'
import { DataTable } from '@/components/common/datatable/data-table'
import { getIncidentReportColumns } from './incident-report-columns'
import type { IncidentReport } from '../_types/incident-report'

interface Props {
  reports: IncidentReport[]
  loading?: boolean
  onEdit: (report: IncidentReport) => void
  onDelete: (report: IncidentReport) => void
  onCreate?: () => void
}

export function IncidentReportTable({ reports, loading, onEdit, onDelete, onCreate }: Props) {
  const columns = useMemo(() => getIncidentReportColumns({ onEdit, onDelete }), [onEdit, onDelete])

  return (
    <DataTable
      data={reports}
      columns={columns}
      searchPlaceholder="Buscar incidencia..."
      searchColumn="description"
      pageSize={5}
      onCreate={onCreate}
      createLabel="Nueva incidencia"
      loading={loading}
      emptyTitle="Sin incidencias"
      emptyDescription="No se encontraron incidencias con los filtros aplicados."
    />
  )
}
