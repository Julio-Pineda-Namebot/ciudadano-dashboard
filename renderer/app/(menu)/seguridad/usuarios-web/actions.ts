'use server'

import { get, post, patch, del } from '@/lib/backendService'
import { getSession } from '@/lib/session'
import type { Admin, CreateAdminFormData, UpdateAdminFormData } from './_types/admin'

async function authHeaders() {
  const token = await getSession()
  return { Authorization: `Bearer ${token}` }
}

export async function getAdmins(): Promise<Admin[]> {
  const res = await get<{ data: Admin[] }>('/admin/admins', { headers: await authHeaders() })
  return res.data
}

export async function getAdmin(id: string): Promise<Admin> {
  const res = await get<{ data: Admin }>(`/admin/admins/${id}`, { headers: await authHeaders() })
  return res.data
}

export async function createAdmin(data: CreateAdminFormData): Promise<Admin> {
  const res = await post<{ data: Admin }>('/admin/admins', data, { headers: await authHeaders() })
  return res.data
}

export async function updateAdmin(id: string, data: UpdateAdminFormData): Promise<Admin> {
  const res = await patch<{ data: Admin }>(`/admin/admins/${id}`, data, { headers: await authHeaders() })
  return res.data
}

export async function deleteAdmin(id: string): Promise<void> {
  await del(`/admin/admins/${id}`, { headers: await authHeaders() })
}
