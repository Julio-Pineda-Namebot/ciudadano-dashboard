'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  BellIcon,
  MapPinIcon,
  ShieldCheckIcon,
  SirenIcon,
  Trash2Icon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
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

const INCIDENT_REPORTED_TYPE = 'admin_incident_reported'

interface BellItem {
  key: string
  ids: string[]
  icon: typeof BellIcon
  title: string
  body: string | null
  createdAt: string
  href?: string
}

function iconFor(type: string) {
  if (type.includes('alert')) return SirenIcon
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

// Agrupa las "nuevas incidencias" en un solo ítem ("N incidencias nuevas");
// el resto se muestra individualmente.
function buildItems(notifications: AdminNotification[]): BellItem[] {
  const reported = notifications.filter((n) => n.type === INCIDENT_REPORTED_TYPE)
  const rest = notifications.filter((n) => n.type !== INCIDENT_REPORTED_TYPE)

  const items: BellItem[] = rest.map((n) => ({
    key: n.id,
    ids: [n.id],
    icon: iconFor(n.type),
    title: n.title,
    body: n.body,
    createdAt: n.createdAt,
    href: undefined,
  }))

  if (reported.length > 0) {
    const count = reported.length
    items.push({
      key: 'group-incidents',
      ids: reported.map((n) => n.id),
      icon: MapPinIcon,
      title:
        count === 1
          ? '1 incidencia nueva reportada'
          : `${count} incidencias nuevas reportadas`,
      body: 'Toca para ver los reportes',
      createdAt: reported[0].createdAt,
      href: '/incident/incident-report',
    })
  }

  // Orden por fecha desc (la más reciente arriba).
  return items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function AppNotificationsBell({ compact = false }: { compact?: boolean }) {
  const router = useRouter()
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
  const items = buildItems(notifications)

  const handleOpenChange = async (open: boolean) => {
    if (open && unread > 0) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      await markAdminNotificationsRead()
    }
  }

  const handleDelete = async (ids: string[]) => {
    setNotifications((prev) => prev.filter((n) => !ids.includes(n.id)))
    await Promise.all(ids.map((id) => deleteAdminNotification(id)))
  }

  const handleClick = (item: BellItem) => {
    if (item.href) router.push(item.href)
  }

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('relative', compact ? 'size-7' : 'h-9 w-9')}
          data-tour="header-bell"
        >
          <BellIcon className={compact ? 'size-3.5' : 'size-4'} />
          {unread > 0 && (
            <span
              className={cn(
                'absolute flex',
                compact ? 'right-1 top-1 size-1.5' : 'right-1.5 top-1.5 size-2'
              )}
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span
                className={cn(
                  'relative inline-flex rounded-full bg-red-500',
                  compact ? 'size-1.5' : 'size-2'
                )}
              />
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 rounded-lg p-0" side="bottom" align="end" sideOffset={6}>
        <DropdownMenuLabel className="px-4 py-3 font-semibold">Notificaciones</DropdownMenuLabel>
        <DropdownMenuSeparator className="my-0" />
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
            <BellIcon className="size-8 opacity-30" />
            <span>Sin notificaciones por ahora</span>
          </div>
        ) : (
          <ul className="max-h-96 overflow-y-auto">
            {items.map((item) => {
              const Icon = item.icon
              return (
                <li
                  key={item.key}
                  className="flex items-start gap-3 border-b border-border px-4 py-3 last:border-b-0 hover:bg-muted/50"
                >
                  <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
                    <Icon className="size-4" />
                  </span>
                  <button
                    type="button"
                    disabled={!item.href}
                    onClick={() => handleClick(item)}
                    className="min-w-0 flex-1 text-left disabled:cursor-default"
                  >
                    <p className="text-sm font-medium">{item.title}</p>
                    {item.body && (
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.body}</p>
                    )}
                    <p className="mt-0.5 text-[10px] text-muted-foreground/70">
                      {formatTime(item.createdAt)}
                    </p>
                  </button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Eliminar notificación"
                    onClick={() => handleDelete(item.ids)}
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
