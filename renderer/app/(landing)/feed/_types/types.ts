import type { CitizenProfile } from '@/app/auth-citizen-types'
import type { IncidentStatus, IncidentVote, VerifiedBy } from '@/lib/incidentStatus'

export type IncidentType = 'robo' | 'accidente' | 'vandalismo'

export interface NearbyIncident {
  id: string
  incidentType: IncidentType
  description: string
  geolocation: {
    latitude: number
    longitude: number
  }
  multimediaUrl?: string
  createdAt: string
  status?: IncidentStatus
  verifiedBy?: VerifiedBy | null
  confirmCount?: number
  disputeCount?: number
}

export interface IncidentComment {
  id: string
  authorName: string
  content: string
  createdAt: string
}

export interface FeedNotification {
  id: string
  type: string
  title: string
  body: string | null
  incidentId: string | null
  read: boolean
  createdAt: string
}

export interface IncidentDetail extends NearbyIncident {
  status: IncidentStatus
  verifiedBy: VerifiedBy | null
  confirmCount: number
  disputeCount: number
  myVote: IncidentVote | null
  comments: IncidentComment[]
}

export type ReportIncidentState =
  | { ok: true; message: string }
  | { error: string }
  | null

export interface CitizenFeedPanelProps {
  initialIncidents: NearbyIncident[]
  defaultCenter: { lat: number; lon: number }
  profile: CitizenProfile
}

export type FeedMode = 'view' | 'report' | 'route'

export interface RoutePoint {
  lat: number
  lon: number
}

export interface RouteResult {
  coordinates: [number, number][]
  dangerScore: number
  isSafe: boolean
  distanceMeters: number
  durationSeconds: number
}

export type RouteOptionLabel = 'safest' | 'middle' | 'shortest'

export interface RouteOption extends RouteResult {
  id: string
  label: RouteOptionLabel
  color: string
}

export interface RoutePlan {
  options: RouteOption[]
  selectedId: string
}
