'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Bell,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Trash2,
} from 'lucide-react'
import type { FeedNotification } from '@/app/(landing)/feed/_types/types'

type CitizenFeedNotificationsBellProps = {
  notifications: FeedNotification[]
  onOpen?: () => void
  onDelete?: (id: string) => void
  onOpenIncident?: (incidentId: string) => void
}

function iconFor(type: string): typeof Bell {
  if (type.includes('comment')) return MessageCircle
  if (type.includes('status')) return ShieldCheck
  return MapPin
}

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

export function CitizenFeedNotificationsBell({
  notifications,
  onOpen,
  onDelete,
  onOpenIncident,
}: CitizenFeedNotificationsBellProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const unread = notifications.filter((n) => !n.read).length

  // Al abrir, marca todo como leído en el servidor (el puntito desaparece).
  const handleToggle = () => {
    setOpen((prev) => {
      const next = !prev
      if (next && unread > 0) onOpen?.()
      return next
    })
  }

  // Cerrar al hacer clic fuera o presionar Escape.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Notificaciones"
        className="relative grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/6 text-white/90 backdrop-blur-sm transition hover:bg-white/12 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex size-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-red-500" />
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-12 z-50 w-72 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f1c]/95 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-md"
        >
          <div className="border-b border-white/8 px-4 py-3 text-[13px] font-semibold text-white">
            Notificaciones
          </div>

          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center text-white/45">
              <Bell size={28} className="opacity-30" />
              <span className="text-[12.5px]">Sin notificaciones por ahora</span>
            </div>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {notifications.map((n) => {
                const Icon = iconFor(n.type)
                const clickable = !!n.incidentId && !!onOpenIncident
                return (
                  <li
                    key={n.id}
                    className="group/notif flex items-start gap-3 border-b border-white/6 px-4 py-3 last:border-b-0 hover:bg-white/6"
                  >
                    <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-white/8 text-white/70">
                      <Icon size={15} />
                    </span>
                    <button
                      type="button"
                      disabled={!clickable}
                      onClick={() => {
                        if (n.incidentId && onOpenIncident) {
                          onOpenIncident(n.incidentId)
                          setOpen(false)
                        }
                      }}
                      className="min-w-0 flex-1 text-left disabled:cursor-default"
                    >
                      <span className="block text-[12.5px] font-medium text-white/90">
                        {n.title}
                      </span>
                      {n.body && (
                        <span className="mt-0.5 block truncate text-[11.5px] text-white/50">
                          {n.body}
                        </span>
                      )}
                      <span className="mt-0.5 block font-mono text-[10px] text-white/35">
                        {formatTime(n.createdAt)}
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-label="Eliminar notificación"
                      onClick={() => onDelete?.(n.id)}
                      className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md text-white/30 transition hover:bg-white/10 hover:text-[#FF8A99]"
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
