import type { Layer } from "leaflet"

export type LightPreset = 'dawn' | 'day' | 'dusk' | 'night'

export interface IncidentPayload {
  incident: {
    geolocation: { latitude: number; longitude: number }
  }
}

export interface HeatMapProps {
  initialPoints?: [number, number, number][]
  typeCounts?: Record<string, number>
}

export interface HeatMapClientProps {
  initialPoints: [number, number, number][]
  typeCounts: Record<string, number>
}

export interface HeatLayer extends Layer {
  addLatLng(latlng: [number, number] | [number, number, number]): this
  setLatLngs(latlngs: [number, number, number][]): this
  redraw(): this
}

export type LeafletHeatModule = typeof import("leaflet") & {
  heatLayer: (
    latlngs: [number, number, number][],
    options?: {
      radius?: number
      blur?: number
      maxZoom?: number
      max?: number
      minOpacity?: number
      gradient?: Record<number, string>
    }
  ) => HeatLayer
}

export type LeafletElement = HTMLDivElement & { _leaflet_id?: number | null }
