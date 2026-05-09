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

interface FormState {
  username: string
  password: string
  firstName: string
  lastName: string
  email: string
  groupId: string
}

const EMPTY_FORM: FormState = {
  username: '',
  password: '',
  firstName: '',
  lastName: '',
  email: '',
  groupId: '',
}

const SELECT_CLASS =
  'h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50'

export function AdminFormModal({ open, admin, onClose, onCreate, onUpdate }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEdit = admin !== null

  useEffect(() => {
    if (!open) return
    setError(null)
    setForm(
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
    setError(null)
    try {
      if (isEdit && admin) {
        const payload: UpdateAdminFormData = {
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
        }
        await onCreate(payload)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar administrador' : 'Nuevo administrador'}</DialogTitle>
        </DialogHeader>

        <form id="admin-form" onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                minLength={3}
                maxLength={64}
                placeholder="jperez"
                required={!isEdit}
                disabled={isEdit}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="password">
                Contraseña{isEdit && <span className="text-muted-foreground"> (dejar en blanco para no cambiar)</span>}
              </Label>
              <Input
                id="password"
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
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="firstName">Nombres</Label>
              <Input
                id="firstName"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                maxLength={100}
                placeholder="Juan"
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="lastName">Apellidos</Label>
              <Input
                id="lastName"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                maxLength={100}
                placeholder="Pérez"
                required
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="email">Correo</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              maxLength={150}
              placeholder="jperez@correo.com"
              required
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="groupId">Grupo</Label>
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
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>

        <DialogFooter showCloseButton>
          <Button type="submit" form="admin-form" disabled={loading}>
            {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear administrador'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
