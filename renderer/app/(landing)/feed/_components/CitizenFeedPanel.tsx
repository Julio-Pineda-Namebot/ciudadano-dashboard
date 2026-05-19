'use client'

import { useActionState, useEffect, useRef, useState, useTransition } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Icon, LogoMark } from '@/app/(landing)/_components/icons'
import { getNearbyIncidents, reportIncident } from '@/app/(landing)/feed/actions'
import type {
  CitizenFeedPanelProps,
  IncidentType,
  NearbyIncident,
  ReportIncidentState,
} from '@/app/(landing)/feed/_types/types'

const STYLE_MAP = 'mapbox://styles/mapbox/streets-v12'
const MIN_ZOOM = 10
const DEFAULT_ZOOM = 13
const ICA_BOUNDS: mapboxgl.LngLatBoundsLike = [
  [-75.9, -14.22],
  [-75.55, -13.92],
]

const TYPE_LABEL: Record<IncidentType, string> = {
  robo: 'Robo',
  accidente: 'Accidente',
  vandalismo: 'Vandalismo',
}

const TYPE_COLOR: Record<IncidentType, string> = {
  robo: '#E04B5E',
  accidente: '#D9A55E',
  vandalismo: '#9CA3B0',
}

export function CitizenFeedPanel({ initialIncidents, defaultCenter }: CitizenFeedPanelProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const draftMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const incidentMarkersRef = useRef<mapboxgl.Marker[]>([])

  const [incidents, setIncidents] = useState<NearbyIncident[]>(initialIncidents)
  const [selected, setSelected] = useState<{ lat: number; lon: number } | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [mode, setMode] = useState<'view' | 'report'>('view')
  const modeRef = useRef(mode)
  useEffect(() => {
    modeRef.current = mode
  }, [mode])
  const [state, action, pending] = useActionState<ReportIncidentState, FormData>(reportIncident, null)
  const [refreshing, startRefresh] = useTransition()
  const formRef = useRef<HTMLFormElement | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ''

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: STYLE_MAP,
      center: [defaultCenter.lon, defaultCenter.lat],
      zoom: DEFAULT_ZOOM,
      minZoom: MIN_ZOOM,
      maxBounds: ICA_BOUNDS,
    })
    mapRef.current = map

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')
    map.addControl(new mapboxgl.ScaleControl({ unit: 'metric' }), 'bottom-left')

    // Mapbox can mount with a 0×0 container if the parent flex hasn't settled —
    // observe size changes and force resize until it has dimensions.
    map.once('load', () => map.resize())
    const ro = new ResizeObserver(() => map.resize())
    ro.observe(mapContainerRef.current)

    map.on('click', (e) => {
      if (modeRef.current !== 'report') return
      const { lng, lat } = e.lngLat
      setSelected({ lat, lon: lng })
    })

    return () => {
      ro.disconnect()
      incidentMarkersRef.current.forEach((m) => m.remove())
      incidentMarkersRef.current = []
      draftMarkerRef.current?.remove()
      draftMarkerRef.current = null
      map.remove()
      mapRef.current = null
    }
  }, [defaultCenter.lat, defaultCenter.lon])

  // Render incident markers.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    incidentMarkersRef.current.forEach((m) => m.remove())
    incidentMarkersRef.current = []

    for (const inc of incidents) {
      const el = document.createElement('div')
      const color = TYPE_COLOR[inc.incidentType] ?? '#FFFFFF'
      el.style.width = '14px'
      el.style.height = '14px'
      el.style.borderRadius = '999px'
      el.style.background = color
      el.style.border = '2px solid rgba(255,255,255,0.85)'
      el.style.boxShadow = `0 0 14px ${color}`

      const mediaHtml = inc.multimediaUrl
        ? `<div class="cp-media" style="background-image:url('${encodeURI(inc.multimediaUrl)}')"></div>`
        : ''

      const popup = new mapboxgl.Popup({
        offset: 16,
        closeButton: false,
        className: 'ciudadano-popup',
        maxWidth: '260px',
      }).setHTML(
        `${mediaHtml}<div class="cp-body">
          <div class="cp-type" style="color:${color}">
            <span class="cp-dot" style="background:${color};box-shadow:0 0 8px ${color}"></span>${TYPE_LABEL[inc.incidentType]}
          </div>
          <div class="cp-desc">${escapeHtml(inc.description)}</div>
          <div class="cp-date">${escapeHtml(new Date(inc.createdAt).toLocaleString('es-PE'))}</div>
        </div>`
      )

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([inc.geolocation.longitude, inc.geolocation.latitude])
        .setPopup(popup)
        .addTo(map)

      incidentMarkersRef.current.push(marker)
    }
  }, [incidents])

  // Render draft marker for the user's selected point.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    draftMarkerRef.current?.remove()
    draftMarkerRef.current = null

    if (!selected) return

    const el = document.createElement('div')
    el.style.width = '20px'
    el.style.height = '20px'
    el.style.borderRadius = '999px'
    el.style.background = '#FFFFFF'
    el.style.border = '3px solid rgba(217,165,94,0.95)'
    el.style.boxShadow = '0 0 20px rgba(217,165,94,0.7)'

    draftMarkerRef.current = new mapboxgl.Marker({ element: el, draggable: true })
      .setLngLat([selected.lon, selected.lat])
      .addTo(map)

    draftMarkerRef.current.on('dragend', () => {
      const lngLat = draftMarkerRef.current?.getLngLat()
      if (lngLat) setSelected({ lat: lngLat.lat, lon: lngLat.lng })
    })
  }, [selected])

  // Refresh incidents and reset form when a report succeeds.
  useEffect(() => {
    if (state && 'ok' in state && state.ok) {
      formRef.current?.reset()
      setSelected(null)
      setMediaPreview(null)
      const map = mapRef.current
      const center = map?.getCenter()
      const lat = center?.lat ?? defaultCenter.lat
      const lon = center?.lng ?? defaultCenter.lon
      startRefresh(async () => {
        const next = await getNearbyIncidents(lat, lon)
        setIncidents(next)
      })
    }
  }, [state, defaultCenter.lat, defaultCenter.lon])

  const handleRecenter = () => {
    const map = mapRef.current
    if (!map) return
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        map.flyTo({ center: [longitude, latitude], zoom: 15, essential: true })
        startRefresh(async () => {
          const next = await getNearbyIncidents(latitude, longitude)
          setIncidents(next)
        })
      },
      () => {
        // Silent: keep current center if user denies geolocation.
      },
      { enableHighAccuracy: true, timeout: 5000 }
    )
  }

  const errorMessage = state && 'error' in state ? state.error : null
  const successMessage = state && 'ok' in state && state.ok ? state.message : null

  return (
    <main
      data-lenis-prevent
      className="fixed inset-0 z-30 flex flex-col-reverse bg-[#050505] text-white lg:flex-row"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse at 0% 0%, rgba(255,255,255,0.05), transparent 55%), radial-gradient(ellipse at 100% 100%, rgba(217,165,94,0.06), transparent 55%), linear-gradient(180deg, rgba(11,15,28,0.95), rgba(5,7,15,1))',
        }}
      />

      {/* Form panel (left on desktop, bottom on mobile) */}
      <aside className="relative z-10 flex h-[45svh] min-h-0 shrink-0 flex-col gap-5 overflow-y-auto border-t border-white/8 bg-black/40 p-6 backdrop-blur-md sm:p-8 lg:h-full lg:w-[420px] lg:border-r lg:border-t-0">
        <a href="/" className="flex items-center gap-2">
          <LogoMark size={22} />
          <span className="font-display text-[14px] font-semibold tracking-tight">Ciudadano</span>
        </a>

        <div>
          <div className="eyebrow">Reportar · Mi cuadra</div>
          <h1 className="mt-3 font-display text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[28px]">
            <span className="gradient-text">Registra una </span>
            <span className="gradient-text-accent italic">incidencia</span>
          </h1>
          <p className="mt-2 text-[13px] text-white/55">
            Toca un punto del mapa para marcar la ubicación. Luego describe lo ocurrido.
          </p>
        </div>

        {successMessage && (
          <div className="rounded-lg border border-[#6BAE7A]/30 bg-[#6BAE7A]/10 px-3 py-2 text-[12.5px] text-[#A8DDB5]">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="rounded-lg border border-[#E04B5E]/30 bg-[#E04B5E]/10 px-3 py-2 text-[12.5px] text-[#FF8A99]">
            {errorMessage}
          </div>
        )}

        <form ref={formRef} action={action} className="flex flex-col gap-4">
          <input type="hidden" name="latitude" value={selected?.lat ?? ''} />
          <input type="hidden" name="longitude" value={selected?.lon ?? ''} />

          <label className="flex flex-col gap-2">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-white/55">
              Tipo
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(TYPE_LABEL) as IncidentType[]).map((t) => (
                <label
                  key={t}
                  className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/4 px-2 py-2.5 text-[12.5px] text-white/70 transition hover:bg-white/8 has-[input:checked]:border-white/40 has-[input:checked]:bg-white/10 has-[input:checked]:text-white"
                >
                  <input type="radio" name="incident_type" value={t} required className="sr-only" />
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: TYPE_COLOR[t], boxShadow: `0 0 8px ${TYPE_COLOR[t]}` }}
                  />
                  {TYPE_LABEL[t]}
                </label>
              ))}
            </div>
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-white/55">
              Descripción
            </span>
            <textarea
              name="description"
              required
              minLength={10}
              maxLength={191}
              placeholder="Describe brevemente lo que ocurrió (10–191 caracteres)…"
              rows={4}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/4 px-3 py-2.5 text-[13.5px] text-white placeholder:text-white/30 outline-none transition focus:border-white/30 focus:bg-white/8"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-white/55">
              Ubicación
            </span>
            <div className="rounded-xl border border-white/10 bg-white/4 px-3 py-2.5 text-[12.5px]">
              {selected ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="font-mono text-white/85">
                    {selected.lat.toFixed(5)}, {selected.lon.toFixed(5)}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="text-white/40 transition hover:text-white"
                    aria-label="Limpiar ubicación"
                  >
                    <Icon name="x" size={13} />
                  </button>
                </div>
              ) : (
                <span className="text-white/40">Toca el mapa para seleccionar un punto.</span>
              )}
            </div>
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-white/55">
              Foto o video
            </span>
            <div className="relative flex items-center gap-3 rounded-xl border border-dashed border-white/15 bg-white/3 px-3 py-3">
              <input
                type="file"
                name="multimedia"
                accept="image/*,video/*"
                required
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) {
                    setMediaPreview(null)
                    return
                  }
                  if (file.type.startsWith('image/')) {
                    setMediaPreview(URL.createObjectURL(file))
                  } else {
                    setMediaPreview(null)
                  }
                }}
              />
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/8 text-white/80">
                <Icon name="camera" size={15} />
              </div>
              <div className="flex-1 text-[12.5px] text-white/55">
                {mediaPreview ? 'Archivo listo' : 'Adjunta una foto o video del incidente'}
              </div>
              {mediaPreview && (
                <img
                  src={mediaPreview}
                  alt="preview"
                  className="h-10 w-10 rounded-md object-cover ring-1 ring-white/15"
                />
              )}
            </div>
          </label>

          <button
            type="submit"
            disabled={pending || !selected}
            className="landing-btn landing-btn-primary mt-1 h-12 w-full text-[14px] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? 'Reportando…' : <>Reportar <Icon name="arrow" size={14} /></>}
          </button>
        </form>

        <div className="mt-auto flex items-center justify-between border-t border-white/8 pt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
          <span>{incidents.length} reportes activos</span>
          <span className="flex items-center gap-1.5">
            <span
              className="landing-dot"
              style={{
                background: refreshing ? '#D9A55E' : '#6BAE7A',
                boxShadow: `0 0 10px ${refreshing ? '#D9A55E' : '#6BAE7A'}`,
              }}
            />
            {refreshing ? 'Actualizando' : 'En vivo'}
          </span>
        </div>
      </aside>

      {/* Map panel (right on desktop, top on mobile) */}
      <section className="relative min-h-0 flex-1">
        <div ref={mapContainerRef} className="h-full w-full" />

        {/* Top-left toolbar: mode toggle + geolocation */}
        <div className="absolute left-3 top-3 z-10 flex items-center gap-2 sm:left-4 sm:top-4">
          <div
            role="tablist"
            aria-label="Modo de interacción del mapa"
            className="flex items-center rounded-xl border border-white/10 bg-black/70 p-1 backdrop-blur-md shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)]"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'view'}
              onClick={() => {
                setMode('view')
                setSelected(null)
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] transition ${
                mode === 'view'
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              <Icon name="eye" size={13} />
              Ver
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'report'}
              onClick={() => setMode('report')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] transition ${
                mode === 'report'
                  ? 'bg-white text-black'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              <Icon name="plus" size={13} />
              Reportar
            </button>
          </div>
          <button
            type="button"
            onClick={handleRecenter}
            title="Centrar en mi ubicación"
            aria-label="Centrar en mi ubicación"
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-black/70 text-white/70 backdrop-blur-md shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)] transition hover:bg-black/85 hover:text-white"
          >
            <Icon name="pin" size={14} />
          </button>
        </div>

        {mode === 'report' && !selected && (
          <div className="pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2 rounded-full border border-white/10 bg-black/70 px-4 py-1.5 text-center text-[10.5px] uppercase tracking-[0.25em] text-white/70 backdrop-blur-sm sm:top-4 sm:text-[11px]">
            Toca el mapa para marcar
          </div>
        )}
      </section>
    </main>
  )
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
