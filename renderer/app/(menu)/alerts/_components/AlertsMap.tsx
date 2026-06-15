'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import type { PanicAlert } from '@/app/(menu)/alerts/_types/types'

const DEFAULT_LNG = -75.7285
const DEFAULT_LAT = -14.0755
const DEFAULT_ZOOM = 13
const FOCUS_ZOOM = 16
const MIN_ZOOM = 11
const ICA_BOUNDS: mapboxgl.LngLatBoundsLike = [
  [-75.9, -14.22],
  [-75.55, -13.92],
]
const STYLE_STANDARD = 'mapbox://styles/mapbox/standard'

interface AlertsMapProps {
  alerts: PanicAlert[]
  selectedId: string | null
  onSelect: (id: string) => void
}

// Marcador de "latido": punto rojo con dos anillos que laten hacia afuera.
function buildMarkerElement(): HTMLDivElement {
  const el = document.createElement('div')
  el.className = 'relative grid h-10 w-10 cursor-pointer place-items-center'
  el.innerHTML = `
    <span class="absolute inline-flex h-9 w-9 animate-ping rounded-full bg-red-500/50"></span>
    <span class="absolute inline-flex h-6 w-6 animate-ping rounded-full bg-red-500/60" style="animation-delay:.4s"></span>
    <span class="relative inline-flex h-3.5 w-3.5 rounded-full bg-red-600 ring-2 ring-white shadow-md"></span>
  `
  return el
}

export function AlertsMap({ alerts, selectedId, onSelect }: AlertsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map())
  const loadedRef = useRef(false)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  // Inicializa el mapa una sola vez.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ''

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: STYLE_STANDARD,
      center: [DEFAULT_LNG, DEFAULT_LAT],
      zoom: DEFAULT_ZOOM,
      minZoom: MIN_ZOOM,
      maxBounds: ICA_BOUNDS,
    })
    mapRef.current = map
    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.on('load', () => {
      loadedRef.current = true
      syncMarkers()
    })

    // markersRef.current es una instancia de Map estable (solo se muta), así
    // que capturarla aquí es seguro para el cleanup.
    const markers = markersRef.current
    return () => {
      markers.forEach((m) => m.remove())
      markers.clear()
      map.remove()
      mapRef.current = null
      loadedRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reconcilia los marcadores con la lista de alertas.
  function syncMarkers() {
    const map = mapRef.current
    if (!map) return
    const next = new Set(alerts.map((a) => a.id))

    // Quita marcadores de alertas que ya no están.
    for (const [id, marker] of markersRef.current) {
      if (!next.has(id)) {
        marker.remove()
        markersRef.current.delete(id)
      }
    }

    // Agrega los nuevos.
    for (const alert of alerts) {
      if (markersRef.current.has(alert.id)) continue
      const el = buildMarkerElement()
      el.addEventListener('click', () => onSelectRef.current(alert.id))
      const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat([alert.longitude, alert.latitude])
        .addTo(map)
      markersRef.current.set(alert.id, marker)
    }
  }

  useEffect(() => {
    if (loadedRef.current) syncMarkers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alerts])

  // Centra el mapa en la alerta seleccionada.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !selectedId) return
    const alert = alerts.find((a) => a.id === selectedId)
    if (!alert) return
    map.flyTo({
      center: [alert.longitude, alert.latitude],
      zoom: FOCUS_ZOOM,
      essential: true,
    })
  }, [selectedId, alerts])

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-hidden rounded-xl border border-border shadow-sm"
    />
  )
}
