'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { TYPE_COLOR, TYPE_LABEL } from '@/app/(landing)/feed/constants'
import type { NearbyIncident } from '@/app/(landing)/feed/_types/types'

type MyIncidentsPanelProps = {
  incidents: NearbyIncident[]
}

const PAGE_SIZE = 50

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

// Construye los números de página a mostrar, con elipsis cuando hay muchas.
function getPageItems(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const items: (number | 'ellipsis')[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  if (start > 2) items.push('ellipsis')
  for (let i = start; i <= end; i++) items.push(i)
  if (end < total - 1) items.push('ellipsis')

  items.push(total)
  return items
}

export function MyIncidentsPanel({ incidents }: MyIncidentsPanelProps) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(incidents.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const pageItems = useMemo(
    () => incidents.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [incidents, currentPage]
  )

  const goToPage = (next: number) => {
    const clamped = Math.min(Math.max(1, next), totalPages)
    setPage(clamped)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
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
          <>
            <ul className="mt-6 flex flex-col gap-4">
              {pageItems.map((incident) => (
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
                  </div>
                </li>
              ))}
            </ul>

            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      text="Anterior"
                      aria-disabled={currentPage === 1}
                      className={cn(
                        'text-white/70 hover:bg-white/10 hover:text-white',
                        currentPage === 1
                          ? 'pointer-events-none opacity-40'
                          : 'cursor-pointer'
                      )}
                      onClick={() => goToPage(currentPage - 1)}
                    />
                  </PaginationItem>

                  {getPageItems(currentPage, totalPages).map((item, i) =>
                    item === 'ellipsis' ? (
                      <PaginationItem key={`ellipsis-${i}`}>
                        <PaginationEllipsis className="text-white/50" />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={item}>
                        <PaginationLink
                          isActive={item === currentPage}
                          className={cn(
                            'cursor-pointer text-white/60 hover:bg-white/10 hover:text-white',
                            item === currentPage &&
                              'border-white/40 bg-white/15 text-white hover:bg-white/15 hover:text-white'
                          )}
                          onClick={() => goToPage(item)}
                        >
                          {item}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      text="Siguiente"
                      aria-disabled={currentPage === totalPages}
                      className={cn(
                        'text-white/70 hover:bg-white/10 hover:text-white',
                        currentPage === totalPages
                          ? 'pointer-events-none opacity-40'
                          : 'cursor-pointer'
                      )}
                      onClick={() => goToPage(currentPage + 1)}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </main>
  )
}
