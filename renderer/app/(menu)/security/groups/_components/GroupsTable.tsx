'use client'

import { useMemo } from 'react'
import { DataTable } from '@/components/common/datatable/data-table'
import { getGroupColumns } from '@/app/(menu)/security/groups/_components/GroupColumns'
import type { GroupsTableProps } from '@/app/(menu)/security/groups/_types/types'

export function GroupsTable({ groups, loading, onEdit, onDelete, onCreate }: GroupsTableProps) {
  const columns = useMemo(() => getGroupColumns({ onEdit, onDelete }), [onEdit, onDelete])

  return (
    <DataTable
      data={groups}
      columns={columns}
      searchPlaceholder="Buscar grupo..."
      searchColumn="name"
      onCreate={onCreate}
      createLabel="Nuevo grupo"
      loading={loading}
      emptyTitle="Sin grupos"
      emptyDescription="No se encontraron grupos con los filtros aplicados."
    />
  )
}
