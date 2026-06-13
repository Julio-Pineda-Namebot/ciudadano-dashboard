import { redirect } from 'next/navigation'
import { fetchCitizenProfile } from '@/app/auth-citizen'
import { getNearbyIncidents } from './actions'
import { CitizenFeedClient } from './_components/CitizenFeedClient'

// Ica como punto inicial para consultar incidencias cercanas en el primer render.
const DEFAULT_LAT = -14.0681
const DEFAULT_LON = -75.7286

/**
 * Server page that ensures an authenticated citizen profile, fetches nearby incidents for a default location, and renders the feed client.
 *
 * If no profile is found the request is redirected to `/login?reason=session_expired`.
 *
 * @returns A React element rendering `CitizenFeedClient` initialized with the fetched `profile`, `initialIncidents`, and the default center coordinates.
 */
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
