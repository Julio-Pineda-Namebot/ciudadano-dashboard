export type CameraStatus = 'online' | 'offline' | 'recording'

export type Camera = {
  id: string
  code: string
  name: string
  zone: string
  status: CameraStatus
  scene: SceneId
  resolution: string
  fps: number
}

export type SceneId =
  | 'avenue'
  | 'plaza'
  | 'market'
  | 'parking'
  | 'park'
  | 'intersection'
  | 'tunnel'
  | 'storefront'

export const CAMERAS: Camera[] = [
  { id: 'cam-001', code: 'CAM-01', name: 'Av. Grau – Cdra. 5',           zone: 'Centro',     status: 'recording', scene: 'avenue',       resolution: '1080p', fps: 30 },
  { id: 'cam-002', code: 'CAM-02', name: 'Plaza de Armas',               zone: 'Centro',     status: 'recording', scene: 'plaza',        resolution: '1080p', fps: 25 },
  { id: 'cam-003', code: 'CAM-03', name: 'Mercado Modelo',               zone: 'Centro',     status: 'online',    scene: 'market',       resolution: '720p',  fps: 24 },
  { id: 'cam-004', code: 'CAM-04', name: 'Estacionamiento Municipal',    zone: 'Norte',      status: 'recording', scene: 'parking',      resolution: '1080p', fps: 30 },
  { id: 'cam-005', code: 'CAM-05', name: 'Parque de la Juventud',        zone: 'Sur',        status: 'online',    scene: 'park',         resolution: '720p',  fps: 25 },
  { id: 'cam-006', code: 'CAM-06', name: 'Cruce Cutervo / Lima',         zone: 'Centro',     status: 'recording', scene: 'intersection', resolution: '1080p', fps: 30 },
  { id: 'cam-007', code: 'CAM-07', name: 'Túnel Av. Los Maestros',       zone: 'Este',       status: 'offline',   scene: 'tunnel',       resolution: '1080p', fps: 30 },
  { id: 'cam-008', code: 'CAM-08', name: 'Comercio Jr. Independencia',   zone: 'Centro',     status: 'online',    scene: 'storefront',   resolution: '720p',  fps: 24 },
  { id: 'cam-009', code: 'CAM-09', name: 'Av. Municipalidad',            zone: 'Oeste',      status: 'recording', scene: 'avenue',       resolution: '1080p', fps: 30 },
  { id: 'cam-010', code: 'CAM-10', name: 'Plaza Bolognesi',              zone: 'Centro',     status: 'online',    scene: 'plaza',        resolution: '720p',  fps: 25 },
  { id: 'cam-011', code: 'CAM-11', name: 'Mercado Arenales',             zone: 'Norte',      status: 'recording', scene: 'market',       resolution: '1080p', fps: 30 },
  { id: 'cam-012', code: 'CAM-12', name: 'Cruce Salaverry / Cajamarca',  zone: 'Sur',        status: 'recording', scene: 'intersection', resolution: '1080p', fps: 30 },
]
