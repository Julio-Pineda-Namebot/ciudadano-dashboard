export interface Citizen {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  dni: string
  isEmailVerified: boolean
  createdAt: string
}
