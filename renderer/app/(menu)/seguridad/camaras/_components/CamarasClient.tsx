'use client'

import { useMemo, useState } from 'react'
import { Search, LayoutGrid, Square, Maximize2, Camera as CameraIcon, Volume2, VolumeX } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CAMERAS, type Camera } from '../_data'
import { CameraFeed } from './CameraFeed'

type ViewMode = 'single' | 'grid'

const STATUS_DOT: Record<Camera['status'], string> = {
  recording: 'bg-red-500',
  online:    'bg-emerald-500',
  offline:   'bg-zinc-400',
}

const STATUS_LABEL: Record<Camera['status'], string> = {
  recording: 'Grabando',
  online:    'En vivo',
  offline:   'Sin señal',
}

export function CamarasClient() {
  const [selectedId, setSelectedId] = useState<string>(CAMERAS[0].id)
  const [view, setView] = useState<ViewMode>('single')
  const [query, setQuery] = useState('')
  const [muted, setMuted] = useState(true)

  const selected = useMemo(
    () => CAMERAS.find((c) => c.id === selectedId) ?? CAMERAS[0],
    [selectedId],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return CAMERAS
    return CAMERAS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.zone.toLowerCase().includes(q),
    )
  }, [query])

  const totals = useMemo(() => {
    return CAMERAS.reduce(
      (acc, c) => {
        acc[c.status] += 1
        return acc
      },
      { recording: 0, online: 0, offline: 0 } as Record<Camera['status'], number>,
    )
  }, [])

  return (
    <div className="flex gap-4">
      {/* Sidebar de cámaras */}
      <aside className="flex w-72 shrink-0 flex-col rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800">Cámaras</h2>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
              {CAMERAS.length} total
            </span>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar cámara..."
              className="h-8 pl-8 text-xs"
            />
          </div>
          <div className="mt-2 flex items-center gap-2 text-[10px] font-medium">
            <span className="flex items-center gap-1 text-red-600">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              {totals.recording} grabando
            </span>
            <span className="flex items-center gap-1 text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {totals.online} en vivo
            </span>
            <span className="flex items-center gap-1 text-zinc-500">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
              {totals.offline} offline
            </span>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-280px)]">
          <ul className="space-y-1 p-2">
            {filtered.map((cam) => {
              const isActive = cam.id === selectedId
              return (
                <li key={cam.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(cam.id)}
                    className={`group flex w-full items-stretch gap-2 rounded-lg border p-1.5 text-left transition-all ${
                      isActive
                        ? 'border-primary/40 bg-primary/5 shadow-sm ring-1 ring-primary/20'
                        : 'border-transparent hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-md ring-1 ring-black/30">
                      <CameraFeed camera={cam} variant="thumb" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[cam.status]} ${cam.status !== 'offline' ? 'animate-pulse' : ''}`} />
                        <span className="font-mono text-[11px] font-semibold text-gray-800">{cam.code}</span>
                      </div>
                      <p className="truncate text-xs font-medium text-gray-700">{cam.name}</p>
                      <p className="text-[10px] text-gray-500">
                        {cam.zone} · {STATUS_LABEL[cam.status]}
                      </p>
                    </div>
                  </button>
                </li>
              )
            })}
            {filtered.length === 0 && (
              <li className="px-2 py-6 text-center text-xs text-gray-500">
                No se encontraron cámaras
              </li>
            )}
          </ul>
        </ScrollArea>
      </aside>

      {/* Vista principal */}
      <section className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={`h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[selected.status]} ${selected.status !== 'offline' ? 'animate-pulse' : ''}`} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-800">
                {selected.code} · {selected.name}
              </p>
              <p className="text-[11px] text-gray-500">
                Zona {selected.zone} · {selected.resolution} @ {selected.fps}fps · {STATUS_LABEL[selected.status]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant={view === 'single' ? 'secondary' : 'ghost'}
              size="icon-sm"
              onClick={() => setView('single')}
              aria-label="Vista única"
              title="Vista única"
            >
              <Square className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'grid' ? 'secondary' : 'ghost'}
              size="icon-sm"
              onClick={() => setView('grid')}
              aria-label="Mosaico"
              title="Mosaico 2x2"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <div className="mx-1 h-5 w-px bg-gray-200" />
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? 'Activar audio' : 'Silenciar'}
              title={muted ? 'Activar audio' : 'Silenciar'}
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Capturar" title="Capturar imagen">
              <CameraIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Pantalla completa" title="Pantalla completa">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {view === 'single' ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-gray-200 bg-black shadow-md">
            <CameraFeed camera={selected} variant="main" />
          </div>
        ) : (
          <GridView selectedId={selectedId} onSelect={setSelectedId} />
        )}

        {/* Telemetría */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Estado" value={STATUS_LABEL[selected.status]} dot={STATUS_DOT[selected.status]} />
          <Stat label="Resolución" value={selected.resolution} />
          <Stat label="FPS" value={`${selected.fps}`} />
          <Stat label="Latencia" value={selected.status === 'offline' ? '—' : `${80 + (parseInt(selected.id.replace(/\D/g, ''), 10) % 60)} ms`} />
        </div>
      </section>
    </div>
  )
}

function GridView({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  const idx = CAMERAS.findIndex((c) => c.id === selectedId)
  const start = Math.max(0, Math.min(idx, CAMERAS.length - 4))
  const four = CAMERAS.slice(start, start + 4)

  return (
    <div className="grid aspect-video w-full grid-cols-2 grid-rows-2 gap-1.5 overflow-hidden rounded-xl border border-gray-200 bg-black p-1.5 shadow-md">
      {four.map((cam) => (
        <button
          key={cam.id}
          type="button"
          onClick={() => onSelect(cam.id)}
          className={`relative overflow-hidden rounded-md transition-all ${
            cam.id === selectedId
              ? 'ring-2 ring-primary shadow-lg'
              : 'ring-1 ring-white/10 hover:ring-white/40'
          }`}
        >
          <CameraFeed camera={cam} variant="main" />
        </button>
      ))}
    </div>
  )
}

function Stat({ label, value, dot }: { label: string; value: string; dot?: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
      <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">{label}</p>
      <div className="mt-0.5 flex items-center gap-1.5">
        {dot && <span className={`h-2 w-2 rounded-full ${dot}`} />}
        <p className="text-sm font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  )
}
