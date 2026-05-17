'use client'

import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
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
    <AlertDialog open={group !== null} onOpenChange={(v) => !v && !loading && onClose()}>
      <AlertDialogContent size="sm" dismissible={false}>
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
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <AlertDialogAction variant="destructive" onClick={handleConfirm} disabled={loading}>
            {loading ? (
              <>
                <Spinner />
                <span>Eliminando...</span>
              </>
            ) : 'Eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
