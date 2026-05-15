'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useModuleTheme, MODULE_BUTTON_CLASS } from '@/components/common/module-theme'
import { cn } from '@/lib/utils'
import type { News, NewsFormData } from '../_types/news'

interface Props {
  open: boolean
  news: News | null
  onClose: () => void
  onSubmit: (data: NewsFormData) => Promise<void>
}

const newsSchema = z.object({
  title: z.string().trim().min(1, 'El título es obligatorio'),
  date: z.string().min(1, 'La fecha es obligatoria'),
  tag: z.string().trim().min(1, 'La etiqueta es obligatoria'),
  image: z.string().trim().optional().or(z.literal('')),
  summary: z.string().trim().min(1, 'El resumen es obligatorio'),
  content: z.string().trim().min(1, 'El contenido es obligatorio'),
})

type NewsFormValues = z.infer<typeof newsSchema>

const EMPTY_FORM: NewsFormValues = {
  title: '',
  summary: '',
  content: '',
  image: '',
  date: '',
  tag: '',
}

export function NewsFormModal({ open, news, onClose, onSubmit }: Props) {
  const theme = useModuleTheme()
  const btnClass = theme?.color ? MODULE_BUTTON_CLASS[theme.color] : ''
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema as never),
    defaultValues: EMPTY_FORM,
  })

  useEffect(() => {
    if (open) {
      reset(
        news
          ? {
              title: news.title,
              summary: news.summary,
              content: news.content,
              image: news.image,
              date: news.date,
              tag: news.tag,
            }
          : EMPTY_FORM
      )
    }
  }, [open, news, reset])

  const submit = handleSubmit(async (values) => {
    await onSubmit({ ...values, image: values.image ?? '' } as NewsFormData)
  })

  const isEdit = news !== null

  return (
    <Dialog open={open} onOpenChange={(v) => !v && !isSubmitting && onClose()}>
      <DialogContent className="sm:max-w-2xl" dismissible={false} showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar noticia' : 'Nueva noticia'}</DialogTitle>
        </DialogHeader>

        <form id="news-form" onSubmit={submit} className="grid gap-4" noValidate>
          <div className="grid gap-1.5">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Título de la noticia"
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                {...register('date')}
                aria-invalid={!!errors.date}
              />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="tag">Etiqueta</Label>
              <Input
                id="tag"
                {...register('tag')}
                placeholder="ej. seguridad, clima"
                aria-invalid={!!errors.tag}
              />
              {errors.tag && (
                <p className="text-sm text-destructive">{errors.tag.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="image">URL de imagen</Label>
            <Input
              id="image"
              {...register('image')}
              placeholder="https://..."
              aria-invalid={!!errors.image}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="summary">Resumen</Label>
            <textarea
              id="summary"
              {...register('summary')}
              rows={2}
              placeholder="Breve resumen visible en la lista..."
              aria-invalid={!!errors.summary}
              className="h-auto w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-2 text-sm shadow-xs outline-none resize-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
            />
            {errors.summary && (
              <p className="text-sm text-destructive">{errors.summary.message}</p>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="content">Contenido completo</Label>
            <textarea
              id="content"
              {...register('content')}
              rows={5}
              placeholder="Texto completo de la noticia..."
              aria-invalid={!!errors.content}
              className="h-auto w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-2 text-sm shadow-xs outline-none resize-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content.message}</p>
            )}
          </div>
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" form="news-form" disabled={isSubmitting} className={cn(btnClass)}>
            {isSubmitting ? (
              <>
                <Spinner />
                <span>Guardando...</span>
              </>
            ) : isEdit ? 'Guardar cambios' : 'Crear noticia'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
