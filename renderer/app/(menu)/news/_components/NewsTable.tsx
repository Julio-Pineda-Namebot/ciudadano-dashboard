'use client'

import { useMemo } from 'react'
import { DataTable } from '@/components/common/datatable/data-table'
import { getNewsColumns } from '@/app/(menu)/news/_components/NewsColumns'
import type { NewsTableProps } from '@/app/(menu)/news/_types/types'

export function NewsTable({ news, loading, onEdit, onDelete, onCreate }: NewsTableProps) {
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
