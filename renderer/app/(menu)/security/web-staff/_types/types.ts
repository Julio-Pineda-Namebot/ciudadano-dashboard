import { z } from 'zod'
import type { ReactNode } from 'react'

export interface AdminGroupRef {
  id: string
  name: string
}

export interface Admin {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
  group: AdminGroupRef
  isActive: boolean
  createdAt: string
}

export interface CreateAdminFormData {
  username: string
  password: string
  firstName: string
  lastName: string
  email: string
  groupId: string
}

export interface UpdateAdminFormData {
  password?: string
  firstName?: string
  lastName?: string
  email?: string
  groupId?: string
}

export function buildAdminSchema(isEdit: boolean) {
  return z.object({
    username: isEdit
      ? z.string().optional()
      : z.string().trim().min(3, 'Mínimo 3 caracteres').max(64, 'Máximo 64 caracteres'),
    password: isEdit
      ? z
          .string()
          .max(128, 'Máximo 128 caracteres')
          .refine((v) => !v || v.length >= 8, 'Mínimo 8 caracteres')
          .optional()
          .or(z.literal(''))
      : z.string().min(8, 'Mínimo 8 caracteres').max(128, 'Máximo 128 caracteres'),
    firstName: z.string().trim().min(1, 'El nombre es obligatorio').max(100, 'Máximo 100 caracteres'),
    lastName: z.string().trim().min(1, 'El apellido es obligatorio').max(100, 'Máximo 100 caracteres'),
    email: z
      .string()
      .trim()
      .min(1, 'El correo es obligatorio')
      .max(150, 'Máximo 150 caracteres')
      .email('Correo inválido'),
    groupId: z.string().min(1, 'Debes seleccionar un grupo'),
  })
}

export interface AdminFormValues {
  username?: string
  password?: string
  firstName: string
  lastName: string
  email: string
  groupId: string
}

export const EMPTY_ADMIN_FORM: AdminFormValues = {
  username: '',
  password: '',
  firstName: '',
  lastName: '',
  email: '',
  groupId: '',
}

export const adminFilterSchema = z.object({
  range: z.object({ from: z.string(), to: z.string() }),
})

export type AdminFilterValues = z.infer<typeof adminFilterSchema>

export interface AdminFormModalProps {
  open: boolean
  admin: Admin | null
  onClose: () => void
  onCreate: (data: CreateAdminFormData) => Promise<void>
  onUpdate: (id: string, data: UpdateAdminFormData) => Promise<void>
}

export interface AdminDeleteDialogProps {
  admin: Admin | null
  onClose: () => void
  onConfirm: (id: string) => Promise<void>
}

export interface AdminRestoreDialogProps {
  admin: Admin | null
  onClose: () => void
  onConfirm: (id: string) => Promise<void>
}

export type AdminsTableVariant = 'active' | 'inactive'

export interface AdminsTableProps {
  admins: Admin[]
  loading?: boolean
  variant?: AdminsTableVariant
  onEdit?: (admin: Admin) => void
  onDelete?: (admin: Admin) => void
  onRestore?: (admin: Admin) => void
  onCreate?: () => void
  toolbarActions?: ReactNode
}

export interface AdminColumnsActions {
  variant?: AdminsTableVariant
  onEdit?: (admin: Admin) => void
  onDelete?: (admin: Admin) => void
  onRestore?: (admin: Admin) => void
}
