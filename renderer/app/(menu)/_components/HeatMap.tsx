"use client"

import { useEffect, useRef, useState } from "react"

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
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current) return
    if (mapInstanceRef.current) return

    const initMap = async () => {
      const L = (await import("leaflet")).default
      await import("leaflet/dist/leaflet.css")

      if (!mapRef.current) return

      if ((mapRef.current as any)._leaflet_id) {
        ;(mapRef.current as any)._leaflet_id = null
      }

      const map = L.map(mapRef.current, {
        center: [DEFAULT_LAT, DEFAULT_LNG],
        zoom: 13,
      })
      mapInstanceRef.current = map

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map)

      // Marcador fijo en Ica
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

      // Cargar leaflet.heat
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
        ;(L as any).heatLayer(HEAT_DATA, {
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
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
      if (mapRef.current) {
        ;(mapRef.current as any)._leaflet_id = null
      }
    }
  }, [])

  return (
    <div
      ref={mapRef}
      style={{ height: "calc(100vh - 200px)", width: "100%" }}
      className="rounded-xl overflow-hidden border border-gray-200 shadow-sm"
    />
  )
}