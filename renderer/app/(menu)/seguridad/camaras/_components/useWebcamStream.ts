'use client'

import { useEffect, useState } from 'react'

let sharedStream: MediaStream | null = null
let pending: Promise<MediaStream> | null = null
const listeners = new Set<(s: MediaStream | null, err: string | null) => void>()
let lastError: string | null = null

function notify() {
  listeners.forEach((fn) => fn(sharedStream, lastError))
}

async function ensureStream(): Promise<MediaStream> {
  if (sharedStream && sharedStream.active) return sharedStream
  if (pending) return pending
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    throw new Error('Webcam API no disponible')
  }
  pending = navigator.mediaDevices
    .getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false })
    .then((s) => {
      sharedStream = s
      lastError = null
      pending = null
      notify()
      return s
    })
    .catch((e) => {
      pending = null
      lastError = e?.message ?? 'No se pudo acceder a la cámara'
      notify()
      throw e
    })
  return pending
}

export function useWebcamStream(enabled: boolean) {
  const [stream, setStream] = useState<MediaStream | null>(sharedStream)
  const [error, setError] = useState<string | null>(lastError)

  useEffect(() => {
    if (!enabled) return
    const sub = (s: MediaStream | null, err: string | null) => {
      setStream(s)
      setError(err)
    }
    listeners.add(sub)
    ensureStream().catch(() => {})
    return () => {
      listeners.delete(sub)
    }
  }, [enabled])

  return { stream, error }
}
