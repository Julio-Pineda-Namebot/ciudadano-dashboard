'use server'

import { get, post, patch, del } from '@/lib/backendService'
import { getSession } from '@/lib/session'
import type { News, NewsFormData } from './_types/news'

async function authHeaders() {
  const token = await getSession()
  return { Authorization: `Bearer ${token}` }
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
  const res = await post<{ data: News }>('/admin/news', data, { headers: await authHeaders() })
  return res.data
}

export async function updateNews(id: string, data: Partial<NewsFormData>): Promise<News> {
  const res = await patch<{ data: News }>(`/admin/news/${id}`, data, { headers: await authHeaders() })
  return res.data
}

export async function deleteNews(id: string): Promise<void> {
  await del(`/admin/news/${id}`, { headers: await authHeaders() })
}
