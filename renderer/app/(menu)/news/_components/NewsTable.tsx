'use client'

import { useMemo } from 'react'
import { DataTable } from '@/components/common/datatable/data-table'
import { getNewsColumns } from './news-columns'
import type { News } from '../_types/news'

interface Props {
  news: News[]
  onEdit: (news: News) => void
  onDelete: (news: News) => void
}

export function NewsTable({ news, onEdit, onDelete }: Props) {
  const columns = useMemo(() => getNewsColumns({ onEdit, onDelete }), [onEdit, onDelete])

  return (
    <DataTable
      data={news}
      columns={columns}
      searchPlaceholder="Buscar noticia..."
      searchColumn="title"
    />
  )
}
