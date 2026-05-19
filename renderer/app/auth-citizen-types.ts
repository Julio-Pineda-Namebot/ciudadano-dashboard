export type CitizenLoginState = { error: string } | null

export interface CitizenProfile {
  id: string
  firstName: string
  lastName: string
  dni: string
  email: string
  isEmailVerified: boolean
  phone: string
}
