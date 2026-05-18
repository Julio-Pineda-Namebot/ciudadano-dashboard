import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SocketProvider } from '@/app/(menu)/_components/SocketProvider'
import { AuthProvider } from '@/app/(menu)/_components/AuthProvider'
import { MenuShell } from '@/app/(menu)/_components/MenuShell'
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
          <MenuShell>{children}</MenuShell>
        </TooltipProvider>
      </SocketProvider>
    </AuthProvider>
  )
}
