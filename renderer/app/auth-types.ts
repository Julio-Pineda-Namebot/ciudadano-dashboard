export interface ActiveSessionInfo {
  ip?: string
  deviceName?: string
  userAgent?: string
  createdAt?: string
}

export type LoginState =
  | { error: string }
  | { sessionActive: true; activeSession?: ActiveSessionInfo }
  | null

export interface AdminProfile {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
  group: { id: string; name: string }
  createdAt: string
}
