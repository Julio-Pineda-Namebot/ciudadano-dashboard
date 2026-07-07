'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { logoutCitizen } from '@/app/auth-citizen'
import type { CitizenProfile } from '@/app/auth-citizen-types'
import { BookOpen, LogOut, MapPin, User } from 'lucide-react'

// Manual de usuario servido como estático desde public/.
const USER_MANUAL_URL = '/manual-usuario-plataforma-web-ciudadano.pdf'

type CitizenFeedUserMenuProps = {
  profile: CitizenProfile
}

function getInitials(profile: CitizenProfile): string {
  const first = profile.firstName?.trim()?.[0] ?? ''
  const last = profile.lastName?.trim()?.[0] ?? ''
  const initials = `${first}${last}`.toUpperCase()
  return initials || profile.email?.[0]?.toUpperCase() || 'U'
}

export function CitizenFeedUserMenu({ profile }: CitizenFeedUserMenuProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Cerrar al hacer clic fuera o presionar Escape.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const fullName = `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim() || 'Vecino'

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Menú de usuario"
        className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/6 font-display text-[13px] font-semibold text-white/90 backdrop-blur-sm transition hover:bg-white/12 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        {getInitials(profile)}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-12 z-50 w-60 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f1c]/95 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-md"
        >
          <div className="flex items-center gap-3 border-b border-white/8 px-4 py-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/8 text-white/70">
              <User size={18} />
            </span>
            <div className="min-w-0">
              <div className="truncate text-[13px] font-semibold text-white">{fullName}</div>
              <div className="truncate text-[11px] text-white/45">{profile.email}</div>
            </div>
          </div>

          <Link
            href="/feed/mis-incidencias"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-[13px] text-white/80 transition hover:bg-white/6 hover:text-white"
          >
            <MapPin size={16} />
            Mis incidencias
          </Link>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              window.open(USER_MANUAL_URL, '_blank', 'noopener,noreferrer')
              setOpen(false)
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-[13px] text-white/80 transition hover:bg-white/6 hover:text-white"
          >
            <BookOpen size={16} />
            Ver manual de usuario
          </button>

          <form action={logoutCitizen}>
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-3 border-t border-white/8 px-4 py-3 text-left text-[13px] text-[#FF8A99] transition hover:bg-[#E04B5E]/10"
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
