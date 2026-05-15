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
import type { IncidentReport, IncidentReportFormData } from '../_types/incident-report'

interface Props {
  open: boolean
  report: IncidentReport | null
  onClose: () => void
  onSubmit: (data: IncidentReportFormData) => Promise<void>
}

const incidentSchema = z.object({
  incidentType: z.string().trim().min(1, 'El tipo de incidencia es obligatorio'),
  userId: z.string().trim().min(1, 'El ID de usuario es obligatorio'),
  description: z.string().trim().min(1, 'La descripción es obligatoria'),
  multimediaUrl: z.string().trim().optional().or(z.literal('')),
  geolocation: z.object({
    lat: z.coerce.number(),
    lng: z.coerce.number(),
  }),
})

type IncidentFormValues = z.infer<typeof incidentSchema>

const EMPTY_FORM: IncidentFormValues = {
  userId: '',
  incidentType: '',
  description: '',
  multimediaUrl: '',
  geolocation: { lat: 0, lng: 0 },
}

export function IncidentReportFormModal({ open, report, onClose, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IncidentFormValues>({
    resolver: zodResolver(incidentSchema as never),
    defaultValues: EMPTY_FORM,
  })

  useEffect(() => {
    if (open) {
      reset(
        report
          ? {
              userId: report.userId,
              incidentType: report.incidentType,
              description: report.description,
              multimediaUrl: report.multimediaUrl,
              geolocation: report.geolocation,
            }
          : EMPTY_FORM
      )
    }
  }, [open, report, reset])

  const submit = handleSubmit(async (values) => {
    await onSubmit({
      ...values,
      multimediaUrl: values.multimediaUrl ?? '',
    } as IncidentReportFormData)
  })

  return (
    <Dialog open={open} onOpenChange={(v) => !v && !isSubmitting && onClose()}>
      <DialogContent className="sm:max-w-2xl" dismissible={false} showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{report ? 'Editar incidencia' : 'Nueva incidencia'}</DialogTitle>
        </DialogHeader>

        <form id="incident-form" onSubmit={submit} className="grid gap-4" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="incidentType">Tipo de incidencia</Label>
              <Input
                id="incidentType"
                {...register('incidentType')}
                placeholder="ej. accidente, robo"
                aria-invalid={!!errors.incidentType}
              />
              {errors.incidentType && (
                <p className="text-sm text-destructive">{errors.incidentType.message}</p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="userId">ID de usuario</Label>
              <Input
                id="userId"
                {...register('userId')}
                placeholder="ID del usuario"
                aria-invalid={!!errors.userId}
              />
              {errors.userId && (
                <p className="text-sm text-destructive">{errors.userId.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="description">Descripción</Label>
            <textarea
              id="description"
              {...register('description')}
              rows={3}
              placeholder="Descripción detallada de la incidencia..."
              aria-invalid={!!errors.description}
              className="h-auto w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-2 text-sm shadow-xs outline-none resize-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="multimediaUrl">URL de multimedia</Label>
            <Input
              id="multimediaUrl"
              {...register('multimediaUrl')}
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="lat">Latitud</Label>
              <Input
                id="lat"
                type="number"
                step="any"
                {...register('geolocation.lat')}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="lng">Longitud</Label>
              <Input
                id="lng"
                type="number"
                step="any"
                {...register('geolocation.lng')}
              />
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" form="incident-form" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner />
                <span>Guardando...</span>
              </>
            ) : report ? 'Guardar cambios' : 'Crear incidencia'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
