'use client'

import { useEffect, useState } from 'react'
<<<<<<< Updated upstream
import { Button } from '@/components/ui/button'
=======
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
>>>>>>> Stashed changes
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Admin, CreateAdminFormData, UpdateAdminFormData } from '../_types/admin'
import type { Group } from '../../grupos/_types/group'
import { getGroups } from '../../grupos/actions'

interface Props {
  open: boolean
  admin: Admin | null
  onClose: () => void
  onCreate: (data: CreateAdminFormData) => Promise<void>
  onUpdate: (id: string, data: UpdateAdminFormData) => Promise<void>
}

<<<<<<< Updated upstream
interface FormState {
  username: string
  password: string
=======
const SELECT_CLASS =
  'h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20'

function buildSchema(isEdit: boolean) {
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

interface FormValues {
  username?: string
  password?: string
>>>>>>> Stashed changes
  firstName: string
  lastName: string
  email: string
  groupId: string
}

<<<<<<< Updated upstream
const EMPTY_FORM: FormState = {
=======
const EMPTY_FORM: FormValues = {
>>>>>>> Stashed changes
  username: '',
  password: '',
  firstName: '',
  lastName: '',
  email: '',
  groupId: '',
}

<<<<<<< Updated upstream
const SELECT_CLASS =
  'h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50'

export function AdminFormModal({ open, admin, onClose, onCreate, onUpdate }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEdit = admin !== null
=======
export function AdminFormModal({ open, admin, onClose, onCreate, onUpdate }: Props) {
  const isEdit = admin !== null
  const [groups, setGroups] = useState<Group[]>([])
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(buildSchema(isEdit) as never),
    defaultValues: EMPTY_FORM,
  })
>>>>>>> Stashed changes

  useEffect(() => {
    if (!open) return
    setError(null)
<<<<<<< Updated upstream
    setForm(
=======
    reset(
>>>>>>> Stashed changes
      admin
        ? {
            username: admin.username,
            password: '',
            firstName: admin.firstName,
            lastName: admin.lastName,
            email: admin.email,
            groupId: admin.group?.id ?? '',
          }
        : EMPTY_FORM
    )
    getGroups()
      .then(setGroups)
      .catch(() => setGroups([]))
<<<<<<< Updated upstream
  }, [open, admin])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
=======
  }, [open, admin, reset])

  const submit = handleSubmit(async (values) => {
>>>>>>> Stashed changes
    setError(null)
    try {
      if (isEdit && admin) {
        const payload: UpdateAdminFormData = {
<<<<<<< Updated upstream
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          groupId: form.groupId,
        }
        if (form.password.trim()) payload.password = form.password
        await onUpdate(admin.id, payload)
      } else {
        const payload: CreateAdminFormData = {
          username: form.username.trim(),
          password: form.password,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          groupId: form.groupId,
=======
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.email.trim(),
          groupId: values.groupId,
        }
        if (values.password && values.password.trim()) payload.password = values.password
        await onUpdate(admin.id, payload)
      } else {
        const payload: CreateAdminFormData = {
          username: (values.username ?? '').trim(),
          password: values.password ?? '',
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.email.trim(),
          groupId: values.groupId,
>>>>>>> Stashed changes
        }
        await onCreate(payload)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
<<<<<<< Updated upstream
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-xl">
=======
    }
  })

  return (
    <Dialog open={open} onOpenChange={(v) => !v && !isSubmitting && onClose()}>
      <DialogContent className="sm:max-w-xl" dismissible={false} showCloseButton={false}>
>>>>>>> Stashed changes
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar administrador' : 'Nuevo administrador'}</DialogTitle>
        </DialogHeader>

<<<<<<< Updated upstream
        <form id="admin-form" onSubmit={handleSubmit} className="grid gap-4">
=======
        <form id="admin-form" onSubmit={submit} className="grid gap-4" noValidate>
>>>>>>> Stashed changes
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
<<<<<<< Updated upstream
                name="username"
                value={form.username}
                onChange={handleChange}
                minLength={3}
                maxLength={64}
                placeholder="jperez"
                required={!isEdit}
                disabled={isEdit}
              />
=======
                {...register('username')}
                maxLength={64}
                placeholder="jperez"
                disabled={isEdit}
                aria-invalid={!!errors.username}
              />
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username.message}</p>
              )}
>>>>>>> Stashed changes
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="password">
                Contraseña{isEdit && <span className="text-muted-foreground"> (dejar en blanco para no cambiar)</span>}
              </Label>
              <Input
                id="password"
<<<<<<< Updated upstream
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                minLength={isEdit && !form.password ? undefined : 8}
                maxLength={128}
                placeholder={isEdit ? '••••••••' : 'Mínimo 8 caracteres'}
                required={!isEdit}
                autoComplete="new-password"
              />
=======
                type="password"
                {...register('password')}
                maxLength={128}
                placeholder={isEdit ? '••••••••' : 'Mínimo 8 caracteres'}
                autoComplete="new-password"
                aria-invalid={!!errors.password}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
>>>>>>> Stashed changes
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="firstName">Nombres</Label>
              <Input
                id="firstName"
<<<<<<< Updated upstream
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                maxLength={100}
                placeholder="Juan"
                required
              />
=======
                {...register('firstName')}
                maxLength={100}
                placeholder="Juan"
                aria-invalid={!!errors.firstName}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName.message}</p>
              )}
>>>>>>> Stashed changes
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="lastName">Apellidos</Label>
              <Input
                id="lastName"
<<<<<<< Updated upstream
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                maxLength={100}
                placeholder="Pérez"
                required
              />
=======
                {...register('lastName')}
                maxLength={100}
                placeholder="Pérez"
                aria-invalid={!!errors.lastName}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName.message}</p>
              )}
>>>>>>> Stashed changes
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="email">Correo</Label>
            <Input
              id="email"
<<<<<<< Updated upstream
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              maxLength={150}
              placeholder="jperez@correo.com"
              required
            />
=======
              type="email"
              {...register('email')}
              maxLength={150}
              placeholder="jperez@correo.com"
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
>>>>>>> Stashed changes
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="groupId">Grupo</Label>
<<<<<<< Updated upstream
            <select
              id="groupId"
              name="groupId"
              value={form.groupId}
              onChange={handleChange}
              required
              className={SELECT_CLASS}
            >
              <option value="" disabled>
                Selecciona un grupo
              </option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
=======
            <Controller
              name="groupId"
              control={control}
              render={({ field }) => (
                <select
                  id="groupId"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  className={SELECT_CLASS}
                  aria-invalid={!!errors.groupId}
                >
                  <option value="" disabled>
                    Selecciona un grupo
                  </option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.groupId && (
              <p className="text-sm text-destructive">{errors.groupId.message}</p>
            )}
>>>>>>> Stashed changes
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>

<<<<<<< Updated upstream
        <DialogFooter showCloseButton>
          <Button type="submit" form="admin-form" disabled={loading}>
            {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear administrador'}
=======
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" form="admin-form" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner />
                <span>Guardando...</span>
              </>
            ) : isEdit ? 'Guardar cambios' : 'Crear administrador'}
>>>>>>> Stashed changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
