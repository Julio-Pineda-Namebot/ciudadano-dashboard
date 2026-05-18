'use client'

import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import type { IncidentReportDeleteDialogProps } from '@/app/(menu)/incident/incident-report/_types/types'

export function IncidentReportDeleteDialog({ report, onClose, onConfirm }: IncidentReportDeleteDialogProps) {
  return (
    <ConfirmDialog
      open={report !== null}
      title="Eliminar incidencia"
      description={
        <>
          ¿Estás seguro de que deseas eliminar la incidencia de tipo{' '}
          <strong>&ldquo;{report?.incidentType}&rdquo;</strong>? Esta acción no se puede deshacer.
        </>
      }
      onClose={onClose}
      onConfirm={async () => {
        if (report) await onConfirm(report.id)
      }}
    />
  )
}
