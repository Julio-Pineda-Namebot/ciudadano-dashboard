'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { News, NewsFormData } from '../_types/news'

interface Props {
  open: boolean
  news: News | null
  onClose: () => void
  onSubmit: (data: NewsFormData) => Promise<void>
}

const EMPTY_FORM: NewsFormData = {
  title: '',
  summary: '',
  content: '',
  image: '',
  date: '',
  tag: '',
}

export function NewsFormModal({ open, news, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<NewsFormData>(EMPTY_FORM)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(news ? { title: news.title, summary: news.summary, content: news.content, image: news.image, date: news.date, tag: news.tag } : EMPTY_FORM)
    }
  }, [open, news])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(form)
    } finally {
      setLoading(false)
    }
  }

  const isEdit = news !== null

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar noticia' : 'Nueva noticia'}</DialogTitle>
        </DialogHeader>

        <form id="news-form" onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Título de la noticia"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="tag">Etiqueta</Label>
              <Input
                id="tag"
                name="tag"
                value={form.tag}
                onChange={handleChange}
                placeholder="ej. seguridad, clima"
                required
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="image">URL de imagen</Label>
            <Input
              id="image"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="summary">Resumen</Label>
            <textarea
              id="summary"
              name="summary"
              value={form.summary}
              onChange={handleChange}
              rows={2}
              placeholder="Breve resumen visible en la lista..."
              required
              className="h-auto w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-2 text-sm shadow-xs outline-none resize-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="content">Contenido completo</Label>
            <textarea
              id="content"
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={5}
              placeholder="Texto completo de la noticia..."
              required
              className="h-auto w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-2 text-sm shadow-xs outline-none resize-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
        </form>

        <DialogFooter showCloseButton>
          <Button type="submit" form="news-form" disabled={loading}>
            {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear noticia'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
