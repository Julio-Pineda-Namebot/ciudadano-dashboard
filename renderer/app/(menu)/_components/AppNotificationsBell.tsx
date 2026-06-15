'use client'

import { useCallback, useEffect, useState } from 'react'
import { BellIcon, MapPinIcon, ShieldCheckIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  deleteAdminNotification,
  getAdminNotifications,
  markAdminNotificationsRead,
} from '@/app/(menu)/_components/notificationsActions'
import {
  ADMIN_NOTIFICATIONS_EVENT,
  type AdminNotification,
} from '@/app/(menu)/_components/notificationsTypes'

function iconFor(type: string) {
  if (type.includes('status')) return ShieldCheckIcon
  return MapPinIcon
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

export function AppNotificationsBell() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([])

  const refresh = useCallback(() => {
    getAdminNotifications().then(setNotifications)
  }, [])

  // Carga inicial + refresco al recibir eventos en vivo (vía SocketProvider).
  useEffect(() => {
    refresh()
    const onChanged = () => refresh()
    window.addEventListener(ADMIN_NOTIFICATIONS_EVENT, onChanged)
    return () => window.removeEventListener(ADMIN_NOTIFICATIONS_EVENT, onChanged)
  }, [refresh])

  const unread = notifications.filter((n) => !n.read).length

  const handleOpenChange = async (open: boolean) => {
    if (open && unread > 0) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      await markAdminNotificationsRead()
    }
  }

  const handleDelete = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    await deleteAdminNotification(id)
  }

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9" data-tour="header-bell">
          <BellIcon className="size-4" />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-red-500" />
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 rounded-lg p-0" side="bottom" align="end" sideOffset={6}>
        <DropdownMenuLabel className="px-4 py-3 font-semibold">Notificaciones</DropdownMenuLabel>
        <DropdownMenuSeparator className="my-0" />
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
            <BellIcon className="size-8 opacity-30" />
            <span>Sin notificaciones por ahora</span>
          </div>
        ) : (
          <ul className="max-h-96 overflow-y-auto">
            {notifications.map((n) => {
              const Icon = iconFor(n.type)
              return (
                <li
                  key={n.id}
                  className="flex items-start gap-3 border-b border-border px-4 py-3 last:border-b-0 hover:bg-muted/50"
                >
                  <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{n.title}</p>
                    {n.body && (
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{n.body}</p>
                    )}
                    <p className="mt-0.5 text-[10px] text-muted-foreground/70">
                      {formatTime(n.createdAt)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Eliminar notificación"
                    onClick={() => handleDelete(n.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2Icon className="size-3.5" />
                  </Button>
                </li>
              )
            })}
          </ul>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
