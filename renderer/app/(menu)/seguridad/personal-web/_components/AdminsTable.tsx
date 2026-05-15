'use client'

import { useMemo } from 'react'
import { DataTable } from '@/components/common/datatable/data-table'
import { getAdminColumns } from './admin-columns'
import type { Admin } from '../_types/admin'

interface Props {
  admins: Admin[]
  loading?: boolean
  onEdit: (admin: Admin) => void
  onDelete: (admin: Admin) => void
  onCreate?: () => void
}

export function AdminsTable({ admins, loading, onEdit, onDelete, onCreate }: Props) {
  const columns = useMemo(() => getAdminColumns({ onEdit, onDelete }), [onEdit, onDelete])

  return (
    <DataTable
      data={admins}
      columns={columns}
      searchPlaceholder="Buscar usuario..."
      searchColumn="username"
      onCreate={onCreate}
      createLabel="Nuevo usuario"
      loading={loading}
      emptyTitle="Sin usuarios"
      emptyDescription="No se encontraron usuarios con los filtros aplicados."
    />
  )
}
