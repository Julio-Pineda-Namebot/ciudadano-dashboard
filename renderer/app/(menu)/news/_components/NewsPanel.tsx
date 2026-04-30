'use client'

import { useEffect, useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { NewsTable } from './NewsTable'
import { NewsFormModal } from './NewsFormModal'
import { NewsDeleteDialog } from './NewsDeleteDialog'
import { getNews, createNews, updateNews, deleteNews } from '../actions'
import type { News, NewsFormData } from '../_types/news'

export function NewsPanel() {
  const [news, setNews] = useState<News[]>([])
  const [editTarget, setEditTarget] = useState<News | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<News | null>(null)
  const [formOpen, setFormOpen] = useState(false)

  useEffect(() => {
    getNews().then(setNews)
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
    if (editTarget) {
      const updated = await updateNews(editTarget.id, data)
      setNews((prev) => prev.map((n) => (n.id === updated.id ? updated : n)))
      toast.success('Noticia actualizada correctamente')
    } else {
      const created = await createNews(data)
      setNews((prev) => [...prev, created])
      toast.success('Noticia creada correctamente')
    }
    closeForm()
  }

  async function handleDelete(id: number) {
    await deleteNews(id)
    setNews((prev) => prev.filter((n) => n.id !== id))
    setDeleteTarget(null)
    toast.success('Noticia eliminada correctamente')
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Noticias</h1>
          <p className="text-sm text-muted-foreground">{news.length} registros</p>
        </div>
        <Button onClick={openCreate}>
          <PlusIcon />
          Nueva noticia
        </Button>
      </div>

      <NewsTable news={news} onEdit={openEdit} onDelete={setDeleteTarget} />

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
