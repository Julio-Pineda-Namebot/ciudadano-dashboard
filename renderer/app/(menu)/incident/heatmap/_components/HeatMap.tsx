"use client"

import { useEffect, useRef, useState } from "react"
import { LocateFixed, Maximize2, Minimize2, Map, Satellite } from "lucide-react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { io, type Socket } from "socket.io-client"
import { getWsToken } from "@/app/(menu)/incident/heatmap/actions"
import { MapButton } from "@/components/common/map-button"
import type { LightPreset, IncidentPayload, HeatMapProps } from "@/app/(menu)/incident/heatmap/_types/types"

const DEFAULT_LNG = -75.7285
const DEFAULT_LAT = -14.0755
const DEFAULT_ZOOM = 13
const MIN_ZOOM = 11
const ICA_BOUNDS: mapboxgl.LngLatBoundsLike = [[-75.90, -14.22], [-75.55, -13.92]]
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''
const STYLE_STANDARD  = 'mapbox://styles/mapbox/standard'
const STYLE_SATELLITE = 'mapbox://styles/mapbox/standard-satellite'

const TYPE_STYLES: Record<string, { label: string; color: string }> = {
  robo:       { label: 'Robo',       color: 'bg-red-100 text-red-700 border-red-200' },
  accidente:  { label: 'Accidente',  color: 'bg-orange-100 text-orange-700 border-orange-200' },
  vandalismo: { label: 'Vandalismo', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  violencia:  { label: 'Violencia',  color: 'bg-purple-100 text-purple-700 border-purple-200' },
}

const LEGEND_STOPS = [
  { label: 'Crítica',  color: 'rgba(195,40,30,0.88)' },
  { label: 'Muy alta', color: 'rgba(240,120,40,0.84)' },
  { label: 'Alta',     color: 'rgba(240,210,70,0.75)' },
  { label: 'Moderada', color: 'rgba(60,180,140,0.65)' },
  { label: 'Baja',     color: 'rgba(100,180,220,0.50)' },
  { label: 'Muy baja', color: 'rgba(100,180,220,0.20)' },
]

function getLightPreset(): LightPreset {
  const h = new Date().getHours()
  if (h >= 5  && h < 7)  return 'dawn'
  if (h >= 7  && h < 16) return 'day'
  if (h >= 16 && h < 18) return 'dusk'
  return 'night'
}

function toGeoJSON(points: [number, number, number][]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: points.map(([lat, lng, intensity]) => ({
      type: 'Feature',
      properties: { intensity },
      geometry: { type: 'Point', coordinates: [lng, lat] },
    })),
  }
}

function addHeatmapLayer(map: mapboxgl.Map, data: GeoJSON.FeatureCollection) {
  if (!map.getSource('incidents')) {
    map.addSource('incidents', { type: 'geojson', data })
  } else {
    (map.getSource('incidents') as mapboxgl.GeoJSONSource).setData(data)
  }

  if (!map.getLayer('incidents-heat')) {
    map.addLayer({
      id: 'incidents-heat',
      type: 'heatmap',
      source: 'incidents',
      paint: {
        'heatmap-weight':     ['interpolate', ['linear'], ['get', 'intensity'], 0, 0, 1, 0.7],
        'heatmap-intensity':  ['interpolate', ['linear'], ['zoom'], 0, 1, 8, 2, 14, 3, 18, 4],
        'heatmap-color': [
          'interpolate', ['linear'], ['heatmap-density'],
          0,    'rgba(0,0,0,0)',
          0.05, 'rgba(100,180,220,0.20)',
          0.2,  'rgba(100,180,220,0.50)',
          0.4,  'rgba(60,180,140,0.65)',
          0.6,  'rgba(240,210,70,0.75)',
          0.8,  'rgba(240,120,40,0.84)',
          1,    'rgba(195,40,30,0.88)',
        ],
        'heatmap-radius':   ['interpolate', ['exponential', 2], ['zoom'], 0, 1, 8, 10, 12, 40, 16, 160, 20, 640],
        'heatmap-opacity':  0.85,
      },
      slot: 'top',
    })
  }

  map.setConfigProperty('basemap', 'lightPreset', getLightPreset())
}

