'use client'

import { useEffect, useRef } from 'react'
import { io, type Socket } from 'socket.io-client'
import { toast } from 'sonner'
import { logger } from '@/lib/logger'
import { TYPE_LABEL } from '@/app/(landing)/feed/constants'
import type { IncidentType } from '@/app/(landing)/feed/_types/types'
import type { IncidentStatus, VerifiedBy } from '@/lib/incidentStatus'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''

interface CitizenFeedSocketProviderProps {
  userId: string
  center: { lat: number; lon: number }
  onNearbyIncident?: () => void
  // Se dispara con cada notificación entrante para refrescar la campanita
  // desde el servidor (la fuente de verdad persistida).
  onIncoming?: () => void
}

interface ReportedPayload {
  incident: { id?: string; incidentType: IncidentType; description: string }
}
interface CommentPayload {
  incidentId?: string
  preview: string
}
interface StatusPayload {
  incidentId?: string
  status: IncidentStatus
  verifiedBy: VerifiedBy | null
}

async function fetchToken(): Promise<string | null> {
  try {
    const res = await fetch('/api/auth/citizen-ws-token', { cache: 'no-store' })
    if (!res.ok) return null
    const body = (await res.json()) as { token?: string }
    return body.token ?? null
  } catch {
    return null
  }
}

/**
 * Conecta el feed ciudadano al gateway de geolocalización para recibir toasts
 * en tiempo real: incidencias cercanas, comentarios y cambios de estado en los
 * reportes propios. Se reconecta cuando cambia el centro (zona) del usuario.
 */
export function CitizenFeedSocketProvider({
  center,
  onNearbyIncident,
  onIncoming,
}: CitizenFeedSocketProviderProps) {
  const socketRef = useRef<Socket | null>(null)
  const onNearbyRef = useRef(onNearbyIncident)
  const onIncomingRef = useRef(onIncoming)
  useEffect(() => {
    onNearbyRef.current = onNearbyIncident
  }, [onNearbyIncident])
  useEffect(() => {
    onIncomingRef.current = onIncoming
  }, [onIncoming])

  // Redondea el centro para evitar reconexiones por micro-movimientos del mapa.
  const lat = Number(center.lat.toFixed(3))
  const lon = Number(center.lon.toFixed(3))

  useEffect(() => {
    let cancelled = false

    const connect = async () => {
      const token = await fetchToken()
      if (cancelled || !token) return

      const socket = io(BACKEND_URL, {
        auth: { token, lat: String(lat), lng: String(lon) },
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      })
      socketRef.current = socket

      socket.on('incident:reported', (payload: ReportedPayload) => {
        const inc = payload?.incident
        toast.info('Nueva incidencia cerca de ti', {
          description: inc
            ? `${TYPE_LABEL[inc.incidentType]} · ${inc.description.slice(0, 60)}`
            : undefined,
        })
        onNearbyRef.current?.()
        onIncomingRef.current?.()
      })

      socket.on('notification:comment', (payload: CommentPayload) => {
        toast.info('Nuevo comentario en tu reporte', {
          description: payload?.preview ? `«${payload.preview}»` : undefined,
        })
        onIncomingRef.current?.()
      })

      socket.on('notification:vote', (payload: { title?: string }) => {
        toast.info(payload?.title ?? 'Validaron tu reporte')
        onIncomingRef.current?.()
      })

      socket.on('notification:status', (payload: StatusPayload) => {
        if (payload?.status === 'verificado') {
          toast.success(
            payload.verifiedBy === 'seguridad'
              ? 'Tu reporte fue verificado por seguridad'
              : 'Tu reporte fue verificado por la ciudadanía'
          )
        } else if (payload?.status === 'resuelto') {
          toast.success('Tu reporte fue marcado como resuelto')
        } else {
          toast.info('Tu reporte cambió de estado')
        }
        onIncomingRef.current?.()
      })

      socket.on('connect_error', (err) => {
        logger.warn('[feed] socket connect_error', err.message)
      })
    }

    connect()

    return () => {
      cancelled = true
      socketRef.current?.disconnect()
      socketRef.current = null
    }
  }, [lat, lon])

  return null
}
