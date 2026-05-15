'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { Filter } from '@/components/common/form/filter'
import { useDateRangeFilter, type DateRangeValue } from '@/lib/date-range'
import { NewsTable } from './NewsTable'
import { NewsFormModal } from './NewsFormModal'
import { NewsDeleteDialog } from './NewsDeleteDialog'
import { getNews, createNews, updateNews, deleteNews } from '../actions'
import type { News, NewsFormData } from '../_types/news'

const filterSchema = z.object({
  range: z.object({ from: z.string(), to: z.string() }),
})

type FilterValues = z.infer<typeof filterSchema>

export function NewsPanel() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [editTarget, setEditTarget] = useState<News | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<News | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const { dateRange, onApply, filteredData } = useDateRangeFilter(news, 'date')

  useEffect(() => {
    setLoading(true)
    getNews()
      .then(setNews)
      .catch(() => toast.error('No se pudieron cargar las noticias'))
      .finally(() => setLoading(false))
  }, [])

  function openCreate() {
    setEditTarget(null)
    setFormOpen(true)
  }

  function openEdit(item: News) {
    setEditTarget(item)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setEditTarget(null)
  }

  async function handleSubmit(data: NewsFormData) {
    try {
      if (editTarget) {
        const updated = await updateNews(editTarget.id, data)
        setNews((prev) => prev.map((n) => (n.id === updated.id ? updated : n)))
        toast.success('Noticia actualizada correctamente')
      } else {
        const created = await createNews(data)
        setNews((prev) => [created, ...prev])
        toast.success('Noticia creada correctamente')
      }
      closeForm()
    } catch {
      toast.error(editTarget ? 'No se pudo actualizar la noticia' : 'No se pudo crear la noticia')
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteNews(id)
      setNews((prev) => prev.filter((n) => n.id !== id))
      setDeleteTarget(null)
      toast.success('Noticia eliminada correctamente')
    } catch {
      toast.error('No se pudo eliminar la noticia')
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Noticias</h1>
      </div>

      <Filter<FilterValues>
        schema={filterSchema}
        defaultValues={{ range: dateRange }}
        body={['range']}
        config={{
          fields: {
            range: { type: 'date-range-picker', label: 'Rango de fechas' },
          },

        }}
        onSubmit={(values) => onApply(values.range as DateRangeValue)}
      />

      <NewsTable
        news={filteredData}
        loading={loading}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        onCreate={openCreate}
      />

      <NewsFormModal
        open={formOpen}
        news={editTarget}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />

      <NewsDeleteDialog
        news={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
