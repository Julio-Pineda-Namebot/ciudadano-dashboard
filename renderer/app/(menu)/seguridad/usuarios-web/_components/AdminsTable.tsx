'use client'

import { useMemo } from 'react'
import { DataTable } from '@/components/common/datatable/data-table'
import { getAdminColumns } from './admin-columns'
import type { Admin } from '../_types/admin'

interface Props {
  admins: Admin[]
  onEdit: (admin: Admin) => void
  onDelete: (admin: Admin) => void
}

export function AdminsTable({ admins, onEdit, onDelete }: Props) {
  const columns = useMemo(() => getAdminColumns({ onEdit, onDelete }), [onEdit, onDelete])

  return (
    <DataTable
      data={admins}
      columns={columns}
      searchPlaceholder="Buscar administrador..."
      searchColumn="username"
    />
  )
}
