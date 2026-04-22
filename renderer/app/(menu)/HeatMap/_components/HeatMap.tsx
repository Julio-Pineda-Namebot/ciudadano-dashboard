"use client"

import { useEffect, useRef } from "react"
import type { Map as LeafletMap } from "leaflet"
import type { LeafletHeatModule, LeafletElement } from "../_types/heatmap"

const DEFAULT_LAT = -14.0755
const DEFAULT_LNG = -75.7285

function generateCluster(
  centerLat: number,
  centerLng: number,
  count: number,
  spread: number
): [number, number, number][] {
  return Array.from({ length: count }, () => [
    centerLat + (Math.random() - 0.5) * spread,
    centerLng + (Math.random() - 0.5) * spread,
    Math.random() * 0.8 + 0.2,
  ])
}

const HEAT_DATA: [number, number, number][] = [
  ...generateCluster(-14.0755, -75.7285, 80, 0.02),
  ...generateCluster(-14.0600, -75.7200, 50, 0.015),
  ...generateCluster(-14.0900, -75.7350, 40, 0.018),
  ...generateCluster(-14.0700, -75.7100, 35, 0.012),
  ...generateCluster(-14.0800, -75.7450, 30, 0.014),
  ...generateCluster(-14.0650, -75.7300, 20, 0.008),
  ...generateCluster(-14.0820, -75.7180, 25, 0.010),
  ...generateCluster(-14.0700, -75.7400, 15, 0.006),
]

export default function HeatMap() {
  const mapRef         = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<LeafletMap | null>(null)

  useEffect(() => {
    if (!mapRef.current) return
    if (mapInstanceRef.current) return

    const container = mapRef.current as LeafletElement

    const initMap = async () => {
      const L = (await import("leaflet")).default
      await import("leaflet/dist/leaflet.css")

      if (container._leaflet_id) {
        container._leaflet_id = null
      }

      const map = L.map(container, {
        center: [DEFAULT_LAT, DEFAULT_LNG],
        zoom: 13,
        scrollWheelZoom: false,
        dragging: true,
      })
      mapInstanceRef.current = map

      map.dragging.enable()
      requestAnimationFrame(() => map.invalidateSize())

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map)

      const icon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      })

      L.marker([DEFAULT_LAT, DEFAULT_LNG], { icon })
        .addTo(map)
        .bindPopup("📍 Ica, Perú")
        .openPopup()

      await new Promise<void>((resolve) => {
        if (document.querySelector('script[src*="leaflet-heat"]')) {
          resolve()
          return
        }
        const script = document.createElement("script")
        script.src = "https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js"
        script.onload = () => resolve()
        document.head.appendChild(script)
      })

      setTimeout(() => {
        if (!mapInstanceRef.current) return
        ;(L as LeafletHeatModule).heatLayer(HEAT_DATA, {
          radius: 25,
          blur: 20,
          maxZoom: 17,
          max: 1.0,
          minOpacity: 0.3,
          gradient: {
            0.2: "#2563eb",
            0.4: "#22c55e",
            0.6: "#eab308",
            0.8: "#f97316",
            1.0: "#ef4444",
          },
        }).addTo(map)
      }, 300)

      const legend = new L.Control({ position: "topright" })
      legend.onAdd = () => {
        const div = L.DomUtil.create("div", "heatmap-legend")
        div.innerHTML = `
          <div class="text-sm font-semibold mb-2 text-gray-800">Densidad de incidencias</div>
          <div class="flex items-center gap-2">
            <div class="h-3 w-44 rounded-full" style="background: linear-gradient(to right, #2563eb, #22c55e, #eab308, #f97316, #ef4444);"></div>
          </div>
          <div class="flex justify-between mt-1.5 text-xs text-gray-600">
            <span>Bajo</span>
            <span>Alto</span>
          </div>
        `
        Object.assign(div.style, {
          background: "white",
          padding: "12px 14px",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          border: "1px solid #e5e7eb",
        })
        return div
      }
      legend.addTo(map)
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
      container._leaflet_id = null
    }
  }, [])

  return (
    <div
      ref={mapRef}
      style={{ height: "calc(100vh - 200px)", width: "100%", isolation: "isolate", zIndex: 0 }}
      className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm"
    />
  )
}