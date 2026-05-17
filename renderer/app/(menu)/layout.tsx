import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SocketProvider } from '@/app/(menu)/_components/SocketProvider'
import { AuthProvider } from '@/app/(menu)/_components/AuthProvider'
import { AppSidebar } from '@/app/(menu)/_components/AppSidebar'
import { AppTitlebar } from '@/app/(menu)/_components/AppTitlebar'
import { fetchProfile, revokeSession } from '@/app/auth'

export default async function MenuLayout({ children }: { children: React.ReactNode }) {
  const token = await getSession()
  if (!token) redirect('/login')

  const profile = await fetchProfile()
  if (!profile) await revokeSession('session_invalid')

  return (
    <AuthProvider profile={profile!}>
      <SocketProvider>
        <TooltipProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <AppTitlebar />
              <ScrollArea className="h-[calc(100svh-2.5rem)]">
                {children}
              </ScrollArea>
            </SidebarInset>
          </SidebarProvider>
        </TooltipProvider>
      </SocketProvider>
    </AuthProvider>
  )
}
