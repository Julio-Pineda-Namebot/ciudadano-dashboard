'use client'

import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import type { AdminRestoreDialogProps } from '@/app/(menu)/security/web-staff/_types/types'

export function AdminRestoreDialog({ admin, onClose, onConfirm }: AdminRestoreDialogProps) {
  return (
    <ConfirmDialog
      open={admin !== null}
      title="Reactivar usuario"
      description={
        <>
          ¿Deseas reactivar al usuario{' '}
          <strong>&ldquo;{admin?.username}&rdquo;</strong>? Volverá a estar activo y podrá
          iniciar sesión.
        </>
      }
      confirmLabel="Reactivar"
      loadingLabel="Reactivando..."
      variant="default"
      onClose={onClose}
      onConfirm={async () => {
        if (admin) await onConfirm(admin.id)
      }}
    />
  )
}
