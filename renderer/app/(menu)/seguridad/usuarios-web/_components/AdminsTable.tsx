'use client'

import { useMemo } from 'react'
import { DataTable } from '@/components/common/datatable/data-table'
import { getAdminColumns } from './admin-columns'
import type { Admin } from '../_types/admin'

interface Props {
  admins: Admin[]
<<<<<<< Updated upstream
  onEdit: (admin: Admin) => void
  onDelete: (admin: Admin) => void
}

export function AdminsTable({ admins, onEdit, onDelete }: Props) {
=======
  loading?: boolean
  onEdit: (admin: Admin) => void
  onDelete: (admin: Admin) => void
  onCreate?: () => void
}

export function AdminsTable({ admins, loading, onEdit, onDelete, onCreate }: Props) {
>>>>>>> Stashed changes
  const columns = useMemo(() => getAdminColumns({ onEdit, onDelete }), [onEdit, onDelete])

  return (
    <DataTable
      data={admins}
      columns={columns}
      searchPlaceholder="Buscar administrador..."
      searchColumn="username"
<<<<<<< Updated upstream
=======
      onCreate={onCreate}
      createLabel="Nuevo administrador"
      loading={loading}
      emptyTitle="Sin administradores"
      emptyDescription="No se encontraron administradores con los filtros aplicados."
>>>>>>> Stashed changes
    />
  )
}
