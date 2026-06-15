'use server'

import { get, post, del } from '@/lib/backendService'
import { getSession } from '@/lib/session'
import { logger } from '@/lib/logger'
import type { AdminNotification } from '@/app/(menu)/_components/notificationsTypes'

async function authHeaders() {
  const token = await getSession()
  return { Authorization: `Bearer ${token}` }
}

export async function getAdminNotifications(): Promise<AdminNotification[]> {
  try {
    const res = await get<{ data: AdminNotification[] }>('/admin/notifications', {
      headers: await authHeaders(),
    })
    return res.data
  } catch (err) {
    logger.error('getAdminNotifications falló', err)
    return []
  }
}

export async function markAdminNotificationsRead(): Promise<void> {
  try {
    await post('/admin/notifications/read-all', {}, { headers: await authHeaders() })
  } catch (err) {
    logger.error('markAdminNotificationsRead falló', err)
  }
}

export async function deleteAdminNotification(id: string): Promise<void> {
  try {
    await del(`/admin/notifications/${encodeURIComponent(id)}`, {
      headers: await authHeaders(),
    })
  } catch (err) {
    logger.error('deleteAdminNotification falló', err)
  }
}
