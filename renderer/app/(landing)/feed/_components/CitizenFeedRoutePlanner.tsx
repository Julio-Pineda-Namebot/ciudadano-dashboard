'use client'

import { ArrowRight, X } from 'lucide-react'
import {
  DESTINATION_COLOR,
  LABEL_TEXT,
  ORIGIN_COLOR,
} from '@/app/(landing)/feed/constants'
import type { RoutePlan, RoutePoint } from '@/app/(landing)/feed/_types/types'

interface CitizenFeedRoutePlannerProps {
  origin: RoutePoint | null
  destination: RoutePoint | null
  route: RoutePlan | null
  routeError: string | null
  calculating: boolean
  onSelectRoute: (id: string) => void
  onClearOrigin: () => void
  onClearDestination: () => void
  onCalculate: () => void
  onClearAll: () => void
}

/**
 * Render the route-planning UI that lets a user set origin and destination, view and select route options, and trigger route calculations.
 *
 * @param origin - The selected start coordinates, or `null` when not set
 * @param destination - The selected destination coordinates, or `null` when not set
 * @param route - The computed route data including options and the currently selected option, or `null` when none
 * @param routeError - An error message to display related to route calculation, or `null` when there is no error
 * @param calculating - Whether a route calculation is currently in progress
 * @param onSelectRoute - Callback invoked with a route option id when the user selects a route option
 * @param onClearOrigin - Callback invoked when the user clears the origin
 * @param onClearDestination - Callback invoked when the user clears the destination
 * @param onCalculate - Callback invoked when the user requests route calculation
 * @param onClearAll - Callback invoked when the user clears origin, destination, and route
 * @returns The rendered JSX element for the citizen route planner UI
 */
export function CitizenFeedRoutePlanner({
  origin,
  destination,
  route,
  routeError,
  calculating,
  onSelectRoute,
  onClearOrigin,
  onClearDestination,
  onCalculate,
  onClearAll,
}: CitizenFeedRoutePlannerProps) {
  return (
    <>
      <div>
        <div className="eyebrow">Recorrido · Seguro</div>
        <h1 className="mt-3 font-display text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[28px]">
          <span className="gradient-text">Planifica una </span>
          <span className="gradient-text-accent italic">ruta segura</span>
        </h1>
        <p className="mt-2 text-[13px] text-white/55">
          Toca el mapa para fijar el punto de inicio y el destino. Calcularemos
          un recorrido evitando zonas con muchas incidencias.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {routeError && (
          <div className="rounded-lg border border-[#E04B5E]/30 bg-[#E04B5E]/10 px-3 py-2 text-[12.5px] text-[#FF8A99]">
            {routeError}
          </div>
        )}

        {route && (
          <div className="flex flex-col gap-2">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-white/55">
              {route.options.length === 1
                ? '1 opción encontrada'
                : `${route.options.length} opciones · toca una para verla`}
            </div>
            {route.options.map((opt) => {
              const isSelected = opt.id === route.selectedId
              const dangerPct = Math.round(opt.dangerScore * 100)
              const shortestRef = route.options.find((o) => o.label === 'shortest')
              const deltaM =
                shortestRef && opt.id !== shortestRef.id
                  ? Math.round(opt.distanceMeters - shortestRef.distanceMeters)
                  : null
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSelectRoute(opt.id)}
                  className={`text-left rounded-lg border px-3 py-2 text-[12.5px] transition ${
                    isSelected
                      ? 'border-white/40 bg-white/8'
                      : 'border-white/10 bg-white/3 hover:bg-white/6'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em]">
                    <span className="flex items-center gap-2 text-white/80">
                      <span
                        className="inline-block h-0.5 w-5"
                        style={{
                          background: isSelected
                            ? opt.color
                            : `repeating-linear-gradient(90deg, ${opt.color} 0 4px, transparent 4px 8px)`,
                        }}
                      />
                      {LABEL_TEXT[opt.label]}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9.5px] ${
                        opt.isSafe
                          ? 'bg-[#6BAE7A]/15 text-[#A8DDB5]'
                          : 'bg-[#E04B5E]/15 text-[#FF8A99]'
                      }`}
                    >
                      {opt.isSafe ? 'Segura' : 'No segura'}
                    </span>
                  </div>
                  <div className="mt-1 text-white/75">
                    {dangerPct === 0
                      ? 'Sin incidencias en el trayecto'
                      : `${dangerPct}% del trayecto cerca de incidencias`}
                  </div>
                  <div className="mt-1 flex items-center justify-between font-mono text-[10.5px] text-white/50">
                    <span>
                      {(opt.distanceMeters / 1000).toFixed(2)} km · {Math.round(opt.durationSeconds / 60)} min
                    </span>
                    {deltaM !== null && (
                      <span className="text-white/40">
                        {deltaM > 0 ? `+${deltaM} m` : `${deltaM} m`} vs corta
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}

        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-white/55">
            Origen
          </span>
          <div className="rounded-xl border border-white/10 bg-white/4 px-3 py-2.5 text-[12.5px]">
            {origin ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 font-mono text-white/85">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: ORIGIN_COLOR, boxShadow: `0 0 8px ${ORIGIN_COLOR}` }}
                  />
                  {origin.lat.toFixed(5)}, {origin.lon.toFixed(5)}
                </div>
                <button
                  type="button"
                  onClick={onClearOrigin}
                  className="text-white/40 transition hover:text-white"
                  aria-label="Limpiar origen"
                >
                  <X size={13} />
                </button>
              </div>
            ) : (
              <span className="text-white/40">Toca el mapa para fijar el punto de inicio.</span>
            )}
          </div>
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-white/55">
            Destino
          </span>
          <div className="rounded-xl border border-white/10 bg-white/4 px-3 py-2.5 text-[12.5px]">
            {destination ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 font-mono text-white/85">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: DESTINATION_COLOR, boxShadow: `0 0 8px ${DESTINATION_COLOR}` }}
                  />
                  {destination.lat.toFixed(5)}, {destination.lon.toFixed(5)}
                </div>
                <button
                  type="button"
                  onClick={onClearDestination}
                  className="text-white/40 transition hover:text-white"
                  aria-label="Limpiar destino"
                >
                  <X size={13} />
                </button>
              </div>
            ) : (
              <span className="text-white/40">
                {origin
                  ? 'Toca el mapa para fijar el destino.'
                  : 'Primero fija el origen.'}
              </span>
            )}
          </div>
        </label>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCalculate}
            disabled={!origin || !destination || calculating}
            className="landing-btn landing-btn-primary h-12 flex-1 text-[14px] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {calculating ? 'Calculando…' : <>Calcular ruta segura <ArrowRight size={14} /></>}
          </button>
          {(origin || destination || route) && (
            <button
              type="button"
              onClick={onClearAll}
              className="h-12 rounded-xl border border-white/10 bg-white/4 px-4 text-[12.5px] text-white/70 transition hover:bg-white/8 hover:text-white"
            >
              Limpiar
            </button>
          )}
        </div>

        <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/40">
          Umbral de seguridad: ≤ 20% del trayecto cerca de incidencias
        </p>
      </div>
    </>
  )
}
