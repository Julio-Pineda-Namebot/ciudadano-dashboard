import { getSession } from '@/lib/session'
import { post, ApiError } from '@/lib/backendService'

interface WsTicketBody {
  data: { ticket: string; expiresInSec: number }
}

/**
 * Handle GET requests to obtain a WebSocket ticket for the current authenticated session.
 *
 * If there is no active session or the backend rejects authorization, responds with a 401 Unauthorized JSON.
 *
 * @returns A Response containing `{ token: string }` on success, or `{ error: 'Unauthorized' }` with status 401 when not authenticated.
 */
export async function GET() {
  const token = await getSession()
  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const res = await post<WsTicketBody>('/admin/auth/ws-ticket', {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return Response.json({ token: res.data.ticket })
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    throw err
  }
}
