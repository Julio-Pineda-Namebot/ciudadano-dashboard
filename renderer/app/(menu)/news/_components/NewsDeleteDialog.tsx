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
import type { News } from '../_types/news'

interface Props {
  news: News | null
  onClose: () => void
  onConfirm: (id: number) => Promise<void>
}

export function NewsDeleteDialog({ news, onClose, onConfirm }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    if (!news) return
    setLoading(true)
    try {
      await onConfirm(news.id)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={news !== null} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar noticia</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que deseas eliminar <strong>&ldquo;{news?.title}&rdquo;</strong>? Esta acción no se puede deshacer.
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
