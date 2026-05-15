'use client'

import { useMemo } from 'react'
import { DataTable } from '@/components/common/datatable/data-table'
import { getNewsColumns } from './news-columns'
import type { News } from '../_types/news'

interface Props {
  news: News[]
  loading?: boolean
  onEdit: (news: News) => void
  onDelete: (news: News) => void
  onCreate?: () => void
}

export function NewsTable({ news, loading, onEdit, onDelete, onCreate }: Props) {
  const columns = useMemo(() => getNewsColumns({ onEdit, onDelete }), [onEdit, onDelete])

  return (
    <DataTable
      data={news}
      columns={columns}
      searchPlaceholder="Buscar noticia..."
      searchColumn="title"
      onCreate={onCreate}
      createLabel="Nueva noticia"
      loading={loading}
      emptyTitle="Sin noticias"
      emptyDescription="No se encontraron noticias con los filtros aplicados."
    />
  )
}
