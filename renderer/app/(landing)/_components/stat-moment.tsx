'use client';

import { useRef } from 'react';
import { SplitWords } from './scroll/split-words';
import { useScrollProgress } from './scroll/use-element-progress';

const TARGET = 1428642;

export function StatMoment() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const numberRef = useRef<HTMLDivElement | null>(null);

  useScrollProgress(sectionRef, (p) => {
    const el = numberRef.current;
    if (!el) return;
    const display = Math.floor(TARGET * Math.min(1, p * 1.5));
    el.textContent = display.toLocaleString('es-PE');
    el.style.transform = `scale(${(0.92 + p * 0.15).toFixed(3)})`;
  }, 'sticky');

  return (
    <section ref={sectionRef} className="scene" style={{ height: '100vh' }}>
      <div className="scene-pin">
        <div className="scene-stage">
        <div className="relative h-full overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.18), transparent 55%), radial-gradient(ellipse at 70% 60%, rgba(180,184,194,0.18), transparent 55%), linear-gradient(180deg, #050714 0%, #03050E 100%)',
            }}
          />
          <div className="grid-bg grid-bg-fade absolute inset-0 opacity-30" />

          <div className="relative mx-auto flex h-full max-w-[1440px] flex-col items-center justify-center px-6 text-center">
            <div className="eyebrow mb-6">El impacto, en cifras</div>
            <div className="text-[13px] text-white/60 sm:text-[14px]">
              <SplitWords text="Ciudadano ha verificado" wordDelay={0.04} />
            </div>
            <div
              ref={numberRef}
              className="my-5 font-display text-[44px] font-semibold leading-none tracking-tighter sm:my-6 sm:text-[80px] md:text-[110px] lg:text-[160px] xl:text-[220px]"
              style={{
                background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                willChange: 'transform',
              }}
            >
              0
            </div>
            <div className="font-display text-[16px] font-medium text-white/80 sm:text-[20px] md:text-[28px]">
              <SplitWords text="alertas reales en barrios reales" wordDelay={0.05} />
            </div>
            <p className="mt-4 max-w-[520px] text-[13px] text-white/55 sm:mt-5 sm:text-[14.5px]">
              Cada alerta es una respuesta más rápida, una ruta más segura, un vecino que llega a casa tranquilo.
            </p>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
