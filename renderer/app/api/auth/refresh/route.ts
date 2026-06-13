import { getSession, createSession, getTokenExpiry } from '@/lib/session'
import { post, ApiError } from '@/lib/backendService'
import { logger } from '@/lib/logger'

interface RefreshBody {
  data: { token: string }
}

// Renueva el token de sesión del admin (sesión deslizante). El cliente lo llama
// en silencio antes de que el token venza, mientras haya actividad.
// Contrato backend: POST /admin/auth/refresh con el token actual (Bearer) →
// devuelve { data: { token } } con un JWT nuevo de mayor vencimiento.
export async function POST() {
  const token = await getSession()
  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const res = await post<RefreshBody>('/admin/auth/refresh', {}, {
      headers: { Authorization: `Bearer ${token}` },
    })

    const newToken = res.data.token
    await createSession(newToken)

    return Response.json({ ok: true, expiresAt: getTokenExpiry(newToken) })
  } catch (err) {
    if (err instanceof ApiError) {
      // 401 → el token ya no es válido (no se puede renovar). Otros → backend caído.
      return Response.json(
        { error: 'refresh_failed' },
        { status: err.status === 401 ? 401 : 502 }
      )
    }
    logger.error('refresh de sesión falló', err)
    return Response.json({ error: 'refresh_failed' }, { status: 502 })
  }
}
