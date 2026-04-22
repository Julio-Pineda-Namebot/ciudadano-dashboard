import type { Layer } from "leaflet"

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
  ) => Layer
}

export type LeafletElement = HTMLDivElement & { _leaflet_id?: number | null }
