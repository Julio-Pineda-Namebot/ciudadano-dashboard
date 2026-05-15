'use server'

import { get, patch, del } from '@/lib/backendService'
import { getSession } from '@/lib/session'
import type { IncidentReport, IncidentReportUpdateData } from './_types/incident-report'

async function authHeaders() {
  const token = await getSession()
  return { Authorization: `Bearer ${token}` }
}

export async function getIncidentReports(): Promise<IncidentReport[]> {
  const res = await get<{ data: IncidentReport[] }>('/admin/incidents', { headers: await authHeaders() })
  return res.data
}

export async function updateIncidentReport(id: string, data: IncidentReportUpdateData): Promise<IncidentReport> {
  const res = await patch<{ data: IncidentReport }>(`/admin/incidents/${id}`, data, { headers: await authHeaders() })
  return res.data
}

export async function deleteIncidentReport(id: string): Promise<void> {
  await del(`/admin/incidents/${id}`, { headers: await authHeaders() })
}
