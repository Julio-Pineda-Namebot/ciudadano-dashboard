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

/**
 * Authenticate a citizen using form data, create a session on success, and redirect to /feed.
 *
 * @param formData - FormData that must include `email` and `password` fields
 * @returns A `CitizenLoginState` containing an `error` message when authentication fails; on successful authentication the function creates a session and redirects to `/feed` (no value is returned)
 */
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
  redirect('/feed')
}

/**
 * Ends the current citizen session and redirects the user to the login page.
 *
 * Deletes the server-side session before performing the redirect.
 */
export async function logoutCitizen() {
  await deleteSession()
  redirect('/login')
}

/**
 * Fetches the authenticated citizen's profile from the backend using the current session token.
 *
 * If no session token exists, or if the request fails (including authentication failures), the function returns `null`.
 * On authentication failures (HTTP 401 or 403) it attempts to delete the local session before returning `null`.
 *
 * @returns The citizen profile when available, `null` if there is no active session or the profile could not be retrieved.
 */
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
