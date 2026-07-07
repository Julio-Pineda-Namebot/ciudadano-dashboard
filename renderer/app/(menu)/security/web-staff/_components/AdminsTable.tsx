'use client'

import { useMemo } from 'react'
import { DataTable } from '@/components/common/datatable/data-table'
import type { AdminsTableProps } from '@/app/(menu)/security/web-staff/_types/types'
import { getAdminColumns } from '@/app/(menu)/security/web-staff/_components/AdminColumns'

export function AdminsTable({
  admins,
  loading,
  variant = 'active',
  onEdit,
  onDelete,
  onRestore,
  onCreate,
  toolbarActions,
}: AdminsTableProps) {
  const columns = useMemo(
    () => getAdminColumns({ variant, onEdit, onDelete, onRestore }),
    [variant, onEdit, onDelete, onRestore],
  )

  const inactive = variant === 'inactive'

  return (
    <DataTable
      data={admins}
      columns={columns}
      searchPlaceholder="Buscar usuario..."
      searchColumn="username"
      onCreate={inactive ? undefined : onCreate}
      createLabel="Nuevo usuario"
      toolbarActions={toolbarActions}
      loading={loading}
      emptyTitle={inactive ? 'Sin usuarios inactivos' : 'Sin usuarios'}
      emptyDescription={
        inactive
          ? 'No hay usuarios inactivos.'
          : 'No se encontraron usuarios con los filtros aplicados.'
      }
    />
  )
}
