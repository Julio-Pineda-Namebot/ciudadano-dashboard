'use server'

import { get, post, patch, del } from '@/lib/backendService'
import { getSession } from '@/lib/session'
import type { Admin, CreateAdminFormData, UpdateAdminFormData } from '@/app/(menu)/security/web-staff/_types/types'

async function authHeaders() {
  const token = await getSession()
  return { Authorization: `Bearer ${token}` }
}

/**
 * Retrieve the list of admin users.
 *
 * @returns An array of `Admin` objects representing all admins
 */
export async function getAdmins(): Promise<Admin[]> {
  const res = await get<{ data: Admin[] }>('/admin/admins', { headers: await authHeaders() })
  return res.data
}

/**
 * Fetches the admin with the given identifier.
 *
 * @param id - The admin identifier
 * @returns The requested Admin object
 */
export async function getAdmin(id: string): Promise<Admin> {
  const res = await get<{ data: Admin }>(`/admin/admins/${encodeURIComponent(id)}`, { headers: await authHeaders() })
  return res.data
}

/**
 * Create a new admin account.
 *
 * @param data - Data for the admin to create
 * @returns The created `Admin` object
 */
export async function createAdmin(data: CreateAdminFormData): Promise<Admin> {
  const res = await post<{ data: Admin }>('/admin/admins', data, { headers: await authHeaders() })
  return res.data
}

/**
 * Update an existing admin's data identified by `id`.
 *
 * @param id - The ID of the admin to update
 * @param data - The fields to update for the admin
 * @returns The updated `Admin` object
 */
export async function updateAdmin(id: string, data: UpdateAdminFormData): Promise<Admin> {
  const res = await patch<{ data: Admin }>(`/admin/admins/${encodeURIComponent(id)}`, data, { headers: await authHeaders() })
  return res.data
}

/**
 * Delete the admin with the given identifier.
 *
 * @param id - The admin's identifier. This value will be URL-encoded when used in the request path.
 */
export async function deleteAdmin(id: string): Promise<void> {
  await del(`/admin/admins/${encodeURIComponent(id)}`, { headers: await authHeaders() })
}
