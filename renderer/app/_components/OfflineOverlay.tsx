"use client"

import { useSyncExternalStore } from "react"
import { WifiOff } from "lucide-react"

function subscribe(cb: () => void) {
  window.addEventListener("offline", cb)
  window.addEventListener("online", cb)
  return () => {
    window.removeEventListener("offline", cb)
    window.removeEventListener("online", cb)
  }
}

export function OfflineOverlay() {
  const online = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  )

  if (online) return null

  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-black gap-6">
      <div className="relative flex items-center justify-center">
        <span className="absolute inline-flex size-24 rounded-full bg-white/5 animate-ping" />
        <div className="relative flex items-center justify-center size-24 rounded-full bg-white/10">
          <WifiOff className="size-10 text-white/70" strokeWidth={1.5} />
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-white text-xl font-semibold tracking-wide">Sin conexión</p>
        <p className="text-white/50 text-sm max-w-xs">
          Verifica tu conexión a internet. La aplicación se reanudará automáticamente cuando vuelvas a estar en línea.
        </p>
      </div>

      <div className="flex gap-1.5 mt-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-2 rounded-full bg-white/40 animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  )
}
