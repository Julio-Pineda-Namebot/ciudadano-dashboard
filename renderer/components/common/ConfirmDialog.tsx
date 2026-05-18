'use client'

import { useState, type ReactNode } from 'react'
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

type ConfirmVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'

interface ConfirmDialogProps {
  open: boolean
  title: ReactNode
  description: ReactNode
  onClose: () => void
  onConfirm: () => Promise<void> | void
  confirmLabel?: ReactNode
  loadingLabel?: ReactNode
  cancelLabel?: ReactNode
  variant?: ConfirmVariant
}

export function ConfirmDialog({
  open,
  title,
  description,
  onClose,
  onConfirm,
  confirmLabel = 'Eliminar',
  loadingLabel = 'Eliminando...',
  cancelLabel = 'Cancelar',
  variant = 'destructive',
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    setLoading(true)
    try {
      await onConfirm()
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && !loading && onClose()}>
      <AlertDialogContent size="sm" dismissible={false}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <AlertDialogAction variant={variant} onClick={handleConfirm} disabled={loading}>
            {loading ? (
              <>
                <Spinner />
                <span>{loadingLabel}</span>
              </>
            ) : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ConfirmDialog
