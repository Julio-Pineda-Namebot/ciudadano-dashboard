'use client'

import { useEffect, useRef } from 'react'
import { io, type Socket } from 'socket.io-client'
import { revokeSession } from '@/app/auth'
import { logger } from '@/lib/logger'

type RevokedReason = 'FORCED_LOGIN' | 'LOGOUT' | 'EXPIRED' | 'INVALID' | 'NO_TOKEN'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''

async function fetchToken(): Promise<string | null> {
  try {
    const res = await fetch('/api/auth/ws-token', { cache: 'no-store' })
    if (!res.ok) return null
    const body = (await res.json()) as { token?: string }
    return body.token ?? null
  } catch {
    return null
  }
}

async function fetchSessionStatus(): Promise<{ active: boolean; reason?: string }> {
  try {
    const res = await fetch('/api/auth/session-status', { cache: 'no-store' })
    return (await res.json()) as { active: boolean; reason?: string }
  } catch {
    return { active: false, reason: 'INVALID' }
  }
}

function reasonToParam(reason: RevokedReason | string | undefined): string {
  switch (reason) {
    case 'FORCED_LOGIN':
      return 'session_revoked'
    case 'EXPIRED':
      return 'session_expired'
    case 'LOGOUT':
      return 'logged_out'
    default:
      return 'session_invalid'
  }
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socketRef = useRef<Socket | null>(null)
  const revokedRef = useRef(false)

  useEffect(() => {
    let cancelled = false

    const handleRevoked = (reason: RevokedReason | string | undefined) => {
      if (revokedRef.current) return
      revokedRef.current = true
      socketRef.current?.disconnect()
      revokeSession(reasonToParam(reason))
    }

    const connect = async () => {
      const token = await fetchToken()
      if (cancelled) return
      if (!token) {
        handleRevoked('NO_TOKEN')
        return
      }

      const socket = io(`${BACKEND_URL}/admin`, {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      })
      socketRef.current = socket

      socket.on('session.connected', ({ sessionId }: { sessionId: string }) => {
        logger.log('[admin] socket ready', sessionId)
      })

      socket.on('session.revoked', ({ reason }: { reason: RevokedReason }) => {
        logger.log('[admin] session revoked', reason)
        handleRevoked(reason)
      })

      socket.on('connect_error', (err) => {
        logger.warn('[admin] socket connect_error', err.message)
      })

      socket.io.on('reconnect', async () => {
        logger.log('[admin] socket reconnect — verifying session')
        const status = await fetchSessionStatus()
        if (!status.active) handleRevoked(status.reason)
      })
    }

    connect()

    return () => {
      cancelled = true
      socketRef.current?.disconnect()
      socketRef.current = null
    }
  }, [])

  return <>{children}</>
}
