'use client'

import dynamic from 'next/dynamic'
import type { AlertsPanelProps } from '@/app/(menu)/alerts/_types/types'

// El panel monta mapbox-gl (necesita window), por eso se carga sin SSR.
const AlertsPanel = dynamic(
  () => import('@/app/(menu)/alerts/_components/AlertsPanel').then((m) => m.AlertsPanel),
  { ssr: false }
)

export function AlertsClient(props: AlertsPanelProps) {
  return <AlertsPanel {...props} />
}
