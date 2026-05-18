'use client'

import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import type { NewsDeleteDialogProps } from '@/app/(menu)/news/_types/types'

export function NewsDeleteDialog({ news, onClose, onConfirm }: NewsDeleteDialogProps) {
  return (
    <ConfirmDialog
      open={news !== null}
      title="Eliminar noticia"
      description={
        <>
          ¿Estás seguro de que deseas eliminar <strong>&ldquo;{news?.title}&rdquo;</strong>? Esta acción no se puede deshacer.
        </>
      }
      onClose={onClose}
      onConfirm={async () => {
        if (news) await onConfirm(news.id)
      }}
    />
  )
}
