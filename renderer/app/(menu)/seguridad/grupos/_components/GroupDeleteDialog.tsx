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
import type { Group } from '../_types/group'

interface Props {
  group: Group | null
  onClose: () => void
  onConfirm: (id: string) => Promise<void>
}

export function GroupDeleteDialog({ group, onClose, onConfirm }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    if (!group) return
    setLoading(true)
    try {
      await onConfirm(group.id)
    } finally {
      setLoading(false)
    }
  }

  const hasAdmins = (group?.adminCount ?? 0) > 0

  return (
    <AlertDialog open={group !== null} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar grupo</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que deseas eliminar <strong>&ldquo;{group?.name}&rdquo;</strong>?
            {hasAdmins && (
              <>
                {' '}Este grupo tiene <strong>{group?.adminCount}</strong> administrador(es) asignado(s).
              </>
            )}{' '}
            Esta acción no se puede deshacer.
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
