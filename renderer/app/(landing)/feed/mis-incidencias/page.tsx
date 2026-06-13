import { redirect } from 'next/navigation'
import { fetchCitizenProfile } from '@/app/auth-citizen'
import { getMyIncidents } from '@/app/(landing)/feed/actions'
import { MyIncidentsPanel } from './_components/MyIncidentsPanel'

export default async function MyIncidentsPage() {
  const profile = await fetchCitizenProfile()
  if (!profile) redirect('/login?reason=session_expired')

  const incidents = await getMyIncidents()

  return <MyIncidentsPanel incidents={incidents} />
}
