'use server'

import { get, del, ApiError } from '@/lib/backendService'
import { getSession } from '@/lib/session'
import { logger } from '@/lib/logger'
import type { News, NewsFormData } from '@/app/(menu)/news/_types/types'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''

async function authHeaders() {
  const token = await getSession()
  return { Authorization: `Bearer ${token}` }
}

function buildFormData(data: Partial<NewsFormData>): FormData {
  const fd = new FormData()
  if (data.title !== undefined) fd.append('title', data.title)
  if (data.summary !== undefined) fd.append('summary', data.summary)
  if (data.content !== undefined) fd.append('content', data.content)
  if (data.date !== undefined) fd.append('date', data.date)
  if (data.tag !== undefined) fd.append('tag', data.tag)
  if (data.image instanceof File) fd.append('image', data.image)
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
  const res = await get<{ data: News }>(`/admin/news/${id}`, { headers: await authHeaders() })
  return res.data
}

export async function createNews(data: NewsFormData): Promise<News> {
  const res = await sendMultipart<{ data: News }>('POST', '/admin/news', buildFormData(data))
  return res.data
}

export async function updateNews(id: string, data: Partial<NewsFormData>): Promise<News> {
  const res = await sendMultipart<{ data: News }>(
    'PATCH',
    `/admin/news/${id}`,
    buildFormData(data),
  )
  return res.data
}

export async function deleteNews(id: string): Promise<void> {
  await del(`/admin/news/${id}`, { headers: await authHeaders() })
}
