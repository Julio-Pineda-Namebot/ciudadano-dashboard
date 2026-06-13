'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import type {
  FeedMode,
  NearbyIncident,
  RoutePlan,
  RoutePoint,
} from '@/app/(landing)/feed/_types/types'
import {
  DEFAULT_ZOOM,
  DESTINATION_COLOR,
  ICA_BOUNDS,
  MIN_ZOOM,
  ORIGIN_COLOR,
  STYLE_MAP,
  TYPE_COLOR,
  TYPE_LABEL,
} from '@/app/(landing)/feed/constants'
import { escapeHtml, haversineMeters } from '@/app/(landing)/feed/geoUtils'

export interface CitizenFeedMapHandle {
  getCenter: () => { lat: number; lon: number } | null
  flyTo: (lat: number, lon: number, zoom?: number) => void
}

interface CitizenFeedMapProps {
  defaultCenter: { lat: number; lon: number }
  incidents: NearbyIncident[]
  mode: FeedMode
  selected: RoutePoint | null
  origin: RoutePoint | null
  destination: RoutePoint | null
  route: RoutePlan | null
  onSelectPoint: (p: RoutePoint) => void
  onSetOrigin: (p: RoutePoint) => void
  onSetDestination: (p: RoutePoint) => void
  userLocation: RoutePoint | null
}

