import type mapboxgl from 'mapbox-gl'
import type { IncidentType, RouteOptionLabel } from '@/app/(landing)/feed/_types/types'

export const STYLE_MAP = 'mapbox://styles/mapbox/streets-v12'
export const MIN_ZOOM = 10
export const DEFAULT_ZOOM = 13

export const ICA_BOUNDS: mapboxgl.LngLatBoundsLike = [
  [-75.9, -14.22],
  [-75.55, -13.92],
]

export const TYPE_LABEL: Record<IncidentType, string> = {
  robo: 'Robo',
  accidente: 'Accidente',
  vandalismo: 'Vandalismo',
}

export const TYPE_COLOR: Record<IncidentType, string> = {
  robo: '#E04B5E',
  accidente: '#D9A55E',
  vandalismo: '#9CA3B0',
}

export const DANGER_THRESHOLD = 0.2
export const INCIDENT_PROXIMITY_METERS = 120
export const MAX_ROUTE_OPTIONS = 3

export const LABEL_TEXT: Record<RouteOptionLabel, string> = {
  safest: 'Más segura',
  middle: 'Alternativa',
  shortest: 'Ruta corta',
}

export const LABEL_COLOR: Record<RouteOptionLabel, string> = {
  safest: '#6BAE7A',
  middle: '#D9A55E',
  shortest: '#E04B5E',
}

export const ORIGIN_COLOR = '#6BAE7A'
export const DESTINATION_COLOR = '#5BA3D9'
