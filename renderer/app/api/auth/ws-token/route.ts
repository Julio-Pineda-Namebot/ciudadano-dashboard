import { getSession } from '@/lib/session'
import { post, ApiError } from '@/lib/backendService'

interface WsTicketBody {
  data: { ticket: string; expiresInSec: number }
}

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
