'use client'

import { useMemo } from 'react'
import { DataTable } from '@/components/common/datatable/data-table'
import { getGroupColumns } from './group-columns'
import type { Group } from '../_types/group'

interface Props {
  groups: Group[]
  loading?: boolean
  onEdit: (group: Group) => void
  onDelete: (group: Group) => void
  onCreate?: () => void
}

export function GroupsTable({ groups, loading, onEdit, onDelete, onCreate }: Props) {
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
