export interface AdminGroupRef {
  id: string
  name: string
}

export interface Admin {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
  group: AdminGroupRef
  createdAt: string
}

export interface CreateAdminFormData {
  username: string
  password: string
  firstName: string
  lastName: string
  email: string
  groupId: string
}

export interface UpdateAdminFormData {
  password?: string
  firstName?: string
  lastName?: string
  email?: string
  groupId?: string
}
