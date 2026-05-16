'use client';

import { useEffect, useState } from 'react';
import { Icon, LogoMark } from './icons';

const LINKS: Array<[label: string, href: string]> = [
  ['Inicio', '#hero'],
  ['Cómo funciona', '#flow'],
  ['Mapa', '#map'],
  ['Funciones', '#features'],
  ['Planes', '#pricing'],
  ['Contacto', '#contact'],
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-4 flex max-w-[1240px] items-center justify-between gap-3 px-4">
        <a
          href="#hero"
          className={`flex items-center gap-2 rounded-2xl px-3 py-2 transition-all duration-500 ${
            scrolled ? 'glass-strong shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]' : ''
          }`}
        >
          <LogoMark size={26} />
          <span className="font-display text-[17px] font-semibold tracking-tight">Ciudadano</span>
          <span className="ml-1 hidden rounded-full bg-white/6 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-white/55 ring-1 ring-white/10 sm:inline-flex">
            v1.0 · Ica
          </span>
        </a>

        <button
          type="button"
          className={`grid h-11 w-11 place-items-center rounded-2xl text-white/85 transition-all duration-500 hover:text-white ${
            scrolled || open
              ? 'glass-strong shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]'
              : 'bg-white/4 ring-1 ring-white/10'
          }`}
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
        >
          <Icon name={open ? 'x' : 'menu'} size={18} />
        </button>
      </div>

      <div
        className={`pointer-events-none mx-auto mt-2 max-w-[1240px] px-4 transition-all duration-300 ${
          open ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
        }`}
      >
        <div
          className={`glass-strong ml-auto w-full max-w-[320px] rounded-2xl p-3 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] ${
            open ? 'pointer-events-auto' : ''
          }`}
        >
          <nav className="flex flex-col">
            {LINKS.map(([label, href]) => (
              <a
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-[14px] text-white/80 transition hover:bg-white/6 hover:text-white"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/7 pt-3">
            <a href="/login" className="landing-btn landing-btn-ghost">
              Crear cuenta
            </a>
            <a href="/login" className="landing-btn landing-btn-primary">
              Iniciar sesión <Icon name="arrow" size={14} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
