export interface PanicAlert {
  id: string
  title: string
  body: string | null
  latitude: number
  longitude: number
  createdAt: string
}

export interface AlertsPanelProps {
  initialAlerts: PanicAlert[]
}
