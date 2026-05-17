'use client'

import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useModuleTheme, MODULE_BUTTON_CLASS } from '@/components/common/module-theme'
import FormField from '@/components/common/form/FormField'
import {
  updateSchema,
  INCIDENT_TYPES,
} from '@/app/(menu)/incident/incident-report/_types/types'
import type {
  IncidentReportFormModalProps,
  IncidentReportFormValues,
} from '@/app/(menu)/incident/incident-report/_types/types'

export function IncidentReportFormModal({ open, report, onClose, onSubmit }: IncidentReportFormModalProps) {
  const theme = useModuleTheme()
  const btnClass = theme?.color ? MODULE_BUTTON_CLASS[theme.color] : ''

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IncidentReportFormValues>({
    resolver: zodResolver(updateSchema),
    defaultValues: { incidentType: '', description: '' },
  })

  const description = useWatch({ control, name: 'description' })

  useEffect(() => {
    if (open && report) {
      reset({ incidentType: report.incidentType, description: report.description })
    }
  }, [open, report, reset])

  const submit = handleSubmit(async (values) => {
    await onSubmit(values)
  })

  return (
    <Dialog open={open} onOpenChange={(v) => !v && !isSubmitting && onClose()}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-lg p-0" showCloseButton={false}>
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Editar incidencia</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-2">
          <form id="incident-form" onSubmit={submit} className="grid gap-4" noValidate>
            <FormField
              fieldConfig={{
                type: 'select',
                name: 'incidentType',
                label: 'Tipo de incidencia',
                placeholder: 'Seleccionar tipo...',
                width: 'w-full',
                options: INCIDENT_TYPES.map(({ value, label }) => ({ value, label })),
              }}
              schema={updateSchema.shape.incidentType}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              control={control as any}
              errors={errors}
            />

            <div className="grid gap-1.5">
              <Label htmlFor="description">Descripción</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setValue('description', e.target.value, { shouldValidate: true })}
                rows={3}
                placeholder="Descripción detallada de la incidencia..."
                aria-invalid={!!errors.description}
                className="h-auto w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-2 text-sm shadow-xs outline-none resize-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>
          </form>
        </div>

        <DialogFooter className="px-6 pb-6 pt-2 border-t border-border flex-row! justify-between!">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" form="incident-form" disabled={isSubmitting} className={btnClass}>
            {isSubmitting ? (
              <>
                <Spinner />
                <span>Guardando...</span>
              </>
            ) : 'Guardar cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
