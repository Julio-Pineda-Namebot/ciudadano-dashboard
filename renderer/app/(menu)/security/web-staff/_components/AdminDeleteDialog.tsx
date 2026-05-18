'use client'

import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import type { AdminDeleteDialogProps } from '@/app/(menu)/security/web-staff/_types/types'

export function AdminDeleteDialog({ admin, onClose, onConfirm }: AdminDeleteDialogProps) {
  return (
    <ConfirmDialog
      open={admin !== null}
      title="Eliminar usuario"
      description={
        <>
          ¿Estás seguro de que deseas eliminar al usuario{' '}
          <strong>&ldquo;{admin?.username}&rdquo;</strong>? Esta acción no se puede deshacer.
        </>
      }
      onClose={onClose}
      onConfirm={async () => {
        if (admin) await onConfirm(admin.id)
      }}
    />
  )
}
