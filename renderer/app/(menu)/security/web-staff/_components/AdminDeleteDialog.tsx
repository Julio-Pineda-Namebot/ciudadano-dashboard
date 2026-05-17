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
import type { Admin } from '../_types/admin'

interface Props {
  admin: Admin | null
  onClose: () => void
  onConfirm: (id: string) => Promise<void>
}

export function AdminDeleteDialog({ admin, onClose, onConfirm }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    if (!admin) return
    setLoading(true)
    try {
      await onConfirm(admin.id)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={admin !== null} onOpenChange={(v) => !v && !loading && onClose()}>
      <AlertDialogContent size="sm" dismissible={false}>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar usuario</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que deseas eliminar al usuario{' '}
            <strong>&ldquo;{admin?.username}&rdquo;</strong>? Esta acción no se puede deshacer.
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
