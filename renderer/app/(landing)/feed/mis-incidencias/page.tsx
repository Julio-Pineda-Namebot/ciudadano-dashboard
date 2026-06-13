import { redirect } from 'next/navigation'
import { fetchCitizenProfile } from '@/app/auth-citizen'
import { getMyIncidents } from '@/app/(landing)/feed/actions'
import { MyIncidentsPanel } from './_components/MyIncidentsPanel'

/**
 * Render the incidents page for the authenticated citizen.
 *
 * Performs a redirect to `/login?reason=session_expired` if no authenticated profile is found, otherwise loads the user's incidents and renders the incidents panel.
 *
 * @returns A React element that renders `MyIncidentsPanel` initialized with the current user's incidents.
 */
export default async function MyIncidentsPage() {
  const profile = await fetchCitizenProfile()
  if (!profile) redirect('/login?reason=session_expired')

  const incidents = await getMyIncidents()

  return <MyIncidentsPanel initialIncidents={incidents} />
}
