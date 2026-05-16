'use client';

import { useEffect, useState } from 'react';
import { Icon, LogoMark } from './icons';

type LinkItem = { label: string; href: string; description: string };

const LINKS: LinkItem[] = [
  {
    label: 'Inicio',
    href: '#hero',
    description: 'La presentación de Ciudadano y la red de seguridad vecinal de Ica.',
  },
  {
    label: 'Cómo funciona',
    href: '#flow',
    description: 'Reporta, alerta y moviliza: el flujo de una emergencia en segundos.',
  },
  {
    label: 'Mapa',
    href: '#map',
    description: 'Mapa de calor en tiempo real con incidentes activos y zonas seguras.',
  },
  {
    label: 'Funciones',
    href: '#features',
    description: 'Pánico, grupos vecinales, alertas IA y bitácora compartida.',
  },
  {
    label: 'Planes',
    href: '#pricing',
    description: 'Vecino, Comunidad y Municipal — escala según tu cuadra o distrito.',
  },
  {
    label: 'Voces',
    href: '#voices',
    description: 'Testimonios reales de juntas vecinales y serenazgo aliado.',
  },
  {
    label: 'Contacto',
    href: '#contact',
    description: 'Habla con el equipo, agenda una demo o súmate como aliado.',
  },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('hero');
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track active section so the sheet highlights the current one.
  useEffect(() => {
    const ids = LINKS.map(({ href }) => href.slice(1));
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => n !== null);
    if (nodes.length === 0) return;

    const io = new IntersectionObserver(
      () => {
        const vh = window.innerHeight;
        let best: { id: string; ratio: number } | null = null;
        for (const n of nodes) {
          const r = n.getBoundingClientRect();
          const visible = Math.min(r.bottom, vh) - Math.max(r.top, 0);
          const ratio = visible / vh;
          if (!best || ratio > best.ratio) best = { id: n.id, ratio };
        }
        if (best && best.ratio > 0) setActiveId(best.id);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  // Lock body scroll while the sheet is open. The menu can only be dismissed
  // through the X button — no Escape, no outside-click — per product spec.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Reset the hover preview every time the sheet opens.
  useEffect(() => {
    if (!open) setPreviewIndex(null);
  }, [open]);

  const activeIndex = LINKS.findIndex(({ href }) => href.slice(1) === activeId);
  const previewItem =
    LINKS[previewIndex ?? (activeIndex >= 0 ? activeIndex : 0)] ?? LINKS[0];

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="relative mx-auto mt-4 flex max-w-[1240px] items-center justify-center px-4 sm:justify-between sm:gap-3">
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
            className={`absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-2xl text-white/85 transition-all duration-500 hover:text-white sm:static sm:translate-y-0 ${
              scrolled || open
                ? 'glass-strong shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]'
                : 'bg-white/4 ring-1 ring-white/10'
            }`}
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            aria-controls="landing-menu-sheet"
          >
            <Icon name={open ? 'x' : 'menu'} size={18} />
          </button>
        </div>
      </header>

      {/* Backdrop is now a brand preview panel: shows the logo + a per-section
          description that swaps as the user hovers the menu items. Clicking
          here does NOT close the sheet — only the X button does. */}
      <div
        className={`landing-sheet-backdrop ${open ? 'is-open' : ''}`}
        aria-hidden={!open}
      >
        <div className="landing-sheet-preview">
          <div className="landing-sheet-preview-brand">
            <LogoMark size={64} />
            <div className="landing-sheet-preview-name font-display">Ciudadano</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
              v1.0 · Ica · Red vecinal
            </div>
          </div>

          <div className="landing-sheet-preview-section" key={previewItem.label}>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
              {String(LINKS.indexOf(previewItem) + 1).padStart(2, '0')} ·{' '}
              {previewItem.label}
            </div>
            <p className="landing-sheet-preview-desc">{previewItem.description}</p>
          </div>
        </div>
      </div>

      {/* Sheet */}
      <aside
        id="landing-menu-sheet"
        className={`landing-sheet ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú principal"
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-6 pt-6 sm:px-10">
            <div className="flex items-center gap-2 text-white/55">
              <LogoMark size={22} />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Menú</span>
            </div>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full bg-white text-black transition hover:bg-white/85"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              tabIndex={open ? 0 : -1}
            >
              <Icon name="x" size={18} />
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center px-6 sm:px-10">
            <ul className="flex flex-col gap-3 sm:gap-5">
              {LINKS.map(({ label, href }, i) => {
                const id = href.slice(1);
                const isActive = activeId === id;
                return (
                  <li key={label}>
                    <a
                      href={href}
                      onClick={() => setOpen(false)}
                      onMouseEnter={() => setPreviewIndex(i)}
                      onFocus={() => setPreviewIndex(i)}
                      onMouseLeave={() => setPreviewIndex(null)}
                      onBlur={() => setPreviewIndex(null)}
                      tabIndex={open ? 0 : -1}
                      className={`landing-sheet-link group flex items-baseline gap-3 ${isActive ? 'is-active' : ''}`}
                      style={{ transitionDelay: open ? `${0.05 + i * 0.04}s` : '0s' }}
                    >
                      <span className="font-mono text-[11px] text-white/35">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-display text-[22px] font-semibold uppercase leading-none tracking-tight sm:text-[30px] lg:text-[36px]">
                        {label}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-white/8 px-6 py-6 sm:px-10">
            <a
              href="/login"
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className="landing-btn landing-btn-primary h-12 w-full"
            >
              Iniciar sesión <Icon name="arrow" size={14} />
            </a>
            <div className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
              <span>Ciudadano · v1.0 · Ica</span>
              <span className="flex items-center gap-1.5">
                <span className="landing-dot" style={{ background: '#6BAE7A', boxShadow: '0 0 10px #6BAE7A' }} />
                Operativo
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
