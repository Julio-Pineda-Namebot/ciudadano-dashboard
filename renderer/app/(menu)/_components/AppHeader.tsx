'use client'

import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useAuth } from '@/app/(menu)/_components/AuthProvider'
import { NavUser } from '@/app/(menu)/_components/NavUser'
import { AppNotificationsBell } from '@/app/(menu)/_components/AppNotificationsBell'

function SystemStatusBadge() {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium">
      <span className="relative flex size-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-green-500" />
      </span>
      Sistema activo
    </div>
  )
}

export function AppHeader() {
  const profile = useAuth()

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      {/* Left: trigger */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-vertical:h-4 data-vertical:self-auto"
        />
      </div>

      {/* Right: system status + bell + user + window controls */}
      <div className="flex items-center gap-2">
        <div data-tour="header-status">
          <SystemStatusBadge />
        </div>
        <AppNotificationsBell />
        <NavUser
          user={{
            name: `${profile.firstName} ${profile.lastName}`,
            email: profile.email,
            avatar: '',
          }}
          data-tour="header-user"
        />
      </div>
    </header>
  )
}
