"use client"

import { useEffect, useRef } from "react"
import { io, type Socket } from "socket.io-client"
import type { Map as LeafletMap } from "leaflet"
import type { HeatLayer, LeafletHeatModule, LeafletElement } from "../_types/heatmap"

const DEFAULT_LAT = -14.0755
const DEFAULT_LNG = -75.7285
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''

interface IncidentPayload {
  incident: {
    geolocation: { latitude: number; longitude: number }
  }
}

async function fetchToken(): Promise<string | null> {
  try {
    const res = await fetch('/api/auth/ws-token', { cache: 'no-store' })
    if (!res.ok) return null
    const body = (await res.json()) as { token?: string }
    return body.token ?? null
  } catch {
    return null
  }
}

interface Props {
  initialPoints?: [number, number, number][]
}

export default function HeatMap({ initialPoints = [] }: Props) {
  const mapRef         = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<LeafletMap | null>(null)
  const heatLayerRef   = useRef<HeatLayer | null>(null)
  const socketRef      = useRef<Socket | null>(null)

  useEffect(() => {
    if (!mapRef.current) return
    if (mapInstanceRef.current) return

    const container = mapRef.current as LeafletElement

    const initMap = async () => {
      const L = (await import("leaflet")).default
      await import("leaflet/dist/leaflet.css")
      // leaflet-heat es un script global que hace window.L.heatLayer = fn
      // sin esto, L.heatLayer queda undefined
      ;(window as unknown as { L: typeof L }).L = L

      if (container._leaflet_id) container._leaflet_id = null

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

      // Marcar ubicación del usuario sin mover la vista del mapa
      // (setView:false para no alejar de la zona de incidentes)
      map.on("locationfound", (e) => {
        L.marker(e.latlng, { icon })
          .addTo(map)
          .bindPopup("📍 Tu ubicación actual")
        L.circle(e.latlng, { radius: e.accuracy, color: "#3b82f6", fillOpacity: 0.1 }).addTo(map)
      })

      map.locate({ setView: false, timeout: 10000 })

      // En Electron, `exports`/`module`/`require` son globales reales de Node.js,
      // no propiedades de window. leaflet-heat detecta eso y usa require('leaflet')
      // en vez de window.L, apuntando a una instancia distinta de leaflet.
      // Solución: fetch + new Function crea un scope propio donde pasamos
      // exports/module/require como undefined, forzando la rama window.L.
      if (!('heatLayer' in L)) {
        const code = await fetch('https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js').then(r => r.text())
        // eslint-disable-next-line no-new-func
        new Function('exports', 'module', 'require', 'define', code)(undefined, undefined, undefined, undefined)
      }

      console.log('[heatmap] heatLayer disponible:', 'heatLayer' in L)
      console.log('[heatmap] initialPoints:', initialPoints.length, initialPoints[0])

      heatLayerRef.current = (L as LeafletHeatModule).heatLayer(initialPoints, {
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

      const token = await fetchToken()
      if (!token) {
        console.warn("[heatmap] no token — socket no conectado")
        return
      }

      const socket = io(`${BACKEND_URL}/incidents`, {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
      })
      socketRef.current = socket

      socket.on("connect", () => console.log("[heatmap] socket conectado"))
      socket.on("disconnect", (r) => console.log("[heatmap] socket desconectado", r))
      socket.on("connect_error", (e) => console.error("[heatmap] connect_error", e.message))

      socket.on("incident:reported", ({ incident }: IncidentPayload) => {
        console.log("[heatmap] incident recibido", incident)
        const { latitude, longitude } = incident.geolocation
        heatLayerRef.current?.addLatLng([latitude, longitude, 1.0])
      })

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
      socketRef.current?.disconnect()
      socketRef.current = null
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
