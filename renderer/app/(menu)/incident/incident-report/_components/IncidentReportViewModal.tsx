'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { IncidentReportViewModalProps } from '@/app/(menu)/incident/incident-report/_types/types'

const DEFAULT_LNG = -75.7285
const DEFAULT_LAT = -14.0755

export function IncidentReportViewModal({ open, report, onClose }: IncidentReportViewModalProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markerRef = useRef<mapboxgl.Marker | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const [activeTab, setActiveTab] = useState<'map' | 'image'>('map')

  const mapCallbackRef = useCallback((node: HTMLDivElement | null) => {
    mapContainerRef.current = node
    if (!node) {
      markerRef.current?.remove()
      markerRef.current = null
      mapRef.current?.remove()
      mapRef.current = null
      setMapReady(false)
      return
    }
    if (mapRef.current) return
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ''
    const map = new mapboxgl.Map({
      container: node,
      style: 'mapbox://styles/mapbox/standard',
      center: [DEFAULT_LNG, DEFAULT_LAT],
      zoom: 13,
    })
    mapRef.current = map
    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.on('load', () => {
      map.resize()
      setMapReady(true)
    })
  }, [])

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

  useEffect(() => {
    if (activeTab === 'map' && mapRef.current) {
      requestAnimationFrame(() => requestAnimationFrame(() => mapRef.current?.resize()))
    }
  }, [activeTab])

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { setActiveTab('map'); onClose() } }}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-lg p-0" showCloseButton={false}>
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Ver incidencia</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 grid gap-4">
          <div className="flex rounded-lg border border-input bg-muted p-1 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('map')}
              className={cn(
                'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                activeTab === 'map'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Ver ubicación
            </button>
            <button
              type="button"
              onClick={() => report?.multimediaUrl && setActiveTab('image')}
              disabled={!report?.multimediaUrl}
              className={cn(
                'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                activeTab === 'image'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
                !report?.multimediaUrl && 'opacity-40 cursor-not-allowed'
              )}
            >
              Ver imagen
            </button>
          </div>

          <div className={cn(activeTab !== 'map' && 'sr-only')}>
            <div
              ref={mapCallbackRef}
              className="h-52 w-full rounded-lg overflow-hidden border border-input"
            />
          </div>

          {activeTab === 'image' && (
            report?.multimediaUrl ? (
              <Image
                src={report.multimediaUrl}
                alt="multimedia de incidencia"
                width={800}
                height={208}
                unoptimized
                className="h-52 w-full rounded-lg object-cover border border-input"
              />
            ) : (
              <div className="h-52 w-full rounded-lg border border-input flex items-center justify-center text-sm text-muted-foreground">
                Sin imagen
              </div>
            )
          )}

          <div className="flex justify-end border-t border-border pt-4">
            <Button variant="outline" onClick={onClose}>Cerrar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
