export interface Group {
  id: string
  name: string
  description: string | null
  adminCount: number
  createdAt: string
  updatedAt: string
}

export interface GroupFormData {
  name: string
  description?: string
}
