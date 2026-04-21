'use server'

import { createSession, deleteSession, getSession } from '@/lib/session'
import { post, ApiError } from '@/lib/backendService'
import { logger } from '@/lib/logger'
import { redirect } from 'next/navigation'
import type { ActiveSessionInfo, AdminProfile, LoginState } from './auth-types'

interface LoginApiResponse {
  data: { token: string }
}

interface ProfileApiResponse {
  data: AdminProfile
}

export async function fetchProfile(): Promise<AdminProfile | null> {
  const token = await getSession()
  if (!token) return null
  try {
    const res = await post<ProfileApiResponse>(
      '/admin/auth/profile',
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return res.data
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null
    throw err
  }
}

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const username = formData.get('username') as string
  const password = formData.get('password') as string
  const forceLogin = formData.get('forceLogin') === 'true'
  const deviceName = (formData.get('deviceName') as string | null) || undefined

  if (!username || !password) {
    return { error: 'Usuario y contraseña son requeridos' }
  }

  let token: string

  try {
    const response = await post<LoginApiResponse>(
      '/admin/auth/login',
      {
        username,
        password,
        ...(forceLogin && { forceLogin: true }),
        ...(deviceName && { deviceName }),
      },
      deviceName ? { headers: { 'X-Device-Name': deviceName } } : undefined
    )
    token = response.data.token
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 409) {
        const body = err.body as { activeSession?: ActiveSessionInfo } | undefined
        return { sessionActive: true, activeSession: body?.activeSession }
      }
      if (err.status === 400) {
        return { error: 'Usuario o contraseña inválidos' }
      }
    }
    return { error: err instanceof Error ? err.message : 'Error de conexión con el servidor' }
  }

  await createSession(token)
  logger.log('Sesión iniciada', { username })
  redirect('/menu')
}

export async function logout() {
  const token = await getSession()
  if (token) {
    try {
      await post('/admin/auth/logout', {}, { headers: { Authorization: `Bearer ${token}` } })
    } catch (err) {
      logger.warn('Logout backend falló, limpiando sesión local', err)
    }
  }
  await deleteSession()
  redirect('/login')
}

export async function revokeSession(reason?: string) {
  await deleteSession()
  redirect(reason ? `/login?reason=${encodeURIComponent(reason)}` : '/login')
}
