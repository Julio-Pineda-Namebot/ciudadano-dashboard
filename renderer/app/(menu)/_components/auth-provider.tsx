'use client'

import { createContext, useContext } from 'react'
import type { AdminProfile } from '@/app/auth-types'

const AuthContext = createContext<AdminProfile | null>(null)

export function AuthProvider({
  profile,
  children,
}: {
  profile: AdminProfile
  children: React.ReactNode
}) {
  return <AuthContext.Provider value={profile}>{children}</AuthContext.Provider>
}

export function useAuth(): AdminProfile {
  const profile = useContext(AuthContext)
  if (!profile) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return profile
}

export function useIsSuperAdmin(): boolean {
  return useAuth().group.name === 'SUPER_ADMIN'
}
