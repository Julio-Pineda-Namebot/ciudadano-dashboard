import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { logger } from './logger'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: unknown
  ) {
    super(`HTTP ${status}`)
    this.name = 'ApiError'
  }
}

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => {
    logger.log(`${res.config.method?.toUpperCase()} ${res.config.url} → ${res.status}`, res.data)
    return res
  },
  (err: AxiosError) => {
    if (err.response) {
      const { status, data, config } = err.response
      const detail = process.env.NODE_ENV === 'production' ? undefined : data
      logger.error(`${config.method?.toUpperCase()} ${config.url} → ${status}`, detail)
      return Promise.reject(new ApiError(status, data))
    }
    logger.error(`Network error: ${err.message}`)
    return Promise.reject(err)
  }
)

export async function get<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await api.get<T>(path, config)
  return res.data
}

export async function post<T>(path: string, body: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await api.post<T>(path, body, config)
  return res.data
}

/**
 * POST multipart/form-data. Usa fetch nativo porque el axios instance fuerza
 * Content-Type: application/json por defecto, y al sobreescribirlo se pierde el
 * boundary que necesitan Multer/Busboy en el backend.
 */
export async function postMultipart<T>(
  path: string,
  body: FormData,
  config?: { headers?: Record<string, string> }
): Promise<T> {
  const url = `${BASE_URL}${path}`
  const res = await fetch(url, {
    method: 'POST',
    body,
    headers: config?.headers,
  })

  let payload: unknown = null
  try {
    payload = await res.json()
  } catch {
    payload = null
  }

  logger.log(`POST ${path} → ${res.status}`, payload)

  if (!res.ok) {
    logger.error(`POST ${path} → ${res.status}`, payload)
    throw new ApiError(res.status, payload)
  }

  return payload as T
}

export async function patch<T>(path: string, body: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await api.patch<T>(path, body, config)
  return res.data
}

export async function del<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await api.delete<T>(path, config)
  return res.data
}

/**
 * Descarga un archivo como ArrayBuffer (binario).
 * Útil para PDF, imágenes, ZIPs, etc.
 */
export async function getFile(
  path: string,
  config?: AxiosRequestConfig
): Promise<{ data: ArrayBuffer; contentType: string; filename: string }> {
  const res = await api.get<ArrayBuffer>(path, {
    ...config,
    responseType: 'arraybuffer',
  })

  const contentType = String(res.headers['content-type'] ?? 'application/octet-stream')
  const disposition = String(res.headers['content-disposition'] ?? '')
  const filenameMatch = disposition.match(/filename[^;=\n]*=(['"]?)([^'";\n]*)\1/)
  const filename = filenameMatch?.[2] ?? path.split('/').pop() ?? 'archivo'

  return { data: res.data, contentType, filename }
}
