'use server'

import { getSession } from '@/lib/session'
import { get, post, postMultipart, del, ApiError } from '@/lib/backendService'
import { logger } from '@/lib/logger'
import { redirect } from 'next/navigation'
import type { IncidentVote, IncidentStatus, VerifiedBy } from '@/lib/incidentStatus'
import type {
  FeedNotification,
  IncidentComment,
  IncidentDetail,
  IncidentType,
  NearbyIncident,
  ReportIncidentState,
} from './_types/types'

interface NearbyApiResponse {
  data: NearbyIncident[]
}

interface ReportApiResponse {
  data: NearbyIncident
}

interface IncidentDetailApiResponse {
  data: IncidentDetail
}

interface VoteApiResponse {
  data: {
    confirmCount: number
    disputeCount: number
    myVote: IncidentVote | null
    status: IncidentStatus
    verifiedBy: VerifiedBy | null
  }
}

interface CommentApiResponse {
  data: IncidentComment
}

const ALLOWED_TYPES: ReadonlyArray<IncidentType> = ['robo', 'accidente', 'vandalismo']

const ALLOWED_UPLOAD_TYPES = [
  'image/jpeg', 'image/png', 'image/webp',
  'video/mp4', 'video/quicktime', 'video/webm',
] as const
const MAX_UPLOAD_BYTES = 25 * 1024 * 1024 // 25 MB (imágenes + video)

async function bearerHeaders(): Promise<Record<string, string>> {
  const token = await getSession()
  if (!token) redirect('/login?reason=session_expired')
  return { Authorization: `Bearer ${token}` }
}

export async function getNearbyIncidents(lat: number, lon: number): Promise<NearbyIncident[]> {
  try {
    const res = await get<NearbyApiResponse>(
      `/incidents/nearby?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`,
      { headers: await bearerHeaders() }
    )
    return res.data
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect('/login?reason=session_expired')
    }
    logger.error('getNearbyIncidents falló', err)
    return []
  }
}

export async function getMyIncidents(): Promise<NearbyIncident[]> {
  try {
    const res = await get<NearbyApiResponse>('/incidents/mine', {
      headers: await bearerHeaders(),
    })
    return res.data
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect('/login?reason=session_expired')
    }
    logger.error('getMyIncidents falló', err)
    return []
  }
}

export async function deleteMyIncident(id: string): Promise<{ ok: true } | { error: string }> {
  try {
    await del(`/incidents/unreport/${encodeURIComponent(id)}`, {
      headers: await bearerHeaders(),
    })
    return { ok: true }
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 401) redirect('/login?reason=session_expired')
      if (err.status === 404) return { error: 'La incidencia ya no existe' }
      if (err.status === 403) return { error: 'No puedes eliminar esta incidencia' }
    }
    logger.error('deleteMyIncident falló', err)
    return { error: 'No se pudo eliminar la incidencia, intenta nuevamente' }
  }
}

export async function getIncidentDetail(id: string): Promise<IncidentDetail | null> {
  try {
    const res = await get<IncidentDetailApiResponse>(
      `/incidents/${encodeURIComponent(id)}`,
      { headers: await bearerHeaders() }
    )
    return res.data
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect('/login?reason=session_expired')
    }
    logger.error('getIncidentDetail falló', err)
    return null
  }
}

export async function voteIncident(
  id: string,
  vote: IncidentVote | null
): Promise<
  | {
      ok: true
      confirmCount: number
      disputeCount: number
      myVote: IncidentVote | null
      status: IncidentStatus
      verifiedBy: VerifiedBy | null
    }
  | { error: string }
> {
  try {
    if (vote === null) {
      const res = await del<{ data: { confirmCount: number; disputeCount: number } }>(
        `/incidents/${encodeURIComponent(id)}/vote`,
        { headers: await bearerHeaders() }
      )
      return {
        ok: true,
        confirmCount: res.data.confirmCount,
        disputeCount: res.data.disputeCount,
        myVote: null,
        status: 'pendiente',
        verifiedBy: null,
      }
    }
    const res = await post<VoteApiResponse>(
      `/incidents/${encodeURIComponent(id)}/vote`,
      { vote },
      { headers: await bearerHeaders() }
    )
    return { ok: true, ...res.data }
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 401) redirect('/login?reason=session_expired')
      if (err.status === 404) return { error: 'La incidencia ya no existe' }
    }
    logger.error('voteIncident falló', err)
    return { error: 'No se pudo registrar tu voto, intenta nuevamente' }
  }
}

