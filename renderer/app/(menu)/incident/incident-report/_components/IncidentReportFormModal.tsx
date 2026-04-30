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
import type { IncidentReport, IncidentReportFormData } from '../_types/incident-report'

interface Props {
  open: boolean
  report: IncidentReport | null
  onClose: () => void
  onSubmit: (data: IncidentReportFormData) => Promise<void>
}

const EMPTY_FORM: IncidentReportFormData = {
  userId: '',
  incidentType: '',
  description: '',
  multimediaUrl: '',
  geolocation: { lat: 0, lng: 0 },
}

export function IncidentReportFormModal({ open, report, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<IncidentReportFormData>(EMPTY_FORM)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(
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
  }, [open, report])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleGeoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      geolocation: { ...prev.geolocation, [name]: parseFloat(value) || 0 },
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(form)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{report ? 'Editar incidencia' : 'Nueva incidencia'}</DialogTitle>
        </DialogHeader>

        <form id="incident-form" onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="incidentType">Tipo de incidencia</Label>
              <Input
                id="incidentType"
                name="incidentType"
                value={form.incidentType}
                onChange={handleChange}
                placeholder="ej. accidente, robo"
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="userId">ID de usuario</Label>
              <Input
                id="userId"
                name="userId"
                value={form.userId}
                onChange={handleChange}
                placeholder="ID del usuario"
                required
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="description">Descripción</Label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Descripción detallada de la incidencia..."
              required
              className="h-auto w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-2 text-sm shadow-xs outline-none resize-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="multimediaUrl">URL de multimedia</Label>
            <Input
              id="multimediaUrl"
              name="multimediaUrl"
              value={form.multimediaUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="lat">Latitud</Label>
              <Input
                id="lat"
                name="lat"
                type="number"
                step="any"
                value={form.geolocation.lat}
                onChange={handleGeoChange}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="lng">Longitud</Label>
              <Input
                id="lng"
                name="lng"
                type="number"
                step="any"
                value={form.geolocation.lng}
                onChange={handleGeoChange}
              />
            </div>
          </div>
        </form>

        <DialogFooter showCloseButton>
          <Button type="submit" form="incident-form" disabled={loading}>
            {loading ? 'Guardando...' : report ? 'Guardar cambios' : 'Crear incidencia'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
