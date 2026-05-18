'use client'

import { useMemo } from 'react'
import { DataTable } from '@/components/common/datatable/data-table'
import type { AdminsTableProps } from '@/app/(menu)/security/web-staff/_types/types'
import { getAdminColumns } from '@/app/(menu)/security/web-staff/_components/AdminColumns'

export function AdminsTable({ admins, loading, onEdit, onDelete, onCreate }: AdminsTableProps) {
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
