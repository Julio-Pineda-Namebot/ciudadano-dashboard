'use server'

import { get } from '@/lib/backendService'
import { getSession } from '@/lib/session'
import type { Citizen } from './_types/citizen'

async function authHeaders() {
  const token = await getSession()
  return { Authorization: `Bearer ${token}` }
}

export async function getCitizens(): Promise<Citizen[]> {
  const res = await get<{ data: Citizen[] }>('/admin/users', { headers: await authHeaders() })
  return res.data
}
