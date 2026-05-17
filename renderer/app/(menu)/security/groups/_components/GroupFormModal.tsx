'use client'

import { useEffect, useState } from 'react'
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
import type { Group, GroupFormData } from '../_types/group'

interface Props {
  open: boolean
  group: Group | null
  onClose: () => void
  onSubmit: (data: GroupFormData) => Promise<void>
}

const groupSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio').max(64, 'Máximo 64 caracteres'),
  description: z.string().trim().max(255, 'Máximo 255 caracteres').optional().or(z.literal('')),
})

type GroupFormValues = z.infer<typeof groupSchema>

const EMPTY_FORM: GroupFormValues = {
  name: '',
  description: '',
}

export function GroupFormModal({ open, group, onClose, onSubmit }: Props) {
  const theme = useModuleTheme()
  const btnClass = theme?.color ? MODULE_BUTTON_CLASS[theme.color] : ''
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

  const isEdit = group !== null

  return (
    <Dialog open={open} onOpenChange={(v) => !v && !isSubmitting && onClose()}>
      <DialogContent className="sm:max-w-md" dismissible={false} showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar grupo' : 'Nuevo grupo'}</DialogTitle>
        </DialogHeader>

        <form id="group-form" onSubmit={submit} className="grid gap-4" noValidate>
          <div className="grid gap-1.5">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Ej. Supervisores"
              maxLength={64}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="description">Descripción</Label>
            <textarea
              id="description"
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
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" form="group-form" disabled={isSubmitting} className={cn(btnClass)}>
            {isSubmitting ? (
              <>
                <Spinner />
                <span>Guardando...</span>
              </>
            ) : isEdit ? 'Guardar cambios' : 'Crear grupo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
