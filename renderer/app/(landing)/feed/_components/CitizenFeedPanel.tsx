'use client'

import { useActionState, useEffect, useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { LogoMark } from '@/app/(landing)/_components/icons'
import { getNearbyIncidents, reportIncident } from '@/app/(landing)/feed/actions'
import { calculateSafeRoute } from '@/app/(landing)/feed/routeService'
import type {
  CitizenFeedPanelProps,
  FeedMode,
  NearbyIncident,
  ReportIncidentState,
  RoutePlan,
  RoutePoint,
} from '@/app/(landing)/feed/_types/types'
import { LABEL_TEXT } from '@/app/(landing)/feed/constants'
import { CitizenFeedMap, type CitizenFeedMapHandle } from './CitizenFeedMap'
import { CitizenFeedModeTabs } from './CitizenFeedModeTabs'
import { CitizenFeedReportForm } from './CitizenFeedReportForm'
import { CitizenFeedRoutePlanner } from './CitizenFeedRoutePlanner'
import { CitizenFeedUserMenu } from './CitizenFeedUserMenu'

export function CitizenFeedPanel({ initialIncidents, defaultCenter, profile }: CitizenFeedPanelProps) {
  const mapHandleRef = useRef<CitizenFeedMapHandle | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)

  const [incidents, setIncidents] = useState<NearbyIncident[]>(initialIncidents)
  const [selected, setSelected] = useState<RoutePoint | null>(null)
  const [mode, setMode] = useState<FeedMode>('view')
  const [origin, setOrigin] = useState<RoutePoint | null>(null)
  const [destination, setDestination] = useState<RoutePoint | null>(null)
  const [route, setRoute] = useState<RoutePlan | null>(null)
  const [routeError, setRouteError] = useState<string | null>(null)
  const [calculatingRoute, setCalculatingRoute] = useState(false)
  const [userLocation, setUserLocation] = useState<RoutePoint | null>(null)
  const [resetSignal, setResetSignal] = useState(0)
  const [state, action, pending] = useActionState<ReportIncidentState, FormData>(reportIncident, null)
  const [refreshing, startRefresh] = useTransition()

  // Avisa por toast (top-center, ver layout) y refresca/limpia el form según el
  // resultado del reporte. resetSignal limpia el estado local del formulario.
  useEffect(() => {
    if (!state) return
    if ('ok' in state && state.ok) {
      toast.success(state.message)
      formRef.current?.reset()
      setSelected(null)
      setResetSignal((n) => n + 1)
      const center = mapHandleRef.current?.getCenter()
      const lat = center?.lat ?? defaultCenter.lat
      const lon = center?.lon ?? defaultCenter.lon
      startRefresh(async () => {
        const next = await getNearbyIncidents(lat, lon)
        setIncidents(next)
      })
    } else if ('error' in state) {
      toast.error(state.error)
    }
  }, [state, defaultCenter.lat, defaultCenter.lon])

  const handleSetOrigin = (p: RoutePoint) => {
    setOrigin(p)
    setRoute(null)
    setRouteError(null)
  }

  const handleSetDestination = (p: RoutePoint) => {
    setDestination(p)
    setRoute(null)
    setRouteError(null)
  }

  const handleCalculateRoute = async () => {
    if (!origin || !destination) return
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token) {
      setRouteError('Falta configurar el token de Mapbox')
      return
    }
    setCalculatingRoute(true)
    setRouteError(null)
    setRoute(null)
    try {
      const result = await calculateSafeRoute(origin, destination, incidents, token)
      if (!result.ok) {
        setRouteError(result.error)
        return
      }
      const initial = result.options.find((o) => o.label === 'safest') ?? result.options[0]
      setRoute({ options: result.options, selectedId: initial.id })
    } catch (err) {
      setRouteError('No se pudo calcular la ruta, intenta nuevamente')
      console.error('safe-route failed', err)
    } finally {
      setCalculatingRoute(false)
    }
  }

  const handleSelectRoute = (id: string) => {
    setRoute((prev) => (prev ? { ...prev, selectedId: id } : prev))
  }

  const clearRoute = () => {
    setOrigin(null)
    setDestination(null)
    setRoute(null)
    setRouteError(null)
  }

  const handleRecenter = () => {
    const map = mapHandleRef.current
    if (!map || !navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        map.flyTo(latitude, longitude, 15)
        setUserLocation({ lat: latitude, lon: longitude })
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

  const handleChangeMode = (next: FeedMode) => {
    setMode(next)
    if (next !== 'report') setSelected(null)
  }

  const handleMapSelectPoint = (p: RoutePoint) => {
    if (mode === 'report') setSelected(p)
  }

  const selectedRoute = route?.options.find((o) => o.id === route.selectedId)
  const footerLeft =
    mode === 'route'
      ? selectedRoute
        ? `${LABEL_TEXT[selectedRoute.label]}: ${Math.round(selectedRoute.dangerScore * 100)}% en riesgo`
        : 'Selecciona origen y destino'
      : `${incidents.length} reportes activos`

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
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            <LogoMark size={22} />
            <span className="font-display text-[14px] font-semibold tracking-tight">Ciudadano</span>
          </Link>
          <CitizenFeedUserMenu profile={profile} />
        </div>

        {mode === 'route' ? (
          <CitizenFeedRoutePlanner
            origin={origin}
            destination={destination}
            route={route}
            routeError={routeError}
            calculating={calculatingRoute}
            onSelectRoute={handleSelectRoute}
            onClearOrigin={() => {
              setOrigin(null)
              setRoute(null)
              setRouteError(null)
            }}
            onClearDestination={() => {
              setDestination(null)
              setRoute(null)
              setRouteError(null)
            }}
            onCalculate={handleCalculateRoute}
            onClearAll={clearRoute}
          />
        ) : (
          <CitizenFeedReportForm
            formRef={formRef}
            action={action}
            pending={pending}
            selected={selected}
            onClearSelected={() => setSelected(null)}
            resetSignal={resetSignal}
          />
        )}

        <div className="mt-auto flex items-center justify-between border-t border-white/8 pt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
          <span>{footerLeft}</span>
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
        <CitizenFeedMap
          ref={mapHandleRef}
          defaultCenter={defaultCenter}
          incidents={incidents}
          mode={mode}
          selected={selected}
          origin={origin}
          destination={destination}
          route={route}
          onSelectPoint={handleMapSelectPoint}
          onSetOrigin={handleSetOrigin}
          onSetDestination={handleSetDestination}
          userLocation={userLocation}
        />

        <CitizenFeedModeTabs
          mode={mode}
          onChangeMode={handleChangeMode}
          onRecenter={handleRecenter}
        />

        {mode === 'report' && !selected && (
          <div className="pointer-events-none absolute left-1/2 top-16 z-10 -translate-x-1/2 rounded-full border border-white/10 bg-black/70 px-4 py-1.5 text-center text-[10.5px] uppercase tracking-[0.25em] text-white/70 backdrop-blur-sm sm:top-4 sm:text-[11px]">
            Toca el mapa para marcar
          </div>
        )}

        {mode === 'route' && (!origin || !destination) && (
          <div className="pointer-events-none absolute left-1/2 top-16 z-10 -translate-x-1/2 rounded-full border border-white/10 bg-black/70 px-4 py-1.5 text-center text-[10.5px] uppercase tracking-[0.25em] text-white/70 backdrop-blur-sm sm:top-4 sm:text-[11px]">
            {!origin ? 'Toca el mapa para fijar el origen' : 'Toca el mapa para fijar el destino'}
          </div>
        )}
      </section>

    </main>
  )
}
