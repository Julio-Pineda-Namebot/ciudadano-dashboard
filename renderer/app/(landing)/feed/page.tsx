import { redirect } from 'next/navigation'
import { fetchCitizenProfile } from '@/app/auth-citizen'
import { getNearbyIncidents } from './actions'
import { CitizenFeedClient } from './_components/CitizenFeedClient'

// Ica como punto inicial para consultar incidencias cercanas en el primer render.
const DEFAULT_LAT = -14.0681
const DEFAULT_LON = -75.7286

export default async function FeedPage() {
  const profile = await fetchCitizenProfile()
  if (!profile) redirect('/login?reason=session_expired')

  const initialIncidents = await getNearbyIncidents(DEFAULT_LAT, DEFAULT_LON)

  return (
    <CitizenFeedClient
      initialIncidents={initialIncidents}
      defaultCenter={{ lat: DEFAULT_LAT, lon: DEFAULT_LON }}
      profile={profile}
    />
  )
}
