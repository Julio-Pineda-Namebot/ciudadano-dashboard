'use server'

import { getAdminNotifications } from '@/app/(menu)/_components/notificationsActions'
import type { PanicAlert } from '@/app/(menu)/alerts/_types/types'

const PANIC_ALERT_TYPE = 'admin_alert'

// Las alertas de pánico se persisten como notificaciones de admin con
// ubicación. Reutilizamos el listado de notificaciones y filtramos las que
// son alertas con coordenadas válidas.
export async function getPanicAlerts(): Promise<PanicAlert[]> {
  const notifications = await getAdminNotifications()
  return notifications
    .filter(
      (n) =>
        n.type === PANIC_ALERT_TYPE &&
        n.latitude != null &&
        n.longitude != null
    )
    .map((n) => ({
      id: n.id,
      title: n.title,
      body: n.body,
      latitude: n.latitude as number,
      longitude: n.longitude as number,
      createdAt: n.createdAt,
    }))
}
