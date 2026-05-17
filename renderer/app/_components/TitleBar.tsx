"use client"

import { useSyncExternalStore } from "react"
import { Minus, Square, X } from "lucide-react"

function subscribe(cb: () => void) {
  window.addEventListener("load", cb)
  return () => window.removeEventListener("load", cb)
}

function getSnapshot() {
  return !!window.electron
}

export function TitleBar() {
  const hasElectron = useSyncExternalStore(subscribe, getSnapshot, () => false)

  if (!hasElectron) return null

  const el = window.electron!

  return (
    <div className="fixed top-0 right-0 z-9999 flex items-center">
      <button
        onClick={() => el.minimize()}
        className="flex h-8 w-12 items-center justify-center text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
        aria-label="Minimizar"
      >
        <Minus className="size-3.5" />
      </button>
      <button
        onClick={() => el.maximize()}
        className="flex h-8 w-12 items-center justify-center text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
        aria-label="Maximizar"
      >
        <Square className="size-3" />
      </button>
      <button
        onClick={() => el.close()}
        className="flex h-8 w-12 items-center justify-center text-muted-foreground transition-colors hover:bg-red-500 hover:text-white"
        aria-label="Cerrar"
      >
        <X className="size-3.5" />
      </button>
    </div>
  )
}
