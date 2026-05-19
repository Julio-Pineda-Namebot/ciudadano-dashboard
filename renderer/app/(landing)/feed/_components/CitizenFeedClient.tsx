'use client'

import dynamic from 'next/dynamic'
import type { CitizenFeedPanelProps } from '@/app/(landing)/feed/_types/types'

const CitizenFeedPanel = dynamic(
  () =>
    import('@/app/(landing)/feed/_components/CitizenFeedPanel').then((m) => m.CitizenFeedPanel),
  { ssr: false }
)

export function CitizenFeedClient(props: CitizenFeedPanelProps) {
  return <CitizenFeedPanel {...props} />
}
