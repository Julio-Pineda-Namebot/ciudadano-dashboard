'use server'

import { get, del, ApiError } from '@/lib/backendService'
import { getSession } from '@/lib/session'
import { logger } from '@/lib/logger'
import type { News, NewsFormData } from '@/app/(menu)/news/_types/types'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''

/**
 * Builds an HTTP `Authorization` header using the current session's bearer token.
 *
 * @returns An object with an `Authorization` header set to `Bearer <token>`
 */
async function authHeaders() {
  const token = await getSession()
  return { Authorization: `Bearer ${token}` }
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // 5 MB

/**
 * Validate that a File is an allowed image type and does not exceed the maximum size.
 *
 * @param file - The file to validate; must be an image with MIME type `image/jpeg`, `image/png`, or `image/webp` and no larger than 5 MB.
 * @throws Error - If the file MIME type is not allowed: "Formato de imagen no permitido. Usa JPG, PNG o WebP."
 * @throws Error - If the file size exceeds 5 MB: "La imagen supera el tamaño máximo de 5 MB."
 */
function assertValidImage(file: File): void {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    throw new Error('Formato de imagen no permitido. Usa JPG, PNG o WebP.')
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('La imagen supera el tamaño máximo de 5 MB.')
  }
}

/**
 * Converts provided news form values into a multipart FormData suitable for upload.
 *
 * @param data - Partial news form values; provided fields are added to the resulting FormData. If `data.image` is a `File`, it is validated and included as the `image` part.
 * @returns A FormData instance containing the supplied fields (`title`, `summary`, `content`, `date`, `tag`, and `image` when present).
 * @throws Error if `data.image` is a `File` but its MIME type is not one of image/jpeg, image/png, image/webp or its size exceeds 5 MB.
 */
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

/**
 * Fetches the list of news items from the admin API.
 *
 * @returns An array of `News` objects.
 */
export async function getNews(): Promise<News[]> {
  const res = await get<{ data: News[] }>('/admin/news', { headers: await authHeaders() })
  return res.data
}

/**
 * Fetches a single news item by its identifier.
 *
 * @param id - The unique identifier of the news item
 * @returns The requested `News` object
 */
export async function getNewsById(id: string): Promise<News> {
  const res = await get<{ data: News }>(`/admin/news/${encodeURIComponent(id)}`, { headers: await authHeaders() })
  return res.data
}

export async function createNews(data: NewsFormData): Promise<News> {
  const res = await sendMultipart<{ data: News }>('POST', '/admin/news', buildFormData(data))
  return res.data
}

/**
 * Update an existing news item by sending multipart form data to the backend.
 *
 * @param id - The identifier of the news item to update
 * @param data - Partial news form fields to update; if `data.image` is a `File` it will be validated for allowed MIME types and maximum size before upload
 * @returns The updated `News` object
 */
export async function updateNews(id: string, data: Partial<NewsFormData>): Promise<News> {
  const res = await sendMultipart<{ data: News }>(
    'PATCH',
    `/admin/news/${encodeURIComponent(id)}`,
    buildFormData(data),
  )
  return res.data
}

/**
 * Deletes a news item by its identifier.
 *
 * @param id - The identifier of the news item to delete
 */
export async function deleteNews(id: string): Promise<void> {
  await del(`/admin/news/${encodeURIComponent(id)}`, { headers: await authHeaders() })
}
