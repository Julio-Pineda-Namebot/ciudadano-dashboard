import { z } from 'zod'

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

export const citizenFilterSchema = z.object({
  range: z.object({ from: z.string(), to: z.string() }),
})

export type CitizenFilterValues = z.infer<typeof citizenFilterSchema>

export interface CitizensPanelProps {
  citizens: Citizen[]
}

export interface CitizensTableProps {
  citizens: Citizen[]
}
