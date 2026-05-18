'use client'

import { useEffect, useState } from 'react'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/app/(menu)/_components/AppSidebar'
import { AppTitlebar } from '@/app/(menu)/_components/AppTitlebar'
import { ScrollArea } from '@/components/ui/scroll-area'

export function MenuShell({ children }: { children: React.ReactNode }) {
  const [isMac, setIsMac] = useState(false)
  useEffect(() => setIsMac(window.electron?.platform === 'darwin'), [])

  if (isMac) {
    return (
      <SidebarProvider className="mac-titlebar min-h-0! h-[calc(100svh-2.5rem)] mt-10">
        <AppTitlebar />
        <AppSidebar />
        <SidebarInset className="min-w-0 overflow-hidden">
          <ScrollArea className="h-[calc(100svh-2.5rem)] w-full">
            {children}
          </ScrollArea>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0 overflow-hidden">
        <AppTitlebar />
        <ScrollArea className="h-[calc(100svh-2.5rem)] w-full">
          {children}
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  )
}
