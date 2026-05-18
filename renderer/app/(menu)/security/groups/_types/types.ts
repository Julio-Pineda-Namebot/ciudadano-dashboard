import { z } from 'zod'

export interface Group {
  id: string
  name: string
  description: string | null
  adminCount: number
  createdAt: string
  updatedAt: string
}

export interface GroupFormData {
  name: string
  description?: string
}

export const groupSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio').max(64, 'Máximo 64 caracteres'),
  description: z.string().trim().max(255, 'Máximo 255 caracteres').optional().or(z.literal('')),
})

export type GroupFormValues = z.infer<typeof groupSchema>

export const EMPTY_GROUP_FORM: GroupFormValues = {
  name: '',
  description: '',
}

export const groupFilterSchema = z.object({
  range: z.object({ from: z.string(), to: z.string() }),
})

export type GroupFilterValues = z.infer<typeof groupFilterSchema>

export interface GroupFormModalProps {
  open: boolean
  group: Group | null
  onClose: () => void
  onSubmit: (data: GroupFormData) => Promise<void>
}

export interface GroupDeleteDialogProps {
  group: Group | null
  onClose: () => void
  onConfirm: (id: string) => Promise<void>
}

export interface GroupsTableProps {
  groups: Group[]
  loading?: boolean
  onEdit: (group: Group) => void
  onDelete: (group: Group) => void
  onCreate?: () => void
}

export interface GroupColumnsActions {
  onEdit: (group: Group) => void
  onDelete: (group: Group) => void
}
