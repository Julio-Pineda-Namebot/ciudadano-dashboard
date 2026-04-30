'use client'

import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { IncidentReport } from '../_types/incident-report'

interface Props {
  report: IncidentReport | null
  onClose: () => void
  onConfirm: (id: string) => Promise<void>
}

export function IncidentReportDeleteDialog({ report, onClose, onConfirm }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    if (!report) return
    setLoading(true)
    try {
      await onConfirm(report.id)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={report !== null} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar incidencia</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que deseas eliminar la incidencia de tipo{' '}
            <strong>&ldquo;{report?.incidentType}&rdquo;</strong>? Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleConfirm} disabled={loading}>
            {loading ? 'Eliminando...' : 'Eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
