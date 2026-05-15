'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useModuleTheme, MODULE_BUTTON_CLASS } from '@/components/common/module-theme'
import { cn } from '@/lib/utils'
import type { IncidentReport, IncidentReportUpdateData } from '../_types/incident-report'

const INCIDENT_TYPES = [
  { value: 'robo', label: 'Robo' },
  { value: 'accidente', label: 'Accidente' },
  { value: 'vandalismo', label: 'Vandalismo' },
] as const

const DEFAULT_LNG = -75.7285
const DEFAULT_LAT = -14.0755

const updateSchema = z.object({
  incidentType: z.string().min(1, 'El tipo de incidencia es obligatorio'),
  description: z.string().trim().min(1, 'La descripción es obligatoria'),
})

type FormValues = z.infer<typeof updateSchema>

interface Props {
  open: boolean
  report: IncidentReport | null
  onClose: () => void
  onSubmit: (data: IncidentReportUpdateData) => Promise<void>
}

export function IncidentReportFormModal({ open, report, onClose, onSubmit }: Props) {
  const theme = useModuleTheme()
  const btnClass = theme?.color ? MODULE_BUTTON_CLASS[theme.color] : ''
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markerRef = useRef<mapboxgl.Marker | null>(null)
  const [mapReady, setMapReady] = useState(false)

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(updateSchema),
    defaultValues: { incidentType: '', description: '' },
  })

  useEffect(() => {
    if (open && report) {
      reset({ incidentType: report.incidentType, description: report.description })
    }
  }, [open, report, reset])

  // Init map once container is mounted
  useEffect(() => {
    if (!open || !mapContainerRef.current || mapRef.current) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ''

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/standard',
      center: [DEFAULT_LNG, DEFAULT_LAT],
      zoom: 13,
    })
    mapRef.current = map

    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.on('load', () => setMapReady(true))

    return () => {
      markerRef.current?.remove()
      markerRef.current = null
      map.remove()
      mapRef.current = null
      setMapReady(false)
    }
  }, [open])

  // Place/move marker when map is ready or report changes
  useEffect(() => {
    if (!mapReady || !mapRef.current || !report) return

    const { latitude, longitude } = report.geolocation
    const lngLat: mapboxgl.LngLatLike = [longitude, latitude]

    if (markerRef.current) {
      markerRef.current.setLngLat(lngLat)
    } else {
      markerRef.current = new mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat(lngLat)
        .addTo(mapRef.current)
    }

    mapRef.current.flyTo({ center: lngLat, zoom: 15, essential: true })
  }, [mapReady, report])

  // Reset map on close
  useEffect(() => {
    if (!open) {
      markerRef.current?.remove()
      markerRef.current = null
      mapRef.current?.remove()
      mapRef.current = null
      setMapReady(false)
    }
  }, [open])

  const submit = handleSubmit(async (values) => {
    await onSubmit(values)
  })

  return (
    <Dialog open={open} onOpenChange={(v) => !v && !isSubmitting && onClose()}>
      <DialogContent className="sm:max-w-2xl" dismissible={false} showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Editar incidencia</DialogTitle>
        </DialogHeader>

        <form id="incident-form" onSubmit={submit} className="grid gap-4" noValidate>
          <div className="grid gap-1.5">
            <Label htmlFor="incidentType">Tipo de incidencia</Label>
            <Select
              value={watch('incidentType')}
              onValueChange={(v) => setValue('incidentType', v, { shouldValidate: true })}
            >
              <SelectTrigger id="incidentType" aria-invalid={!!errors.incidentType}>
                <SelectValue placeholder="Seleccionar tipo..." />
              </SelectTrigger>
              <SelectContent>
                {INCIDENT_TYPES.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.incidentType && (
              <p className="text-sm text-destructive">{errors.incidentType.message}</p>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="description">Descripción</Label>
            <textarea
              id="description"
              value={watch('description')}
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

          <div className="grid gap-1.5">
            <Label>Ubicación del incidente</Label>
            <div
              ref={mapContainerRef}
              className="h-52 w-full rounded-lg overflow-hidden border border-input"
            />
          </div>

          {report?.multimediaUrl && (
            <div className="grid gap-1.5">
              <Label>Multimedia</Label>
              <img
                src={report.multimediaUrl}
                alt="multimedia de incidencia"
                className="h-40 w-full rounded-lg object-cover border border-input"
              />
            </div>
          )}
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" form="incident-form" disabled={isSubmitting} className={cn(btnClass)}>
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
