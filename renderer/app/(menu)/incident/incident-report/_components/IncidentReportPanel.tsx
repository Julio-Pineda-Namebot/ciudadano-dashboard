'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { Filter } from '@/components/common/form/filter'
import { useDateRangeFilter, type DateRangeValue } from '@/lib/date-range'
import { IncidentReportTable } from './IncidentReportTable'
import { IncidentReportFormModal } from './IncidentReportFormModal'
import { IncidentReportDeleteDialog } from './IncidentReportDeleteDialog'
import {
  getIncidentReports,
  updateIncidentReport,
  deleteIncidentReport,
} from '../actions'
import type { IncidentReport, IncidentReportUpdateData } from '../_types/incident-report'

const filterSchema = z.object({
  range: z.object({ from: z.string(), to: z.string() }),
})

type FilterValues = z.infer<typeof filterSchema>

export function IncidentReportPanel() {
  const [reports, setReports] = useState<IncidentReport[]>([])
  const [loading, setLoading] = useState(true)
  const [editTarget, setEditTarget] = useState<IncidentReport | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<IncidentReport | null>(null)
  const { dateRange, onApply, filteredData } = useDateRangeFilter(reports, 'createdAt')

  useEffect(() => {
    setLoading(true)
    getIncidentReports()
      .then(setReports)
      .catch(() => toast.error('No se pudieron cargar las incidencias'))
      .finally(() => setLoading(false))
  }, [])

  function closeForm() {
    setEditTarget(null)
  }

  async function handleSubmit(data: IncidentReportUpdateData) {
    if (!editTarget) return
    const updated = await updateIncidentReport(editTarget.id, data)
    setReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
    toast.success('Incidencia actualizada correctamente')
    closeForm()
  }

  async function handleDelete(id: string) {
    await deleteIncidentReport(id)
    setReports((prev) => prev.filter((r) => r.id !== id))
    setDeleteTarget(null)
    toast.success('Incidencia eliminada correctamente')
  }

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Reportes de incidencias</h1>
      </div>

      <Filter<FilterValues>
        schema={filterSchema}
        defaultValues={{ range: dateRange }}
        body={['range']}
        config={{
          fields: {
            range: { type: 'date-range-picker', label: 'Rango de fechas' },
          },
        }}
        onSubmit={(values) => onApply(values.range as DateRangeValue)}
      />

      <IncidentReportTable
        reports={filteredData}
        loading={loading}
        onEdit={setEditTarget}
        onDelete={setDeleteTarget}
      />

      <IncidentReportFormModal
        open={!!editTarget}
        report={editTarget}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />

      <IncidentReportDeleteDialog
        report={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
