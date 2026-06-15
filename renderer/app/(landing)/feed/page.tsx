import { redirect } from 'next/navigation'
import { fetchCitizenProfile } from '@/app/auth-citizen'
import { getNearbyIncidents } from './actions'
import { CitizenFeedClient } from './_components/CitizenFeedClient'

// Ica como punto inicial para consultar incidencias cercanas en el primer render.
const DEFAULT_LAT = -14.0681
const DEFAULT_LON = -75.7286

interface Props {
  searchParams: Promise<{ incident?: string }>
}

export default async function FeedPage({ searchParams }: Props) {
  const { incident } = await searchParams

  const profile = await fetchCitizenProfile()
  if (!profile) {
    // Visitante no autenticado (p. ej. abrió un enlace compartido): se le envía
    // a login sin el mensaje de "sesión expiró"; conserva el incidente para
    // volver a él tras iniciar sesión.
    const next = incident
      ? `/feed?incident=${encodeURIComponent(incident)}`
      : '/feed'
    redirect(`/login?next=${encodeURIComponent(next)}`)
  }

  const initialIncidents = await getNearbyIncidents(DEFAULT_LAT, DEFAULT_LON)

  return (
    <CitizenFeedClient
      initialIncidents={initialIncidents}
      defaultCenter={{ lat: DEFAULT_LAT, lon: DEFAULT_LON }}
      profile={profile}
    />
  )
}
