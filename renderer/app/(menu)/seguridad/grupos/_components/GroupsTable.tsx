'use client'

import { useMemo } from 'react'
import { DataTable } from '@/components/common/datatable/data-table'
import { getGroupColumns } from './group-columns'
import type { Group } from '../_types/group'

interface Props {
  groups: Group[]
  onEdit: (group: Group) => void
  onDelete: (group: Group) => void
}

export function GroupsTable({ groups, onEdit, onDelete }: Props) {
  const columns = useMemo(() => getGroupColumns({ onEdit, onDelete }), [onEdit, onDelete])

  return (
    <DataTable
      data={groups}
      columns={columns}
      searchPlaceholder="Buscar grupo..."
      searchColumn="name"
    />
  )
}
