'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Filter } from '@/components/common/form/filter'
import { useDateRangeFilter, type DateRangeValue } from '@/lib/date-range'
import { IncidentReportTable } from '@/app/(menu)/incident/incident-report/_components/IncidentReportTable'
import { IncidentReportFormModal } from '@/app/(menu)/incident/incident-report/_components/IncidentReportFormModal'
import { IncidentReportDeleteDialog } from '@/app/(menu)/incident/incident-report/_components/IncidentReportDeleteDialog'
import { IncidentReportViewModal } from '@/app/(menu)/incident/incident-report/_components/IncidentReportViewModal'
import {
  getIncidentReports,
  updateIncidentReport,
  deleteIncidentReport,
} from '@/app/(menu)/incident/incident-report/actions'
import { INCIDENTS_CHANGED_EVENT } from '@/app/(menu)/_components/notificationsTypes'
import { filterSchema } from '@/app/(menu)/incident/incident-report/_types/types'
import type { IncidentReport, IncidentReportUpdateData, IncidentReportPanelProps, FilterValues } from '@/app/(menu)/incident/incident-report/_types/types'

export function IncidentReportPanel({ initialReports }: IncidentReportPanelProps) {
  const [reports, setReports] = useState<IncidentReport[]>(initialReports)
  const [viewTarget, setViewTarget] = useState<IncidentReport | null>(null)
  const [editTarget, setEditTarget] = useState<IncidentReport | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<IncidentReport | null>(null)
  const { dateRange, onApply, filteredData } = useDateRangeFilter(reports, 'createdAt')

  // Tiempo real: refresca la grilla cuando llega una incidencia nueva, cambia
  // un estado o se registra una validación (eventos del SocketProvider admin).
  useEffect(() => {
    const onChanged = () => {
      getIncidentReports().then(setReports)
    }
    window.addEventListener(INCIDENTS_CHANGED_EVENT, onChanged)
    return () => window.removeEventListener(INCIDENTS_CHANGED_EVENT, onChanged)
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
        onView={setViewTarget}
        onEdit={setEditTarget}
        onDelete={setDeleteTarget}
      />

      <IncidentReportViewModal
        open={!!viewTarget}
        report={viewTarget}
        onClose={() => setViewTarget(null)}
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
