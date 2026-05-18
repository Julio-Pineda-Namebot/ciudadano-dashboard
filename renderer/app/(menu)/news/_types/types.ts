import { z } from 'zod'

const newsBaseSchema = z.object({
  title: z.string().trim().min(1, 'El título es obligatorio'),
  date: z.date({ message: 'La fecha es obligatoria' }),
  tag: z.string().trim().min(1, 'La etiqueta es obligatoria'),
  summary: z.string().trim().min(1, 'El resumen es obligatorio'),
  content: z.string().trim().min(1, 'El contenido es obligatorio'),
})

export const newsCreateSchema = newsBaseSchema.extend({
  image: z.instanceof(File, { message: 'La imagen es obligatoria' }),
})

export const newsUpdateSchema = newsBaseSchema.extend({
  image: z.instanceof(File).optional(),
})

export type NewsFormValues = {
  title: string
  date: Date | undefined
  tag: string
  summary: string
  content: string
  image: File | undefined
}

export const EMPTY_NEWS_FORM: NewsFormValues = {
  title: '',
  summary: '',
  content: '',
  image: undefined,
  date: undefined,
  tag: '',
}

export interface News {
  id: string
  title: string
  summary: string
  content: string
  image: string
  date: string
  tag: string
  createdAt?: string
  updatedAt?: string
}

export interface NewsFormData {
  title: string
  summary: string
  content: string
  date: string
  tag: string
  image?: File
}

export type NewsFilterValues = {
  range: { from: string; to: string }
}

export interface NewsFormModalProps {
  open: boolean
  news: News | null
  onClose: () => void
  onSubmit: (data: NewsFormData) => Promise<void>
}

export interface NewsColumnsActions {
  onEdit: (news: News) => void
  onDelete: (news: News) => void
}

export const NEWS_TAG_COLORS: Record<string, string> = {
  seguridad: 'bg-blue-100 text-blue-700',
  robo: 'bg-red-100 text-red-700',
  clima: 'bg-sky-100 text-sky-700',
  tránsito: 'bg-yellow-100 text-yellow-700',
}

export interface NewsDeleteDialogProps {
  news: News | null
  onClose: () => void
  onConfirm: (id: string) => Promise<void>
}

export interface NewsTableProps {
  news: News[]
  loading?: boolean
  onEdit: (news: News) => void
  onDelete: (news: News) => void
  onCreate?: () => void
}
