'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { SirenIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getPanicAlerts } from '@/app/(menu)/alerts/actions'
import { ADMIN_NOTIFICATIONS_EVENT } from '@/app/(menu)/_components/notificationsTypes'
import type { AlertsPanelProps, PanicAlert } from '@/app/(menu)/alerts/_types/types'
import { AlertsMap } from './AlertsMap'

function formatTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('es-PE', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function AlertsPanel({ initialAlerts }: AlertsPanelProps) {
  const searchParams = useSearchParams()
  const focusId = searchParams.get('focus')

  const [alerts, setAlerts] = useState<PanicAlert[]>(initialAlerts)
  // El deep-link (?focus=ID) llega desde la campanita; la page ya trae esa
  // alerta en la carga inicial, así que basta con inicializar la selección.
  const [selectedId, setSelectedId] = useState<string | null>(focusId)

  const refresh = useCallback(() => {
    getPanicAlerts().then(setAlerts)
  }, [])

  // Refresco en vivo: el SocketProvider dispara este evento de ventana al
  // recibir una alerta de pánico (alert:dispatched).
  useEffect(() => {
    const onChanged = () => refresh()
    window.addEventListener(ADMIN_NOTIFICATIONS_EVENT, onChanged)
    return () => window.removeEventListener(ADMIN_NOTIFICATIONS_EVENT, onChanged)
  }, [refresh])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="grid size-9 place-items-center rounded-lg bg-red-50 text-red-600">
          <SirenIcon className="size-5" />
        </span>
        <div>
          <h1 className="text-lg font-semibold leading-tight">Alertas de pánico</h1>
          <p className="text-xs text-muted-foreground">
            Ubicación en tiempo real de quienes activaron una alerta de emergencia
          </p>
        </div>
      </div>

      <div
        className="grid gap-4 lg:grid-cols-[320px_1fr]"
        style={{ height: 'calc(100vh - 200px)' }}
      >
        {/* Lista de alertas */}
        <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border">
          <div className="border-b border-border px-4 py-3 text-sm font-semibold">
            {alerts.length === 0
              ? 'Sin alertas'
              : `${alerts.length} alerta${alerts.length === 1 ? '' : 's'}`}
          </div>
          {alerts.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center text-sm text-muted-foreground">
              <SirenIcon className="size-8 opacity-30" />
              <span>No hay alertas de pánico registradas</span>
            </div>
          ) : (
            <ul className="flex-1 overflow-y-auto">
              {alerts.map((alert) => (
                <li key={alert.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(alert.id)}
                    className={cn(
                      'flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition hover:bg-muted/50',
                      selectedId === alert.id && 'bg-red-50 hover:bg-red-50'
                    )}
                  >
                    <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-red-100 text-red-600">
                      <SirenIcon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{alert.title}</p>
                      {alert.body && (
                        <p className="mt-0.5 text-xs text-muted-foreground wrap-break-word">
                          {alert.body}
                        </p>
                      )}
                      <p className="mt-0.5 text-[10px] text-muted-foreground/70">
                        {formatTime(alert.createdAt)}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Mapa */}
        <AlertsMap alerts={alerts} selectedId={selectedId} onSelect={setSelectedId} />
      </div>
    </div>
  )
}
