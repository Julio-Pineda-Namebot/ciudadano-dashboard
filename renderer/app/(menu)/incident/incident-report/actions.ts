'use server'

import type { IncidentReport, IncidentReportFormData } from './_types/incident-report'

// ─── Mock data (activo) ───────────────────────────────────────────────────────

const INITIAL_DATA: IncidentReport[] = [
  {
    id: 'cmoarutz7000d28jvg048e3xu',
    userId: '1',
    incidentType: 'accidente',
    description: 'Congestión de vehículos por accidente en la Av. Principal',
    multimediaUrl: 'https://res.cloudinary.com/dlhzz4b0z/image/upload/v1776905835/sz0uope8qmzkvushnqms.jpg',
    multimediaKey: 'sz0uope8qmzkvushnqms',
    geolocation: { lat: -14.0678, lng: -75.7286 },
    createdAt: '2026-04-23T00:57:16.128Z',
  },
  {
    id: 'cmoarutz7000d28jvg048e3xy',
    userId: '2',
    incidentType: 'robo',
    description: 'Robo a mano armada frente al mercado central',
    multimediaUrl: 'https://portal.andina.pe/EDPfotografia3/Thumbnail/2023/04/14/000950034W.jpg',
    multimediaKey: '000950034W',
    geolocation: { lat: -14.0701, lng: -75.7310 },
    createdAt: '2026-04-22T18:30:00.000Z',
  },
  {
    id: 'cmoarutz7000d28jvg048e3xz',
    userId: '3',
    incidentType: 'incendio',
    description: 'Incendio en local comercial de la calle Libertad',
    multimediaUrl: 'https://portal.andina.pe/EDPfotografia3/Thumbnail/2018/03/28/000492507W.jpg',
    multimediaKey: '000492507W',
    geolocation: { lat: -14.0650, lng: -75.7250 },
    createdAt: '2026-04-22T10:15:00.000Z',
  },
  {
    id: 'cmoarutz7000d28jvg048e3x1',
    userId: '1',
    incidentType: 'vandalismo',
    description: 'Daños a mobiliario urbano en el parque central',
    multimediaUrl: '',
    multimediaKey: '',
    geolocation: { lat: -14.0690, lng: -75.7295 },
    createdAt: '2026-04-21T20:00:00.000Z',
  },
  {
    id: 'cmoarutz7000d28jvg048e3x2',
    userId: '4',
    incidentType: 'accidente',
    description: 'Choque entre mototaxi y camioneta en intersección',
    multimediaUrl: 'https://cloudfront-us-east-1.images.arcpublishing.com/infobae/IJM7ELSBL5GSRDF4PERZDVMRRI.jpg',
    multimediaKey: 'IJM7ELSBL5GSRDF4PERZDVMRRI',
    geolocation: { lat: -14.0720, lng: -75.7330 },
    createdAt: '2026-04-21T09:45:00.000Z',
  },
]

let mockStore: IncidentReport[] = [...INITIAL_DATA]

export async function getIncidentReports(): Promise<IncidentReport[]> {
  return [...mockStore]
}

export async function createIncidentReport(data: IncidentReportFormData): Promise<IncidentReport> {
  const report: IncidentReport = {
    id: crypto.randomUUID(),
    multimediaKey: '',
    createdAt: new Date().toISOString(),
    ...data,
  }
  mockStore = [...mockStore, report]
  return report
}

export async function updateIncidentReport(id: string, data: IncidentReportFormData): Promise<IncidentReport> {
  const existing = mockStore.find((r) => r.id === id)!
  const updated: IncidentReport = { ...existing, ...data }
  mockStore = mockStore.map((r) => (r.id === id ? updated : r))
  return updated
}

export async function deleteIncidentReport(id: string): Promise<void> {
  mockStore = mockStore.filter((r) => r.id !== id)
}

// ─── Backend (comentado — descomentar cuando el backend esté listo) ────────────

// import { get, post, put, del } from '@/lib/backendService'
// import { getSession } from '@/lib/session'
//
// async function authHeaders() {
//   const token = await getSession()
//   return { Authorization: `Bearer ${token}` }
// }
//
// export async function getIncidentReports(): Promise<IncidentReport[]> {
//   const res = await get<{ data: IncidentReport[] }>('/admin/incident-reports', { headers: await authHeaders() })
//   return res.data
// }
//
// export async function createIncidentReport(data: IncidentReportFormData): Promise<IncidentReport> {
//   const res = await post<{ data: IncidentReport }>('/admin/incident-reports', data, { headers: await authHeaders() })
//   return res.data
// }
//
// export async function updateIncidentReport(id: string, data: IncidentReportFormData): Promise<IncidentReport> {
//   const res = await put<{ data: IncidentReport }>(`/admin/incident-reports/${id}`, data, { headers: await authHeaders() })
//   return res.data
// }
//
// export async function deleteIncidentReport(id: string): Promise<void> {
//   await del(`/admin/incident-reports/${id}`, { headers: await authHeaders() })
// }
