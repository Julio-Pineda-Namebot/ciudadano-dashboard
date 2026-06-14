'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2, MapPin, Search, X } from 'lucide-react'
import type { RoutePoint } from '@/app/(landing)/feed/_types/types'
import { ICA_BOUNDS } from '@/app/(landing)/feed/constants'

interface Suggestion {
  id: string
  name: string
  address: string
}

interface CitizenFeedSearchProps {
  onPick: (p: RoutePoint, label: string) => void
}

// Centro de Ica: sesga las sugerencias hacia la zona y nos da el campo `distance`.
const [[minLon, minLat], [maxLon, maxLat]] = ICA_BOUNDS as [
  [number, number],
  [number, number],
]
const PROXIMITY = `${(minLon + maxLon) / 2},${(minLat + maxLat) / 2}`
// El mapa está bloqueado a Ica (maxBounds, ~30km de radio). Descartamos sugerencias
// más lejanas para no mostrar lugares a los que el flyTo no podría llegar.
const MAX_DISTANCE_M = 30_000

const SEARCHBOX = 'https://api.mapbox.com/search/searchbox/v1'

async function suggestPlaces(
  query: string,
  session: string,
  signal: AbortSignal
): Promise<Suggestion[]> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  if (!token) return []

  const params = new URLSearchParams({
    q: query,
    access_token: token,
    session_token: session,
    language: 'es',
    country: 'pe',
    proximity: PROXIMITY,
    limit: '8',
  })

  const res = await fetch(`${SEARCHBOX}/suggest?${params.toString()}`, { signal })
  if (!res.ok) return []

  const data = (await res.json()) as {
    suggestions?: Array<{
      mapbox_id?: string
      name?: string
      place_formatted?: string
      full_address?: string
      distance?: number
    }>
  }

  return (data.suggestions ?? [])
    .filter((s) => s.mapbox_id && (s.distance ?? Infinity) <= MAX_DISTANCE_M)
    .map((s) => ({
      id: s.mapbox_id as string,
      name: s.name ?? 'Ubicación',
      address: s.full_address ?? s.place_formatted ?? '',
    }))
}

async function retrievePoint(id: string, session: string): Promise<RoutePoint | null> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  if (!token) return null

  const params = new URLSearchParams({ access_token: token, session_token: session })
  const res = await fetch(`${SEARCHBOX}/retrieve/${id}?${params.toString()}`)
  if (!res.ok) return null

  const data = (await res.json()) as {
    features?: Array<{ geometry?: { coordinates?: [number, number] } }>
  }
  const coords = data.features?.[0]?.geometry?.coordinates
  return coords ? { lat: coords[1], lon: coords[0] } : null
}

function newSession(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.round(Math.random() * 1e9)}`
}

export function CitizenFeedSearch({ onPick }: CitizenFeedSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const containerRef = useRef<HTMLDivElement | null>(null)
  // Una sesión agrupa varios suggest + un retrieve (facturación). Se renueva al elegir.
  const sessionRef = useRef<string>(newSession())

  // Debounce: busca 300ms después de la última tecla y cancela peticiones en vuelo.
  useEffect(() => {
    const term = query.trim()
    if (term.length < 3) {
      setResults([])
      setLoading(false)
      return
    }
    const controller = new AbortController()
    setLoading(true)
    const timer = setTimeout(async () => {
      try {
        const places = await suggestPlaces(term, sessionRef.current, controller.signal)
        setResults(places)
        setActive(-1)
        setOpen(true)
      } catch {
        // Ignora abortos y errores de red: el dropdown simplemente queda vacío.
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => {
      controller.abort()
      clearTimeout(timer)
    }
  }, [query])

  // Cierra el dropdown al hacer click fuera.
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const pick = async (s: Suggestion) => {
    setQuery(s.name)
    setOpen(false)
    setResults([])
    const point = await retrievePoint(s.id, sessionRef.current)
    sessionRef.current = newSession()
    if (point) onPick(point, s.name)
  }

  const clear = () => {
    setQuery('')
    setResults([])
    setOpen(false)
    setActive(-1)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (i + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (i - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      void pick(results[active >= 0 ? active : 0])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div
      ref={containerRef}
      className="pointer-events-auto absolute bottom-4 left-1/2 z-10 w-[min(92%,440px)] -translate-x-1/2"
    >
      {open && results.length > 0 && (
        <ul className="mb-2 max-h-64 overflow-y-auto rounded-2xl border border-white/10 bg-black/85 p-1.5 backdrop-blur-md shadow-[0_12px_32px_-12px_rgba(0,0,0,0.8)]">
          {results.map((r, i) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => void pick(r)}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full items-start gap-2.5 rounded-xl px-3 py-2 text-left transition ${
                  i === active ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                <MapPin size={14} className="mt-0.5 shrink-0 text-[#D9A55E]" />
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-medium text-white">{r.name}</span>
                  {r.address && (
                    <span className="block truncate text-[11px] text-white/45">{r.address}</span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/75 px-4 py-2.5 backdrop-blur-md shadow-[0_8px_24px_-12px_rgba(0,0,0,0.7)]">
        {loading ? (
          <Loader2 size={16} className="shrink-0 animate-spin text-white/60" />
        ) : (
          <Search size={16} className="shrink-0 text-white/60" />
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Buscar un lugar o dirección"
          aria-label="Buscar un lugar o dirección"
          className="min-w-0 flex-1 bg-transparent text-[13.5px] text-white placeholder:text-white/40 focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={clear}
            aria-label="Limpiar búsqueda"
            className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            <X size={13} />
          </button>
        )}
      </div>
    </div>
  )
}
