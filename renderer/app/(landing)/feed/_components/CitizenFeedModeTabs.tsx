'use client'

import { Icon } from '@/app/(landing)/_components/icons'
import type { FeedMode } from '@/app/(landing)/feed/_types/types'

interface CitizenFeedModeTabsProps {
  mode: FeedMode
  onChangeMode: (m: FeedMode) => void
  onRecenter: () => void
}

export function CitizenFeedModeTabs({ mode, onChangeMode, onRecenter }: CitizenFeedModeTabsProps) {
  return (
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
          onClick={() => onChangeMode('view')}
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
          onClick={() => onChangeMode('report')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] transition ${
            mode === 'report'
              ? 'bg-white text-black'
              : 'text-white/50 hover:text-white/80'
          }`}
        >
          <Icon name="plus" size={13} />
          Reportar
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'route'}
          onClick={() => onChangeMode('route')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] transition ${
            mode === 'route'
              ? 'bg-[#6BAE7A] text-black'
              : 'text-white/50 hover:text-white/80'
          }`}
        >
          <Icon name="pin" size={13} />
          Ruta segura
        </button>
      </div>
      <button
        type="button"
        onClick={onRecenter}
        title="Centrar en mi ubicación"
        aria-label="Centrar en mi ubicación"
        className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-black/70 text-white/70 backdrop-blur-md shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)] transition hover:bg-black/85 hover:text-white"
      >
        <Icon name="pin" size={14} />
      </button>
    </div>
  )
}
