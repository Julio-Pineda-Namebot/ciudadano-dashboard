'use client'

import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import type { GroupDeleteDialogProps } from '@/app/(menu)/security/groups/_types/types'

export function GroupDeleteDialog({ group, onClose, onConfirm }: GroupDeleteDialogProps) {
  const hasAdmins = (group?.adminCount ?? 0) > 0

  return (
    <ConfirmDialog
      open={group !== null}
      title="Eliminar grupo"
      description={
        <>
          ¿Estás seguro de que deseas eliminar <strong>&ldquo;{group?.name}&rdquo;</strong>?
          {hasAdmins && (
            <>
              {' '}Este grupo tiene <strong>{group?.adminCount}</strong> administrador(es) asignado(s).
            </>
          )}{' '}
          Esta acción no se puede deshacer.
        </>
      }
      onClose={onClose}
      onConfirm={async () => {
        if (group) await onConfirm(group.id)
      }}
    />
  )
}
