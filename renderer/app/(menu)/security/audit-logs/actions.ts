'use server'

import { get } from '@/lib/backendService'
import { getSession } from '@/lib/session'
import type { AuditLogsQuery, AuditLogsResponse } from '@/app/(menu)/security/audit-logs/_types/types'

async function authHeaders() {
  const token = await getSession()
  return { Authorization: `Bearer ${token}` }
}

export async function getAuditLogs(
  filters: AuditLogsQuery = {}
): Promise<AuditLogsResponse> {
  const params = new URLSearchParams()
  if (filters.action) params.set('action', filters.action)
  if (filters.dateFrom) params.set('dateFrom', filters.dateFrom)
  if (filters.dateTo) params.set('dateTo', filters.dateTo)
  if (filters.page) params.set('page', String(filters.page))
  if (filters.perPage) params.set('perPage', String(filters.perPage))

  const qs = params.toString()
  const path = `/admin/audit-logs${qs ? `?${qs}` : ''}`

  return get<AuditLogsResponse>(path, { headers: await authHeaders() })
}
