'use client'

import { useMemo } from 'react'
import { DataTable } from '@/components/common/datatable/data-table'
import { getIncidentReportColumns } from './incident-report-columns'
import type { IncidentReport } from '../_types/incident-report'

interface Props {
  reports: IncidentReport[]
  onEdit: (report: IncidentReport) => void
  onDelete: (report: IncidentReport) => void
}

export function IncidentReportTable({ reports, onEdit, onDelete }: Props) {
  const columns = useMemo(() => getIncidentReportColumns({ onEdit, onDelete }), [onEdit, onDelete])

  return (
    <DataTable
      data={reports}
      columns={columns}
      searchPlaceholder="Buscar incidencia..."
      searchColumn="description"
      pageSize={5}
    />
  )
}
