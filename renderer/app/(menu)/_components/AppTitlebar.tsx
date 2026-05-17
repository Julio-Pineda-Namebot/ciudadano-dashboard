'use client'

import { useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'
import { Minus, Square, X, BellIcon } from 'lucide-react'
import { useAuth } from '@/app/(menu)/_components/AuthProvider'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { NavUser } from '@/app/(menu)/_components/NavUser'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const MODULE_NAMES: { pattern: RegExp; label: string }[] = [
  { pattern: /^\/incident\/dashboard/, label: 'Dashboard de Incidencias' },
  { pattern: /^\/incident\/heatmap/,   label: 'Mapa de Calor' },
  { pattern: /^\/incident\/incident-report/, label: 'Reportes de Incidencias' },
  { pattern: /^\/incident/,            label: 'Incidencias' },
  { pattern: /^\/dashboard/,           label: 'Dashboard General' },
  { pattern: /^\/news/,                label: 'Noticias' },
  { pattern: /^\/ciudadanos/,          label: 'Ciudadanos' },
  { pattern: /^\/security\/groups/,    label: 'Grupos' },
  { pattern: /^\/security\/web-staff/, label: 'Personal Web' },
  { pattern: /^\/security\/cameras/,   label: 'Cámaras' },
  { pattern: /^\/security\/audit-logs/, label: 'Logs de Auditoría' },
  { pattern: /^\/security/,            label: 'Seguridad' },
  { pattern: /^\/account/,             label: 'Mi Cuenta' },
]

function getModuleName(pathname: string): string {
  for (const { pattern, label } of MODULE_NAMES) {
    if (pattern.test(pathname)) return label
  }
  return 'Ciudadano'
}

function subscribe(cb: () => void) {
  window.addEventListener('load', cb)
  return () => window.removeEventListener('load', cb)
}

export function AppTitlebar() {
  const profile = useAuth()
  const pathname = usePathname()
  const hasElectron = useSyncExternalStore(subscribe, () => !!window.electron, () => false)
  const moduleName = getModuleName(pathname)

  return (
    <div
      className="sticky top-0 z-40 flex h-10 w-full shrink-0 items-center border-b border-border bg-background px-2 gap-2"
      // @ts-expect-error webkit drag region
      style={{ WebkitAppRegion: 'drag' }}
    >
      {/* izquierda: toggle sidebar */}
      {/* @ts-expect-error webkit drag region */}
      <div style={{ WebkitAppRegion: 'no-drag' }}>
        <SidebarTrigger className="size-7" />
      </div>

      {/* centro: empuja los botones a la derecha */}
      <div className="flex-1 pointer-events-none flex items-center justify-center">
        <span className="text-sm font-medium select-none">{moduleName}</span>
      </div>

      {/* derecha: campana + usuario + botones ventana */}
      {/* @ts-expect-error webkit drag region */}
      <div className="flex items-center gap-1" style={{ WebkitAppRegion: 'no-drag' }}>
        {/* campana */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative size-7" data-tour="header-bell">
              <BellIcon className="size-3.5" />
              <span className="absolute right-1 top-1 flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-red-500" />
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 rounded-lg" side="bottom" align="end" sideOffset={6}>
            <DropdownMenuLabel className="font-semibold">Notificaciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="flex flex-col items-center justify-center py-8 text-sm text-muted-foreground gap-2">
              <BellIcon className="size-8 opacity-30" />
              <span>Sin notificaciones por ahora</span>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* avatar / usuario */}
        <NavUser
          user={{
            name: `${profile.firstName} ${profile.lastName}`,
            email: profile.email,
            avatar: '',
          }}
          compact
          data-tour="header-user"
        />

        {/* separador visual */}
        {hasElectron && <div className="mx-1 h-4 w-px bg-border" />}

        {/* botones de ventana */}
        {hasElectron && (
          <>
            <button
              onClick={() => window.electron!.minimize()}
              className="flex size-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
              aria-label="Minimizar"
            >
              <Minus className="size-3" />
            </button>
            <button
              onClick={() => window.electron!.maximize()}
              className="flex size-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
              aria-label="Maximizar"
            >
              <Square className="size-2.5" />
            </button>
            <button
              onClick={() => window.electron!.close()}
              className="flex size-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-red-500 hover:text-white"
              aria-label="Cerrar"
            >
              <X className="size-3" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
