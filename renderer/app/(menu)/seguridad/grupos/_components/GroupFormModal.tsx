'use client'

import { useEffect, useState } from 'react'
<<<<<<< Updated upstream
import { Button } from '@/components/ui/button'
=======
import { useForm } from 'react-hook-form'
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
import type { Group, GroupFormData } from '../_types/group'

interface Props {
  open: boolean
  group: Group | null
  onClose: () => void
  onSubmit: (data: GroupFormData) => Promise<void>
}

<<<<<<< Updated upstream
const EMPTY_FORM: GroupFormData = {
=======
const groupSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio').max(64, 'Máximo 64 caracteres'),
  description: z.string().trim().max(255, 'Máximo 255 caracteres').optional().or(z.literal('')),
})

type GroupFormValues = z.infer<typeof groupSchema>

const EMPTY_FORM: GroupFormValues = {
>>>>>>> Stashed changes
  name: '',
  description: '',
}

export function GroupFormModal({ open, group, onClose, onSubmit }: Props) {
<<<<<<< Updated upstream
  const [form, setForm] = useState<GroupFormData>(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setForm(group ? { name: group.name, description: group.description ?? '' } : EMPTY_FORM)
      setError(null)
    }
  }, [open, group])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const payload: GroupFormData = {
        name: form.name.trim(),
        description: form.description?.trim() || undefined,
      }
      await onSubmit(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }
=======
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema as never),
    defaultValues: EMPTY_FORM,
  })

  useEffect(() => {
    if (open) {
      reset(group ? { name: group.name, description: group.description ?? '' } : EMPTY_FORM)
      setError(null)
    }
  }, [open, group, reset])

  const submit = handleSubmit(async (values) => {
    setError(null)
    try {
      await onSubmit({
        name: values.name,
        description: values.description ? values.description : undefined,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    }
  })
>>>>>>> Stashed changes

  const isEdit = group !== null

  return (
<<<<<<< Updated upstream
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
=======
    <Dialog open={open} onOpenChange={(v) => !v && !isSubmitting && onClose()}>
      <DialogContent className="sm:max-w-md" dismissible={false} showCloseButton={false}>
>>>>>>> Stashed changes
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar grupo' : 'Nuevo grupo'}</DialogTitle>
        </DialogHeader>

<<<<<<< Updated upstream
        <form id="group-form" onSubmit={handleSubmit} className="grid gap-4">
=======
        <form id="group-form" onSubmit={submit} className="grid gap-4" noValidate>
>>>>>>> Stashed changes
          <div className="grid gap-1.5">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
<<<<<<< Updated upstream
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ej. Supervisores"
              maxLength={64}
              required
            />
=======
              {...register('name')}
              placeholder="Ej. Supervisores"
              maxLength={64}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
>>>>>>> Stashed changes
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="description">Descripción</Label>
            <textarea
              id="description"
<<<<<<< Updated upstream
              name="description"
              value={form.description ?? ''}
              onChange={handleChange}
              rows={3}
              maxLength={255}
              placeholder="Descripción opcional"
              className="h-auto w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-2 text-sm shadow-xs outline-none resize-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
=======
              {...register('description')}
              rows={3}
              maxLength={255}
              placeholder="Descripción opcional"
              aria-invalid={!!errors.description}
              className="h-auto w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-2 text-sm shadow-xs outline-none resize-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
>>>>>>> Stashed changes
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>

<<<<<<< Updated upstream
        <DialogFooter showCloseButton>
          <Button type="submit" form="group-form" disabled={loading}>
            {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear grupo'}
=======
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" form="group-form" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner />
                <span>Guardando...</span>
              </>
            ) : isEdit ? 'Guardar cambios' : 'Crear grupo'}
>>>>>>> Stashed changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
