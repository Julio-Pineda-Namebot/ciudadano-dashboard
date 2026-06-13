'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { ArrowRight, MapPin, Trash2 } from 'lucide-react'
import { deleteMyIncident } from '@/app/(landing)/feed/actions'
import { TYPE_COLOR, TYPE_LABEL } from '@/app/(landing)/feed/constants'
import type { NearbyIncident } from '@/app/(landing)/feed/_types/types'

type MyIncidentsPanelProps = {
  initialIncidents: NearbyIncident[]
}

const dateFormatter = new Intl.DateTimeFormat('es-PE', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return dateFormatter.format(date)
}

function isVideo(url: string): boolean {
  return /\.(mp4|mov|webm|m4v)(\?|$)/i.test(url)
}

export function MyIncidentsPanel({ initialIncidents }: MyIncidentsPanelProps) {
  const [incidents, setIncidents] = useState<NearbyIncident[]>(initialIncidents)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const handleDelete = (id: string) => {
    setErrorMessage(null)
    setPendingId(id)
    startTransition(async () => {
      const result = await deleteMyIncident(id)
      if ('ok' in result) {
        setIncidents((prev) => prev.filter((incident) => incident.id !== id))
        setConfirmingId(null)
      } else {
        setErrorMessage(result.error)
      }
      setPendingId(null)
    })
  }

  return (
    <main className="relative min-h-svh bg-[#050505] text-white">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse at 0% 0%, rgba(255,255,255,0.05), transparent 55%), radial-gradient(ellipse at 100% 100%, rgba(217,165,94,0.06), transparent 55%), linear-gradient(180deg, rgba(11,15,28,0.95), rgba(5,7,15,1))',
        }}
      />

      <div className="mx-auto w-full max-w-[760px] px-4 py-10 sm:px-6 sm:py-14">
        <Link
          href="/feed"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-3 py-1.5 text-[12.5px] text-white/70 transition hover:bg-white/8 hover:text-white"
        >
          <ArrowRight size={14} className="rotate-180" />
          Volver al feed
        </Link>

        <header className="mt-6 flex items-end justify-between gap-4 border-b border-white/8 pb-5">
          <div>
            <h1 className="font-display text-[26px] font-semibold tracking-[-0.02em] sm:text-[32px]">
              Mis incidencias
            </h1>
            <p className="mt-1 text-[13.5px] text-white/55">
              Reportes que has registrado en tu comunidad.
            </p>
          </div>
          <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">
            {incidents.length} {incidents.length === 1 ? 'reporte' : 'reportes'}
          </span>
        </header>

        {errorMessage && (
          <div className="mt-5 rounded-lg border border-[#E04B5E]/30 bg-[#E04B5E]/10 px-3 py-2 text-[12.5px] text-[#FF8A99]">
            {errorMessage}
          </div>
        )}

        {incidents.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-white/8 bg-white/2 px-6 py-14 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-white/6 text-white/50">
              <MapPin size={22} />
            </span>
            <p className="text-[14px] text-white/65">Aún no has reportado ninguna incidencia.</p>
            <Link
              href="/feed"
              className="landing-btn landing-btn-primary mt-2 h-11 px-5 text-[13.5px]"
            >
              Reportar una incidencia <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <ul className="mt-6 flex flex-col gap-4">
            {incidents.map((incident) => {
              const confirming = confirmingId === incident.id
              const busy = pendingId === incident.id
              return (
                <li
                  key={incident.id}
                  className="flex gap-4 rounded-2xl border border-white/8 bg-white/2 p-4 backdrop-blur-sm"
                >
                  {incident.multimediaUrl && (
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                      {isVideo(incident.multimediaUrl) ? (
                        <video
                          src={incident.multimediaUrl}
                          muted
                          playsInline
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={incident.multimediaUrl}
                          alt={TYPE_LABEL[incident.incidentType]}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  )}

                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.15em]"
                        style={{
                          color: TYPE_COLOR[incident.incidentType],
                          background: `${TYPE_COLOR[incident.incidentType]}1A`,
                        }}
                      >
                        {TYPE_LABEL[incident.incidentType]}
                      </span>
                      <span className="font-mono text-[10.5px] text-white/40">
                        {formatDate(incident.createdAt)}
                      </span>
                    </div>
                    <p className="text-[13.5px] leading-relaxed text-white/80">
                      {incident.description}
                    </p>

                    <div className="mt-1.5">
                      {confirming ? (
                        <div className="flex items-center gap-2 text-[12.5px]">
                          <span className="text-white/55">¿Eliminar este reporte?</span>
                          <button
                            type="button"
                            onClick={() => handleDelete(incident.id)}
                            disabled={busy}
                            className="rounded-md bg-[#E04B5E] px-2.5 py-1 font-medium text-white transition hover:bg-[#c93f50] disabled:opacity-60"
                          >
                            {busy ? 'Eliminando…' : 'Sí, eliminar'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmingId(null)}
                            disabled={busy}
                            className="rounded-md border border-white/15 px-2.5 py-1 text-white/70 transition hover:bg-white/8 disabled:opacity-60"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setErrorMessage(null)
                            setConfirmingId(incident.id)
                          }}
                          className="inline-flex items-center gap-1.5 text-[12.5px] text-white/50 transition hover:text-[#FF8A99]"
                        >
                          <Trash2 size={14} />
                          Eliminar
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </main>
  )
}
