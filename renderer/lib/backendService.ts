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
      logger.error(`${config.method?.toUpperCase()} ${config.url} → ${status}`, data)
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
