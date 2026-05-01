import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { SocketProvider } from './_components/socket-provider'
import { AuthProvider } from './_components/auth-provider'
import { AppSidebar } from './_components/app-sidebar'
import { AppHeader } from './_components/app-header'
import { BreadcrumbProvider } from './_components/breadcrumb-context'
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
          <BreadcrumbProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <AppHeader />
                {children}
              </SidebarInset>
            </SidebarProvider>
          </BreadcrumbProvider>
        </TooltipProvider>
      </SocketProvider>
    </AuthProvider>
  )
}