export async function addComment(
  id: string,
  content: string
): Promise<{ ok: true; comment: IncidentComment } | { error: string }> {
  const trimmed = content.trim()
  if (trimmed.length < 1 || trimmed.length > 191) {
    return { error: 'El comentario debe tener entre 1 y 191 caracteres' }
  }
  try {
    const res = await post<CommentApiResponse>(
      `/incidents/${encodeURIComponent(id)}/comments`,
      { content: trimmed },
      { headers: await bearerHeaders() }
    )
    return { ok: true, comment: res.data }
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 401) redirect('/login?reason=session_expired')
      if (err.status === 404) return { error: 'La incidencia ya no existe' }
    }
    logger.error('addComment falló', err)
    return { error: 'No se pudo publicar tu comentario, intenta nuevamente' }
  }
}

export async function getNotifications(): Promise<FeedNotification[]> {
  try {
    const res = await get<{ data: FeedNotification[] }>('/notifications', {
      headers: await bearerHeaders(),
    })
    return res.data
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect('/login?reason=session_expired')
    }
    logger.error('getNotifications falló', err)
    return []
  }
}

export async function markNotificationsRead(): Promise<void> {
  try {
    await post('/notifications/read-all', {}, { headers: await bearerHeaders() })
  } catch (err) {
    logger.error('markNotificationsRead falló', err)
  }
}

export async function deleteNotification(id: string): Promise<void> {
  try {
    await del(`/notifications/${encodeURIComponent(id)}`, {
      headers: await bearerHeaders(),
    })
  } catch (err) {
    logger.error('deleteNotification falló', err)
  }
}

export async function reportIncident(
  _prevState: ReportIncidentState,
  formData: FormData
): Promise<ReportIncidentState> {
  const incidentType = formData.get('incident_type') as string
  const description = formData.get('description') as string
  const latitudeRaw = formData.get('latitude') as string
  const longitudeRaw = formData.get('longitude') as string
  const multimedia = formData.get('multimedia') as File | null

  if (!incidentType || !ALLOWED_TYPES.includes(incidentType as IncidentType)) {
    return { error: 'Selecciona un tipo de incidencia válido' }
  }
  if (!description || description.length < 10 || description.length > 191) {
    return { error: 'La descripción debe tener entre 10 y 191 caracteres' }
  }
  const latitude = Number(latitudeRaw)
  const longitude = Number(longitudeRaw)
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return { error: 'Selecciona un punto en el mapa' }
  }
  // La evidencia es obligatoria salvo para robo (accidente/vandalismo la requieren).
  const mediaRequired = incidentType !== 'robo'
  const hasMedia = !!multimedia && multimedia.size > 0
  if (mediaRequired && !hasMedia) {
    return { error: 'La foto o video es obligatoria para accidentes y vandalismo' }
  }
  if (multimedia && hasMedia) {
    if (!ALLOWED_UPLOAD_TYPES.includes(multimedia.type as (typeof ALLOWED_UPLOAD_TYPES)[number])) {
      return { error: 'Formato no permitido. Usa una imagen (JPG, PNG, WebP) o video (MP4, MOV, WebM).' }
    }
    if (multimedia.size > MAX_UPLOAD_BYTES) {
      return { error: 'El archivo supera el tamaño máximo de 25 MB.' }
    }
  }

  const upstream = new FormData()
  upstream.set('incident_type', incidentType)
  upstream.set('description', description)
  upstream.set('latitude', String(latitude))
  upstream.set('longitude', String(longitude))
  if (multimedia && hasMedia) upstream.set('multimedia', multimedia)

  try {
    await postMultipart<ReportApiResponse>('/incidents/report', upstream, {
      headers: await bearerHeaders(),
    })
    return { ok: true, message: 'Incidencia reportada correctamente' }
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 401) redirect('/login?reason=session_expired')
      if (err.status === 400) {
        const body = err.body as { message?: string | string[] } | undefined
        const msg = Array.isArray(body?.message) ? body?.message?.[0] : body?.message
        return { error: msg ?? 'Datos inválidos' }
      }
    }
    logger.error('reportIncident falló', err)
    return { error: 'No se pudo reportar la incidencia, intenta nuevamente' }
  }
}
