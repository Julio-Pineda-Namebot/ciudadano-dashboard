'use server'

import { get, post, patch, del } from '@/lib/backendService'
import { getSession } from '@/lib/session'
import type { Group, GroupFormData } from '@/app/(menu)/security/groups/_types/types'

async function authHeaders() {
  const token = await getSession()
  return { Authorization: `Bearer ${token}` }
}

/**
 * Fetches the list of groups from the admin API.
 *
 * @returns The array of `Group` objects returned by the server.
 */
export async function getGroups(): Promise<Group[]> {
  const res = await get<{ data: Group[] }>('/admin/groups', { headers: await authHeaders() })
  return res.data
}

/**
 * Fetches a group by its identifier.
 *
 * @param id - The group's identifier
 * @returns The requested `Group`
 */
export async function getGroup(id: string): Promise<Group> {
  const res = await get<{ data: Group }>(`/admin/groups/${encodeURIComponent(id)}`, { headers: await authHeaders() })
  return res.data
}

/**
 * Creates a new administrative group.
 *
 * @param data - Attributes for the new group
 * @returns The created `Group` object
 */
export async function createGroup(data: GroupFormData): Promise<Group> {
  const res = await post<{ data: Group }>('/admin/groups', data, { headers: await authHeaders() })
  return res.data
}

/**
 * Update an existing group with the provided fields.
 *
 * @param id - The identifier of the group to update
 * @param data - Partial group form data containing fields to change
 * @returns The updated `Group`
 */
export async function updateGroup(id: string, data: Partial<GroupFormData>): Promise<Group> {
  const res = await patch<{ data: Group }>(`/admin/groups/${encodeURIComponent(id)}`, data, { headers: await authHeaders() })
  return res.data
}

/**
 * Deletes a group with the specified id.
 *
 * @param id - The group identifier to delete; it will be URL-encoded when sent in the request path
 */
export async function deleteGroup(id: string): Promise<void> {
  await del(`/admin/groups/${encodeURIComponent(id)}`, { headers: await authHeaders() })
}
