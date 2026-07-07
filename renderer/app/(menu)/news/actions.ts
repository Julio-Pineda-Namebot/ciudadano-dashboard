'use server'

import { get, post, del, ApiError } from '@/lib/backendService'
import { getSession } from '@/lib/session'
import { logger } from '@/lib/logger'
import type { News, NewsFormData, IngestNewsResult } from '@/app/(menu)/news/_types/types'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''

async function authHeaders() {
  const token = await getSession()
  return { Authorization: `Bearer ${token}` }
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // 5 MB

function assertValidImage(file: File): void {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    throw new Error('Formato de imagen no permitido. Usa JPG, PNG o WebP.')
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('La imagen supera el tamaño máximo de 5 MB.')
  }
}

function buildFormData(data: Partial<NewsFormData>): FormData {
  const fd = new FormData()
  if (data.title !== undefined) fd.append('title', data.title)
  if (data.summary !== undefined) fd.append('summary', data.summary)
  if (data.content !== undefined) fd.append('content', data.content)
  if (data.date !== undefined) fd.append('date', data.date)
  if (data.tag !== undefined) fd.append('tag', data.tag)
  if (data.image instanceof File) {
    assertValidImage(data.image)
    fd.append('image', data.image)
  }
  return fd
}

async function sendMultipart<T>(
  method: 'POST' | 'PATCH',
  path: string,
  formData: FormData,
): Promise<T> {
  const headers = await authHeaders()
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    body: formData,
    headers,
  })
  const text = await res.text()
  const body = text ? JSON.parse(text) : null
  logger.log(`${method} ${path} → ${res.status}`, body)
  if (!res.ok) {
    throw new ApiError(res.status, body)
  }
  return body as T
}

export async function getNews(): Promise<News[]> {
  const res = await get<{ data: News[] }>('/admin/news', { headers: await authHeaders() })
  return res.data
}

export async function getNewsById(id: string): Promise<News> {
  const res = await get<{ data: News }>(`/admin/news/${encodeURIComponent(id)}`, { headers: await authHeaders() })
  return res.data
}

export async function createNews(data: NewsFormData): Promise<News> {
  const res = await sendMultipart<{ data: News }>('POST', '/admin/news', buildFormData(data))
  return res.data
}

export async function updateNews(id: string, data: Partial<NewsFormData>): Promise<News> {
  const res = await sendMultipart<{ data: News }>(
    'PATCH',
    `/admin/news/${encodeURIComponent(id)}`,
    buildFormData(data),
  )
  return res.data
}

export async function deleteNews(id: string): Promise<void> {
  await del(`/admin/news/${encodeURIComponent(id)}`, { headers: await authHeaders() })
}

export async function ingestNews(): Promise<IngestNewsResult> {
  const res = await post<{ data: IngestNewsResult }>('/admin/news/ingest', {}, { headers: await authHeaders() })
  return res.data
}
