import { getSession } from '@/lib/session'

// El gateway de geolocalización (namespace por defecto) autentica el socket con
// el JWT del ciudadano directamente (no usa tickets como el panel admin). Este
// endpoint expone el token de sesión al cliente para abrir el WebSocket.
export async function GET() {
  const token = await getSession()
  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return Response.json({ token })
}
