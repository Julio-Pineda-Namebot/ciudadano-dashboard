'use client'

import { useEffect } from 'react'

export function CitizenFeedInactiveOverlay() {
  // Block back navigation while the screen is inactive: push a sentinel state
  // and re-push it on every popstate so history.back() effectively does nothing.
  useEffect(() => {
    const SENTINEL = 'ciudadano-inactive'
    try {
      window.history.pushState({ ciudadanoInactive: true }, '', window.location.href)
    } catch {
      // ignore
    }

    const onPopState = () => {
      try {
        window.history.pushState({ ciudadanoInactive: true, tag: SENTINEL }, '', window.location.href)
      } catch {
        // ignore
      }
    }

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }

    const onKeyDown = (e: KeyboardEvent) => {
      // Block common shortcuts that could navigate away or reload.
      if (
        (e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) ||
        e.key === 'F5' ||
        (e.ctrlKey && (e.key === 'r' || e.key === 'R')) ||
        (e.metaKey && (e.key === 'r' || e.key === 'R'))
      ) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    window.addEventListener('popstate', onPopState)
    window.addEventListener('beforeunload', onBeforeUnload)
    window.addEventListener('keydown', onKeyDown, true)

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('popstate', onPopState)
      window.removeEventListener('beforeunload', onBeforeUnload)
      window.removeEventListener('keydown', onKeyDown, true)
      document.body.style.overflow = originalOverflow
    }
  }, [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pantalla inactiva"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
    >
      <div className="flex flex-col items-center gap-7 px-6 text-center">
        {/* Monitor / screen mockup */}
        <div className="relative">
          <div
            className="relative flex h-[180px] w-[280px] items-center justify-center rounded-[14px] border border-white/15 bg-[#0A0A0A] shadow-[0_0_60px_-10px_rgba(224,75,94,0.35)] sm:h-[210px] sm:w-[340px]"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(224,75,94,0.08), transparent 65%), #060606',
            }}
          >
            {/* Inner bezel */}
            <div className="absolute inset-[10px] rounded-[8px] border border-white/8 bg-black" />

            {/* Red circle indicator */}
            <div className="relative flex flex-col items-center gap-3">
              <div className="relative">
                <span
                  className="absolute inset-0 -m-2 rounded-full"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(224,75,94,0.35), transparent 70%)',
                    filter: 'blur(4px)',
                  }}
                />
                <span
                  className="relative block h-12 w-12 rounded-full sm:h-14 sm:w-14"
                  style={{
                    background:
                      'radial-gradient(circle at 35% 30%, #FF8A99, #E04B5E 55%, #8C1B2A 100%)',
                    boxShadow:
                      '0 0 24px rgba(224,75,94,0.8), inset 0 -4px 12px rgba(0,0,0,0.4)',
                  }}
                />
              </div>
              <span className="relative font-mono text-[10px] uppercase tracking-[0.35em] text-[#FF8A99]">
                · offline ·
              </span>
            </div>
          </div>

          {/* Monitor stand */}
          <div className="mx-auto mt-2 h-3 w-16 rounded-b-md bg-gradient-to-b from-white/15 to-white/5" />
          <div className="mx-auto h-1.5 w-28 rounded-full bg-white/10" />
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.4em] text-[#E04B5E]">
            Sesión bloqueada
          </div>
          <h2 className="font-display text-[28px] font-semibold tracking-tight text-white sm:text-[34px]">
            Pantalla inactiva
          </h2>
          <p className="max-w-sm text-[13px] leading-relaxed text-white/55">
            Esta pestaña ha sido suspendida porque abriste los términos y condiciones
            en otra ventana. No es posible volver atrás desde aquí — únicamente puedes
            cerrar esta pestaña.
          </p>
        </div>

        <div className="mt-2 flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: '#E04B5E',
              boxShadow: '0 0 8px #E04B5E',
            }}
          />
          Cierra esta ventana para continuar
        </div>
      </div>
    </div>
  )
}
