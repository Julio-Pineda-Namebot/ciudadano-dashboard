'use client'

import { useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'
import { Minus, Square, X } from 'lucide-react'
import { useAuth } from '@/app/(menu)/_components/AuthProvider'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { NavUser } from '@/app/(menu)/_components/NavUser'
import { AppNotificationsBell } from '@/app/(menu)/_components/AppNotificationsBell'

const MODULE_NAMES: { pattern: RegExp; label: string }[] = [
  { pattern: /^\/incident\/dashboard/, label: 'Dashboard de Incidencias' },
  { pattern: /^\/incident\/heatmap/,   label: 'Mapa de Calor' },
  { pattern: /^\/incident\/incident-report/, label: 'Reportes de Incidencias' },
  { pattern: /^\/incident/,            label: 'Incidencias' },
  { pattern: /^\/dashboard/,           label: 'Dashboard General' },
  { pattern: /^\/news/,                label: 'Noticias' },
  { pattern: /^\/citizens/,            label: 'Ciudadanos' },
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
  const isMac = hasElectron && window.electron!.platform === 'darwin'
  const moduleName = getModuleName(pathname)

  const titlebarClass = isMac
    ? 'fixed inset-x-0 top-0 z-50 pl-20'
    : 'sticky top-0 z-40 w-full shrink-0'

  return (
    <div
      className={`${titlebarClass} flex h-10 items-center border-b border-border bg-background px-2 gap-2`}
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
        <AppNotificationsBell compact />

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
        {hasElectron && !isMac && <div className="mx-1 h-4 w-px bg-border" />}

        {/* botones de ventana (solo Windows/Linux: en mac usamos los semáforos nativos) */}
        {hasElectron && !isMac && (
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
