'use server'

import { createSession, deleteSession, getSession } from '@/lib/session'
import { get, post, ApiError } from '@/lib/backendService'
import { logger } from '@/lib/logger'
import { redirect } from 'next/navigation'
import type { CitizenLoginState, CitizenProfile } from './auth-citizen-types'

interface LoginApiResponse {
  data: { token: string }
}

interface ProfileApiResponse {
  data: CitizenProfile
}

export async function loginCitizen(_prevState: CitizenLoginState, formData: FormData): Promise<CitizenLoginState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Correo y contraseña son requeridos' }
  }

  let token: string

  try {
    const response = await post<LoginApiResponse>('/auth/login', { email, password })
    token = response.data.token
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 400 || err.status === 401) {
        return { error: 'Correo o contraseña inválidos' }
      }
      if (err.status >= 500) {
        return { error: 'Verifica tus datos e intenta nuevamente.' }
      }
    }
    return { error: 'Error de conexión con el servidor' }
  }

  await createSession(token)
  logger.log('Sesión de ciudadano iniciada', { email })

  // Vuelve al destino indicado (p. ej. el incidente de un enlace compartido),
  // solo si es una ruta interna del feed.
  const next = formData.get('next') as string | null
  redirect(next && next.startsWith('/feed') ? next : '/feed')
}

export async function logoutCitizen() {
  await deleteSession()
  redirect('/login')
}

export async function fetchCitizenProfile(): Promise<CitizenProfile | null> {
  const token = await getSession()
  if (!token) return null
  try {
    const res = await get<ProfileApiResponse>('/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data
  } catch (err) {
    if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
      try {
        await deleteSession()
      } catch {
        // se ignora cuando se invoca fuera de un Server Action / Route Handler
      }
      return null
    }
    logger.warn('fetchCitizenProfile falló', err)
    return null
  }
}