function HeatmapLegend({ typeCounts }: { typeCounts: Record<string, number> }) {
  const gradientColors = LEGEND_STOPS.map(s => s.color).join(', ')
  const entries = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])

  return (
    <div className="absolute bottom-10 left-4 z-10 rounded-xl bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg overflow-hidden w-44">
      {/* Encabezado */}
      <div className="px-3 py-2 border-b border-gray-100">
        <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">
          Densidad
        </p>
      </div>

      {/* Gradiente + etiquetas */}
      <div className="px-3 py-2.5 flex gap-2.5 items-stretch">
        <div
          className="w-2.5 rounded-full shrink-0 self-stretch"
          style={{ background: `linear-gradient(to bottom, ${gradientColors})` }}
        />
        <div className="flex flex-col justify-between flex-1">
          {LEGEND_STOPS.map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
              <span className="text-[10px] font-medium text-gray-600 leading-none">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tipos */}
      {entries.length > 0 && (
        <>
          <div className="px-3 py-2 border-t border-gray-100">
            <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">
              Tipos
            </p>
          </div>
          <div className="px-3 pb-2.5 flex flex-col gap-1">
            {entries.map(([type, count]) => {
              const style = TYPE_STYLES[type] ?? { label: type, color: 'bg-gray-100 text-gray-700 border-gray-200' }
              return (
                <span
                  key={type}
                  className={`inline-flex items-center justify-between rounded-full border px-2 py-0.5 text-[10px] font-medium ${style.color}`}
                >
                  {style.label}
                  <span className="font-normal opacity-60 ml-1">({count})</span>
                </span>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default function HeatMap({ initialPoints = [], typeCounts = {} }: HeatMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef          = useRef<mapboxgl.Map | null>(null)
  const pointsRef       = useRef<[number, number, number][]>(initialPoints)
  const socketRef       = useRef<Socket | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isSatellite,  setIsSatellite]  = useState(false)

  function flyToDefault() {
    mapRef.current?.flyTo({ center: [DEFAULT_LNG, DEFAULT_LAT], zoom: DEFAULT_ZOOM, essential: true })
  }

  function toggleFullscreen() {
    setIsFullscreen(prev => !prev)
    setTimeout(() => mapRef.current?.resize(), 50)
  }

  function toggleStyle() {
    const map = mapRef.current
    if (!map) return
    const next = !isSatellite
    setIsSatellite(next)
    map.setStyle(next ? STYLE_SATELLITE : STYLE_STANDARD)
    map.once('style.load', () => {
      addHeatmapLayer(map, toGeoJSON(pointsRef.current))
    })
  }

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ''

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: STYLE_STANDARD,
      center: [DEFAULT_LNG, DEFAULT_LAT],
      zoom: DEFAULT_ZOOM,
      minZoom: MIN_ZOOM,
      maxBounds: ICA_BOUNDS,
    })
    mapRef.current = map

    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.addControl(new mapboxgl.ScaleControl({ unit: 'metric' }), 'bottom-left')

    map.on('load', async () => {
      addHeatmapLayer(map, toGeoJSON(pointsRef.current))

      const lightInterval = setInterval(() => {
        map.setConfigProperty('basemap', 'lightPreset', getLightPreset())
      }, 60_000)
      map.once('remove', () => clearInterval(lightInterval))

      const token = await getWsToken()
      if (!token) return

      const socket = io(`${BACKEND_URL}/incidents`, {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
      })
      socketRef.current = socket

      socket.on('incident:reported', ({ incident }: IncidentPayload) => {
        const { latitude, longitude } = incident.geolocation
        pointsRef.current = [...pointsRef.current, [latitude, longitude, 1.0]]
        const source = map.getSource('incidents') as mapboxgl.GeoJSONSource
        source.setData(toGeoJSON(pointsRef.current))
      })
    })

    return () => {
      socketRef.current?.disconnect()
      socketRef.current = null
      map.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <div
      className={isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'relative w-full'}
      style={isFullscreen ? undefined : { height: 'calc(100vh - 200px)' }}
    >
      <div
        ref={mapContainerRef}
        className={isFullscreen ? 'h-full w-full' : 'h-full w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm'}
      />

      <MapButton
        onClick={toggleFullscreen}
        title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
        className="top-4 left-4"
      >
        {isFullscreen ? <Minimize2 className="h-4 w-4 text-gray-700" /> : <Maximize2 className="h-4 w-4 text-gray-700" />}
      </MapButton>

      <MapButton
        onClick={toggleStyle}
        title={isSatellite ? 'Ver mapa estándar' : 'Ver satélite'}
        className="top-4 left-14 gap-1.5 px-3 py-2"
      >
        {isSatellite ? <Map className="h-4 w-4 text-gray-700" /> : <Satellite className="h-4 w-4 text-gray-700" />}
        <span className="text-xs font-medium text-gray-700">
          {isSatellite ? 'Estándar' : 'Satélite'}
        </span>
      </MapButton>

      <HeatmapLegend typeCounts={typeCounts} />

      <MapButton
        onClick={flyToDefault}
        title="Volver a ubicación por defecto"
        className="bottom-4 right-4"
      >
        <LocateFixed className="h-4 w-4 text-blue-600" />
      </MapButton>
    </div>
  )
}
