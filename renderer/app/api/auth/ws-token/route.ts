import { getSession } from '@/lib/session'

export async function GET() {
  const token = await getSession()
  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return Response.json({ token })
}
