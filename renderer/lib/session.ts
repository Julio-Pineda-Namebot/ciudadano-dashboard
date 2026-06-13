import 'server-only'
import { cookies } from 'next/headers'

const SESSION_COOKIE = 'ciudadano-session'

export async function createSession(token: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function getSession() {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE)?.value ?? null
}

// Decodifica el `exp` del JWT (sin verificar firma, solo para conocer el
// vencimiento). Devuelve el timestamp en ms, o null si el token no es un JWT
// con `exp` legible (p. ej. token opaco).
export function getTokenExpiry(token: string): number | null {
  const parts = token.split('.')
  if (parts.length < 2) return null
  try {
    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString('utf8')
    ) as { exp?: number }
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null
  } catch {
    return null
  }
}

// Vencimiento absoluto de la sesión actual (ms), para que el cliente sepa
// cuándo renovar el token. Null si no hay token o no es JWT.
export async function getSessionExpiry(): Promise<number | null> {
  const token = await getSession()
  if (!token) return null
  return getTokenExpiry(token)
}
