'use server'

import { get, post, patch, del } from '@/lib/backendService'
import { getSession } from '@/lib/session'
import type { Group, GroupFormData } from '@/app/(menu)/security/groups/_types/types'

async function authHeaders() {
  const token = await getSession()
  return { Authorization: `Bearer ${token}` }
}

export async function getGroups(): Promise<Group[]> {
  const res = await get<{ data: Group[] }>('/admin/groups', { headers: await authHeaders() })
  return res.data
}

export async function getGroup(id: string): Promise<Group> {
  const res = await get<{ data: Group }>(`/admin/groups/${encodeURIComponent(id)}`, { headers: await authHeaders() })
  return res.data
}

export async function createGroup(data: GroupFormData): Promise<Group> {
  const res = await post<{ data: Group }>('/admin/groups', data, { headers: await authHeaders() })
  return res.data
}

export async function updateGroup(id: string, data: Partial<GroupFormData>): Promise<Group> {
  const res = await patch<{ data: Group }>(`/admin/groups/${encodeURIComponent(id)}`, data, { headers: await authHeaders() })
  return res.data
}

export async function deleteGroup(id: string): Promise<void> {
  await del(`/admin/groups/${encodeURIComponent(id)}`, { headers: await authHeaders() })
}
