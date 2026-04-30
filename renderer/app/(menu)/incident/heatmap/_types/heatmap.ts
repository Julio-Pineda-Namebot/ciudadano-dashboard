import type { Layer } from "leaflet"

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
