export interface AdminNotification {
  id: string
  type: string
  title: string
  body: string | null
  incidentId: string | null
  read: boolean
  createdAt: string
}

// Evento de ventana que dispara el SocketProvider para que la campanita
// del header refresque su lista desde el servidor.
export const ADMIN_NOTIFICATIONS_EVENT = 'app:notifications-changed'

// Evento de ventana para que la grilla de reportes de incidencias refresque
// en tiempo real (nuevas incidencias, cambios de estado, validacion).
export const INCIDENTS_CHANGED_EVENT = 'app:incidents-changed'
