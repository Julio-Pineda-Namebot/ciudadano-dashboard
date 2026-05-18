'use client'

import { useSyncExternalStore } from 'react'
import { Minus, Square, X } from 'lucide-react'

function subscribe(cb: () => void) {
  window.addEventListener('load', cb)
  return () => window.removeEventListener('load', cb)
}

export function RootTitlebar() {
  const hasElectron = useSyncExternalStore(subscribe, () => !!window.electron, () => false)
  const isMac = hasElectron && window.electron!.platform === 'darwin'

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 flex h-10 items-center"
      // @ts-expect-error webkit drag region
      style={{ WebkitAppRegion: 'drag' }}
    >
      <div className="flex-1" />

      {hasElectron && !isMac && (
        <div
          className="flex h-full items-center"
          // @ts-expect-error webkit drag region
          style={{ WebkitAppRegion: 'no-drag' }}
        >
          <button
            onClick={() => window.electron!.minimize()}
            className="flex h-full w-11 items-center justify-center text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Minimizar"
          >
            <Minus className="size-4" />
          </button>
          <button
            onClick={() => window.electron!.maximize()}
            className="flex h-full w-11 items-center justify-center text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Maximizar"
          >
            <Square className="size-3" />
          </button>
          <button
            onClick={() => window.electron!.close()}
            className="flex h-full w-11 items-center justify-center text-white/80 transition-colors hover:bg-red-500 hover:text-white"
            aria-label="Cerrar"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
    </div>
  )
}
