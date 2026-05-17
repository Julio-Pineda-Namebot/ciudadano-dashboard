import { z } from 'zod'

export const newsSchema = z.object({
  title: z.string().trim().min(1, 'El título es obligatorio'),
  date: z.string().min(1, 'La fecha es obligatoria'),
  tag: z.string().trim().min(1, 'La etiqueta es obligatoria'),
  image: z.string().trim().optional().or(z.literal('')),
  summary: z.string().trim().min(1, 'El resumen es obligatorio'),
  content: z.string().trim().min(1, 'El contenido es obligatorio'),
})

export const EMPTY_NEWS_FORM: z.infer<typeof newsSchema> = {
  title: '',
  summary: '',
  content: '',
  image: '',
  date: '',
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

export type NewsFormData = Omit<News, 'id' | 'createdAt' | 'updatedAt'>

export type NewsFilterValues = {
  range: { from: string; to: string }
}

export type NewsFormValues = {
  title: string
  date: string
  tag: string
  image?: string | ''
  summary: string
  content: string
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
