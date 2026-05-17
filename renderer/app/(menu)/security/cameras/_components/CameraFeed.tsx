'use client'

import { useCallback, useEffect, useState } from 'react'
import { Radio, WifiOff } from 'lucide-react'
import type { Camera } from '../_data'
import { CameraScene } from './CameraScene'
import { useWebcamStream } from './useWebcamStream'

type Variant = 'main' | 'thumb'

const WEBCAM_ID = 'cam-001'

export function CameraFeed({ camera, variant = 'main' }: { camera: Camera; variant?: Variant }) {
  const [now, setNow] = useState<string>('')

  useEffect(() => {
    const fmt = () => {
      const d = new Date()
      const pad = (n: number) => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    }
    setNow(fmt())
    const i = setInterval(() => setNow(fmt()), 1000)
    return () => clearInterval(i)
  }, [])

  const seed = parseInt(camera.id.replace(/\D/g, ''), 10) || 0
  const isOffline = camera.status === 'offline'
  const isMain = variant === 'main'
  const isWebcam = camera.id === WEBCAM_ID && !isOffline

  const { stream, error: webcamError } = useWebcamStream(isWebcam)

  const attachVideo = useCallback(
    (v: HTMLVideoElement | null) => {
      if (!v || !stream) return
      if (v.srcObject !== stream) v.srcObject = stream
      v.play().catch(() => {})
    },
    [stream],
  )

  return (
    <div className="relative h-full w-full overflow-hidden rounded-md bg-black">
      {isWebcam && stream ? (
        <video
          ref={attachVideo}
          muted
          playsInline
          autoPlay
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : isWebcam && webcamError ? (
        isMain ? <WebcamError message={webcamError} /> : <CameraScene scene={camera.scene} seed={seed} />
      ) : isWebcam ? (
        <WebcamConnecting />
      ) : !isOffline ? (
        <CameraScene scene={camera.scene} seed={seed} />
      ) : (
        <OfflinePlaceholder />
      )}

      {/* Top overlay */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-3 py-2 text-white">
        <div className="flex items-center gap-2">
          {camera.status === 'recording' && !isOffline && (
            <span className="flex items-center gap-1.5 rounded-full bg-red-600/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-md">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              REC
            </span>
          )}
          {camera.status === 'online' && !isOffline && (
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-600/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-md">
              <Radio className="h-3 w-3" />
              LIVE
            </span>
          )}
          {isOffline && (
            <span className="flex items-center gap-1.5 rounded-full bg-zinc-700/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-md">
              <WifiOff className="h-3 w-3" />
              OFFLINE
            </span>
          )}
          <span className="rounded bg-black/55 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider shadow-md">
            {camera.code}
          </span>
        </div>
        {isMain && (
          <span className="rounded bg-black/55 px-2 py-0.5 font-mono text-[10px] tracking-wider shadow-md">
            {camera.resolution} · {camera.fps}fps
          </span>
        )}
      </div>

      {/* Bottom overlay */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-3 py-2 text-white">
        <span className={`rounded bg-black/55 px-2 py-0.5 font-mono shadow-md ${isMain ? 'text-xs' : 'text-[9px]'}`}>
          {now || '----'}
        </span>
        {isMain && (
          <span className="max-w-[60%] truncate rounded bg-black/55 px-2 py-0.5 text-xs font-medium shadow-md">
            {camera.name} · {camera.zone}
          </span>
        )}
      </div>

      {/* corner brackets for main view */}
      {isMain && !isOffline && <CornerBrackets />}
    </div>
  )
}

function CornerBrackets() {
  const cls = 'absolute h-5 w-5 border-white/70'
  return (
    <>
      <div className={`${cls} left-2 top-8 border-l-2 border-t-2`} />
      <div className={`${cls} right-2 top-8 border-r-2 border-t-2`} />
      <div className={`${cls} bottom-8 left-2 border-b-2 border-l-2`} />
      <div className={`${cls} bottom-8 right-2 border-b-2 border-r-2`} />
    </>
  )
}

function OfflinePlaceholder() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 text-zinc-600">
      <div className="absolute inset-0 cam-noise opacity-40" />
      <WifiOff className="relative h-10 w-10" />
      <p className="relative mt-2 font-mono text-xs uppercase tracking-widest">No signal</p>
    </div>
  )
}

function WebcamConnecting() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 text-zinc-400">
      <div className="absolute inset-0 cam-noise opacity-30" />
      <div className="relative h-6 w-6 animate-spin rounded-full border-2 border-zinc-600 border-t-zinc-200" />
      <p className="relative mt-2 font-mono text-[10px] uppercase tracking-widest">Conectando cámara...</p>
    </div>
  )
}

function WebcamError({ message }: { message: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 px-6 text-center text-zinc-300">
      <div className="absolute inset-0 cam-noise opacity-25" />
      <WifiOff className="relative h-8 w-8 text-red-400" />
      <p className="relative mt-2 font-mono text-[10px] uppercase tracking-widest text-red-300">
        Cámara no disponible
      </p>
      <p className="relative mt-1 max-w-md text-[11px] text-zinc-400">{message}</p>
    </div>
  )
}
