'use client'

import { useEffect, useState } from 'react'
import { DownloadCloudIcon } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Filter } from '@/components/common/form/filter'
import { useDateRangeFilter, type DateRangeValue } from '@/lib/date-range'
import { NewsTable } from '@/app/(menu)/news/_components/NewsTable'
import { NewsFormModal } from '@/app/(menu)/news/_components/NewsFormModal'
import { NewsDeleteDialog } from '@/app/(menu)/news/_components/NewsDeleteDialog'
import { getNews, createNews, updateNews, deleteNews, ingestNews } from '@/app/(menu)/news/actions'
import type { News, NewsFormData, NewsFilterValues } from '@/app/(menu)/news/_types/types'

const filterSchema = z.object({
  range: z.object({ from: z.string(), to: z.string() }),
})

export function NewsPanel() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [editTarget, setEditTarget] = useState<News | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<News | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [ingesting, setIngesting] = useState(false)
  const { dateRange, onApply, filteredData } = useDateRangeFilter(news, 'date')

  useEffect(() => {
    getNews()
      .then(setNews)
      .catch(() => toast.error('No se pudieron cargar las noticias'))
      .finally(() => setLoading(false))
  }, [])

  async function handleIngest() {
    setIngesting(true)
    try {
      const result = await ingestNews()
      if (result.created > 0) {
        const fresh = await getNews()
        setNews(fresh)
        toast.success(`Se importaron ${result.created} noticias de Ica`)
      } else {
        toast.info('No hay noticias nuevas de Ica por ahora')
      }
    } catch {
      toast.error('No se pudo importar noticias externas')
    } finally {
      setIngesting(false)
    }
  }

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
      <Filter<NewsFilterValues>
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
        toolbarActions={
          <Button variant="outline" onClick={handleIngest} disabled={ingesting}>
            {ingesting ? <Spinner /> : <DownloadCloudIcon />}
            Importar de Ica
          </Button>
        }
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
