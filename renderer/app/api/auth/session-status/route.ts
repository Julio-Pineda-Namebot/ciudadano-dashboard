import { getSession } from '@/lib/session'
import { get, ApiError } from '@/lib/backendService'

interface StatusBody {
  data: { active: boolean; reason?: string }
}

export async function GET() {
  const token = await getSession()
  try {
    const res = await get<StatusBody>('/admin/auth/session/status', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    return Response.json(res.data)
  } catch (err) {
    if (err instanceof ApiError) {
      return Response.json({ active: false, reason: 'INVALID' }, { status: 200 })
    }
    return Response.json({ active: false, reason: 'NO_TOKEN' }, { status: 200 })
  }
}
