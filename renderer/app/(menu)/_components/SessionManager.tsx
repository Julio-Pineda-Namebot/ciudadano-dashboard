'use client'

import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { endSession } from '@/app/auth'

// --- Política de sesión del admin (sesión deslizante) ---
const IDLE_LIMIT_MS = 5 * 60 * 1000 // 5 min sin actividad → cierre de sesión
const IDLE_WARN_MS = 60 * 1000 // avisar 1 min antes del cierre por inactividad
const REFRESH_BEFORE_MS = 60 * 1000 // renovar el token 60 s antes de vencer
const FALLBACK_REFRESH_MS = 4 * 60 * 1000 // si el token no es JWT legible, renovar por cadencia
const REFRESH_COOLDOWN_MS = 20 * 1000 // espera mínima entre reintentos tras un refresh fallido
const TICK_MS = 1000
const WARN_TOAST_ID = 'session-idle-warning'

interface SessionManagerProps {
  // Vencimiento absoluto del token (ms) calculado en el server. Null = no legible.
  expiresAt: number | null
}

// Gestiona la sesión del admin como sesión deslizante:
// - Mientras hay actividad, renueva el token en silencio antes de que venza
//   (vía POST /api/auth/refresh) para no cortar al usuario en medio de su trabajo.
// - Tras 5 min de inactividad real, cierra la sesión (con aviso 1 min antes).
// Solo se monta en el área de admin (menu); no afecta la landing ni el feed ciudadano.
export function SessionManager({ expiresAt }: SessionManagerProps) {
  const lastActivityRef = useRef(Date.now())
  const expiresAtRef = useRef<number | null>(expiresAt)
  const refreshingRef = useRef(false)
  const lastRefreshRef = useRef(Date.now())
  const lastRefreshFailRef = useRef(0)
  const endedRef = useRef(false)
  const warningShownRef = useRef(false)

  useEffect(() => {
    expiresAtRef.current = expiresAt
  }, [expiresAt])

  useEffect(() => {
    const markActive = () => {
      lastActivityRef.current = Date.now()
    }
    // mousemove se dispara muchísimo: lo limitamos a 1 marca cada 2 s.
    let lastMove = 0
    const onMove = () => {
      const now = Date.now()
      if (now - lastMove > 2000) {
        lastMove = now
        markActive()
      }
    }
    window.addEventListener('pointerdown', markActive)
    window.addEventListener('keydown', markActive)
    window.addEventListener('scroll', markActive, { passive: true })
    window.addEventListener('touchstart', markActive, { passive: true })
    window.addEventListener('mousemove', onMove)

    const refresh = async () => {
      if (refreshingRef.current) return
      refreshingRef.current = true
      try {
        const res = await fetch('/api/auth/refresh', { method: 'POST', cache: 'no-store' })
        if (!res.ok) {
          lastRefreshFailRef.current = Date.now()
          return
        }
        const body = (await res.json()) as { expiresAt?: number | null }
        if (typeof body.expiresAt === 'number') expiresAtRef.current = body.expiresAt
        lastRefreshRef.current = Date.now()
        lastRefreshFailRef.current = 0
      } catch {
        lastRefreshFailRef.current = Date.now()
      } finally {
        refreshingRef.current = false
      }
    }

    const dismissWarn = () => {
      if (warningShownRef.current) {
        warningShownRef.current = false
        toast.dismiss(WARN_TOAST_ID)
      }
    }

    const showWarn = (secondsLeft: number) => {
      warningShownRef.current = true
      toast.warning('Tu sesión se cerrará por inactividad', {
        id: WARN_TOAST_ID,
        description: `Cierre en ${secondsLeft}s. ¿Sigues ahí?`,
        duration: Infinity,
        action: {
          label: 'Seguir conectado',
          onClick: () => {
            lastActivityRef.current = Date.now()
            dismissWarn()
            refresh()
          },
        },
      })
    }

    const end = (reason: string) => {
      if (endedRef.current) return
      endedRef.current = true
      toast.dismiss(WARN_TOAST_ID)
      endSession(reason)
    }

    const interval = setInterval(() => {
      if (endedRef.current) return
      const now = Date.now()
      const idle = now - lastActivityRef.current

      // 1) Cierre por inactividad.
      if (idle >= IDLE_LIMIT_MS) {
        end('session_idle')
        return
      }

      // 2) Aviso previo al cierre por inactividad (con cuenta regresiva).
      if (idle >= IDLE_LIMIT_MS - IDLE_WARN_MS) {
        showWarn(Math.ceil((IDLE_LIMIT_MS - idle) / 1000))
      } else {
        dismissWarn()
      }

      // 3) Renovación silenciosa mientras hay actividad.
      const canRetry = now - lastRefreshFailRef.current > REFRESH_COOLDOWN_MS
      if (!refreshingRef.current && canRetry) {
        const exp = expiresAtRef.current
        if (exp != null) {
          if (exp - now <= REFRESH_BEFORE_MS) refresh()
        } else if (now - lastRefreshRef.current >= FALLBACK_REFRESH_MS) {
          // Token no legible (opaco): renovamos por cadencia mientras esté activo.
          refresh()
        }
      }
    }, TICK_MS)

    return () => {
      clearInterval(interval)
      window.removeEventListener('pointerdown', markActive)
      window.removeEventListener('keydown', markActive)
      window.removeEventListener('scroll', markActive)
      window.removeEventListener('touchstart', markActive)
      window.removeEventListener('mousemove', onMove)
      toast.dismiss(WARN_TOAST_ID)
    }
  }, [])

  return null
}