export const CitizenFeedMap = forwardRef<CitizenFeedMapHandle, CitizenFeedMapProps>(
  function CitizenFeedMap(
    {
      defaultCenter,
      incidents,
      mode,
      selected,
      origin,
      destination,
      route,
      onSelectPoint,
      onSetOrigin,
      onSetDestination,
      userLocation,
    },
    ref
  ) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null)
    const mapRef = useRef<mapboxgl.Map | null>(null)
    const draftMarkerRef = useRef<mapboxgl.Marker | null>(null)
    const incidentMarkersRef = useRef<mapboxgl.Marker[]>([])
    const originMarkerRef = useRef<mapboxgl.Marker | null>(null)
    const destinationMarkerRef = useRef<mapboxgl.Marker | null>(null)
    const userLocationMarkerRef = useRef<mapboxgl.Marker | null>(null)
    const drawnRouteLayersRef = useRef<Set<string>>(new Set())

    const modeRef = useRef(mode)
    const originRef = useRef(origin)
    const destinationRef = useRef(destination)
    const onSelectPointRef = useRef(onSelectPoint)
    const onSetOriginRef = useRef(onSetOrigin)
    const onSetDestinationRef = useRef(onSetDestination)

    useEffect(() => { modeRef.current = mode }, [mode])
    useEffect(() => { originRef.current = origin }, [origin])
    useEffect(() => { destinationRef.current = destination }, [destination])
    useEffect(() => { onSelectPointRef.current = onSelectPoint }, [onSelectPoint])
    useEffect(() => { onSetOriginRef.current = onSetOrigin }, [onSetOrigin])
    useEffect(() => { onSetDestinationRef.current = onSetDestination }, [onSetDestination])

    useImperativeHandle(ref, () => ({
      getCenter: () => {
        const c = mapRef.current?.getCenter()
        return c ? { lat: c.lat, lon: c.lng } : null
      },
      flyTo: (lat, lon, zoom = 15) => {
        mapRef.current?.flyTo({ center: [lon, lat], zoom, essential: true })
      },
    }))

    useEffect(() => {
      if (!mapContainerRef.current || mapRef.current) return

      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ''

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: STYLE_MAP,
        center: [defaultCenter.lon, defaultCenter.lat],
        zoom: DEFAULT_ZOOM,
        minZoom: MIN_ZOOM,
        maxBounds: ICA_BOUNDS,
      })
      mapRef.current = map

      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')
      map.addControl(new mapboxgl.ScaleControl({ unit: 'metric' }), 'bottom-left')

      // Mapbox can mount with a 0×0 container if the parent flex hasn't settled —
      // observe size changes and force resize until it has dimensions.
      map.once('load', () => map.resize())
      const ro = new ResizeObserver(() => map.resize())
      ro.observe(mapContainerRef.current)

      map.on('click', (e) => {
        const { lng, lat } = e.lngLat
        if (modeRef.current === 'report') {
          onSelectPointRef.current({ lat, lon: lng })
          return
        }
        if (modeRef.current === 'route') {
          const o = originRef.current
          const d = destinationRef.current
          if (!o) {
            onSetOriginRef.current({ lat, lon: lng })
          } else if (!d) {
            onSetDestinationRef.current({ lat, lon: lng })
          } else {
            // Replace the closest of the two so the user can refine either point.
            const distToO = haversineMeters(lat, lng, o.lat, o.lon)
            const distToD = haversineMeters(lat, lng, d.lat, d.lon)
            if (distToO <= distToD) onSetOriginRef.current({ lat, lon: lng })
            else onSetDestinationRef.current({ lat, lon: lng })
          }
        }
      })

      return () => {
        ro.disconnect()
        incidentMarkersRef.current.forEach((m) => m.remove())
        incidentMarkersRef.current = []
        draftMarkerRef.current?.remove()
        draftMarkerRef.current = null
        originMarkerRef.current?.remove()
        originMarkerRef.current = null
        destinationMarkerRef.current?.remove()
        destinationMarkerRef.current = null
        userLocationMarkerRef.current?.remove()
        userLocationMarkerRef.current = null
        map.remove()
        mapRef.current = null
      }
    }, [defaultCenter.lat, defaultCenter.lon])

    // Render incident markers.
    useEffect(() => {
      const map = mapRef.current
      if (!map) return

      incidentMarkersRef.current.forEach((m) => m.remove())
      incidentMarkersRef.current = []

      for (const inc of incidents) {
        const el = document.createElement('div')
        const color = TYPE_COLOR[inc.incidentType] ?? '#FFFFFF'
        el.style.width = '14px'
        el.style.height = '14px'
        el.style.borderRadius = '999px'
        el.style.background = color
        el.style.border = '2px solid rgba(255,255,255,0.85)'
        el.style.boxShadow = `0 0 14px ${color}`

        const mediaHtml = inc.multimediaUrl
          ? `<div class="cp-media" style="background-image:url('${encodeURI(inc.multimediaUrl)}')"></div>`
          : ''

        const popup = new mapboxgl.Popup({
          offset: 16,
          closeButton: false,
          className: 'ciudadano-popup',
          maxWidth: '260px',
        }).setHTML(
          `${mediaHtml}<div class="cp-body">
            <div class="cp-type" style="color:${color}">
              <span class="cp-dot" style="background:${color};box-shadow:0 0 8px ${color}"></span>${TYPE_LABEL[inc.incidentType]}
            </div>
            <div class="cp-desc">${escapeHtml(inc.description)}</div>
            <div class="cp-date">${escapeHtml(new Date(inc.createdAt).toLocaleString('es-PE'))}</div>
          </div>`
        )

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([inc.geolocation.longitude, inc.geolocation.latitude])
          .setPopup(popup)
          .addTo(map)

        incidentMarkersRef.current.push(marker)
      }
    }, [incidents])

    // Render draft marker for the user's selected point.
    useEffect(() => {
      const map = mapRef.current
      if (!map) return

      draftMarkerRef.current?.remove()
      draftMarkerRef.current = null

      if (!selected) return

      const el = document.createElement('div')
      el.style.width = '20px'
      el.style.height = '20px'
      el.style.borderRadius = '999px'
      el.style.background = '#FFFFFF'
      el.style.border = '3px solid rgba(217,165,94,0.95)'
      el.style.boxShadow = '0 0 20px rgba(217,165,94,0.7)'

      draftMarkerRef.current = new mapboxgl.Marker({ element: el, draggable: true })
        .setLngLat([selected.lon, selected.lat])
        .addTo(map)

      draftMarkerRef.current.on('dragend', () => {
        const lngLat = draftMarkerRef.current?.getLngLat()
        if (lngLat) onSelectPointRef.current({ lat: lngLat.lat, lon: lngLat.lng })
      })
    }, [selected])

    // Render origin/destination markers for route mode.
    useEffect(() => {
      const map = mapRef.current
      if (!map) return

      const renderRoutePin = (
        point: RoutePoint | null,
        markerRef: React.RefObject<mapboxgl.Marker | null>,
        color: string,
        onDrag: (p: RoutePoint) => void
      ) => {
        markerRef.current?.remove()
        markerRef.current = null
        if (!point) return
        const el = document.createElement('div')
        el.style.width = '22px'
        el.style.height = '22px'
        el.style.borderRadius = '999px'
        el.style.background = color
        el.style.border = '3px solid rgba(255,255,255,0.95)'
        el.style.boxShadow = `0 0 18px ${color}`
        const marker = new mapboxgl.Marker({ element: el, draggable: true })
          .setLngLat([point.lon, point.lat])
          .addTo(map)
        marker.on('dragend', () => {
          const ll = marker.getLngLat()
          onDrag({ lat: ll.lat, lon: ll.lng })
        })
        markerRef.current = marker
      }

      renderRoutePin(origin, originMarkerRef, ORIGIN_COLOR, (p) => onSetOriginRef.current(p))
      renderRoutePin(destination, destinationMarkerRef, DESTINATION_COLOR, (p) =>
        onSetDestinationRef.current(p)
      )

      // Hide the route pins entirely when leaving route mode.
      if (mode !== 'route') {
        originMarkerRef.current?.remove()
        originMarkerRef.current = null
        destinationMarkerRef.current?.remove()
        destinationMarkerRef.current = null
      }
    }, [origin, destination, mode])

    // Render the "your location" pin: a bouncing marker whose tooltip starts open
    // and toggles when the marker is clicked (mapbox toggles the popup on click).
    useEffect(() => {
      const map = mapRef.current
      if (!map) return

      userLocationMarkerRef.current?.remove()
      userLocationMarkerRef.current = null
      if (!userLocation) return

      const el = document.createElement('div')
      el.className = 'ciudadano-userloc'
      el.innerHTML = `<span class="ciudadano-userloc-pin">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#4C9AFF" stroke="#FFFFFF" stroke-width="1.6" stroke-linejoin="round">
          <path d="M12 21s7-6 7-12a7 7 0 10-14 0c0 6 7 12 7 12z" />
          <circle cx="12" cy="9" r="2.6" fill="#FFFFFF" stroke="none" />
        </svg>
      </span>`

      const popup = new mapboxgl.Popup({
        offset: 36,
        closeButton: false,
        closeOnClick: false,
        className: 'ciudadano-popup',
        maxWidth: '220px',
      }).setHTML(
        `<div class="cp-body">
          <div class="cp-type" style="color:#4C9AFF">
            <span class="cp-dot" style="background:#4C9AFF;box-shadow:0 0 8px #4C9AFF"></span>Tu ubicación
          </div>
          <div class="cp-desc">Esta es tu ubicación actual</div>
        </div>`
      )

      const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([userLocation.lon, userLocation.lat])
        .setPopup(popup)
        .addTo(map)
      // Abrir el tooltip al obtener la ubicación; el click en el pin lo alterna.
      marker.togglePopup()
      userLocationMarkerRef.current = marker
    }, [userLocation])

    // Render every route option on the map. The selected one is drawn solid and on top;
    // the rest are drawn dashed and dimmer underneath.
    useEffect(() => {
      const map = mapRef.current
      if (!map) return
      const drawnLayerIds = drawnRouteLayersRef.current

      const apply = () => {
        // Remove all previously drawn route layers/sources.
        for (const layerId of drawnLayerIds) {
          if (map.getLayer(layerId)) map.removeLayer(layerId)
          const sourceId = layerId.replace('-line', '')
          if (map.getSource(sourceId)) map.removeSource(sourceId)
        }
        drawnLayerIds.clear()

        if (!route || mode !== 'route') return

        // Draw non-selected options first (underneath).
        const ordered = [...route.options].sort((a, b) =>
          a.id === route.selectedId ? 1 : b.id === route.selectedId ? -1 : 0
        )

        for (const opt of ordered) {
          const sourceId = `route-${opt.id}`
          const layerId = `${sourceId}-line`
          const isSelected = opt.id === route.selectedId
          const data: GeoJSON.Feature<GeoJSON.LineString> = {
            type: 'Feature',
            properties: {},
            geometry: { type: 'LineString', coordinates: opt.coordinates },
          }
          map.addSource(sourceId, { type: 'geojson', data })
          map.addLayer({
            id: layerId,
            type: 'line',
            source: sourceId,
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-color': opt.color,
              'line-width': isSelected ? 7 : 5,
              'line-opacity': isSelected ? 0.95 : 0.8,
              ...(isSelected ? {} : { 'line-dasharray': [1.4, 1.6] }),
            },
          })
          drawnLayerIds.add(layerId)
        }

        // Fit map to all coords so the user sees every option.
        const allCoords: [number, number][] = route.options.flatMap((o) => o.coordinates)
        if (allCoords.length > 0) {
          const first = allCoords[0]
          const bounds = allCoords.reduce(
            (b: mapboxgl.LngLatBounds, c) => b.extend(c),
            new mapboxgl.LngLatBounds(first, first)
          )
          map.fitBounds(bounds, { padding: 60, duration: 600, maxZoom: 16 })
        }
      }

      if (map.isStyleLoaded()) apply()
      else map.once('load', apply)
    }, [route, mode])

    return <div ref={mapContainerRef} className="h-full w-full" />
  }
)
