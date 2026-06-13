'use server'

import { get, post, del } from '@/lib/backendService'
import { getSession } from '@/lib/session'
import type { IncidentReport, IncidentReportUpdateData } from '@/app/(menu)/incident/incident-report/_types/types'

async function authHeaders() {
  const token = await getSession()
  return { Authorization: `Bearer ${token}` }
}

/**
 * Fetches incident reports from the admin API.
 *
 * @returns An array of incident reports (`IncidentReport[]`).
 */
export async function getIncidentReports(): Promise<IncidentReport[]> {
  const res = await get<{ data: IncidentReport[] }>('/admin/incidents', { headers: await authHeaders() })
  return res.data
}

/**
 * Update an incident report identified by `id` with the provided update data.
 *
 * @param id - The incident report identifier to update
 * @param data - Fields to update on the incident report
 * @returns The updated incident report
 */
export async function updateIncidentReport(id: string, data: IncidentReportUpdateData): Promise<IncidentReport> {
  const res = await post<{ data: IncidentReport }>(`/admin/incidents/${encodeURIComponent(id)}`, data, { headers: await authHeaders() })
  return res.data
}

/**
 * Deletes the incident report identified by `id`.
 *
 * @param id - The incident report identifier to delete
 */
export async function deleteIncidentReport(id: string): Promise<void> {
  await del(`/admin/incidents/${encodeURIComponent(id)}`, { headers: await authHeaders() })
}
