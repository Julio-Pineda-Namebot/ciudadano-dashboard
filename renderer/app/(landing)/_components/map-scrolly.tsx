'use client';

import { memo, useMemo, useRef, useState } from 'react';
import { useScrollProgress } from './scroll/use-element-progress';

type PinType = 'incident' | 'patrol' | 'community' | 'camera' | 'safe';

const PINS: Array<{ x: number; y: number; type: PinType; stage: number }> = [
  { x: 22, y: 28, type: 'incident',  stage: 0 },
  { x: 70, y: 18, type: 'incident',  stage: 1 },
  { x: 46, y: 52, type: 'patrol',    stage: 1 },
  { x: 82, y: 64, type: 'community', stage: 2 },
  { x: 18, y: 72, type: 'camera',    stage: 2 },
  { x: 56, y: 80, type: 'safe',      stage: 3 },
  { x: 30, y: 42, type: 'community', stage: 3 },
  { x: 65, y: 38, type: 'camera',    stage: 3 },
];

const PIN_COLOR: Record<PinType, string> = {
  incident: '#E04B5E',
  patrol: '#6BAE7A',
  community: '#FFFFFF',
  camera: '#D9A55E',
  safe: '#B8D6BC',
};

const STAGES = [
  { title: 'Tu zona, en silencio', body: 'Empezamos contigo: tu ubicación, tu cuadra, tus vecinos cercanos.' },
  { title: 'Algo está pasando', body: 'Un reporte enciende el mapa. La patrulla cercana ya está en ruta.' },
  { title: 'La comunidad responde', body: 'Vecinos confirman, las cámaras públicas verifican, todos sabemos.' },
  { title: 'La ciudad, viva', body: 'Zonas seguras, patrullaje activo, una red vigilante distribuida en cada calle.' },
] as const;

function counters(stage: number) {
  return {
    reportes: stage === 0 ? 0 : stage === 1 ? 32 : stage === 2 ? 64 : 87,
    patrullas: stage === 0 ? 0 : stage === 1 ? 4 : stage === 2 ? 8 : 12,
    conectados: stage === 0 ? '180' : stage === 1 ? '0.9k' : stage === 2 ? '1.9k' : '3.2k',
  };
}

const MapBackground = memo(function MapBackground() {
  const parcels = useMemo(
    () =>
      Array.from({ length: 12 }).flatMap((_, row) =>
        Array.from({ length: 18 }).map((__, col) => {
          const x = col * 110 + 30 + (row % 2 ? 20 : 0);
          const y = row * 90 + 30;
          return {
            key: `${row}-${col}`,
            x,
            y,
            w: 80 + (col % 3) * 10,
            h: 70 + (row % 2) * 8,
          };
        }),
      ),
    [],
  );

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="mapScrollyGrid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M60 0H0V60" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#mapScrollyGrid)" />

      <g opacity="0.5">
        {parcels.map((p) => (
          <rect key={p.key} x={p.x} y={p.y} width={p.w} height={p.h} rx="4" fill="#0F1530" />
        ))}
      </g>

      <g stroke="rgba(255,255,255,0.10)" strokeWidth="1.4" fill="none">
        {[150, 300, 450, 600, 750, 900].map((y) => (
          <line key={y} x1="0" y1={y} x2="1920" y2={y} />
        ))}
        {[200, 420, 620, 820, 1020, 1240, 1440, 1660].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="1080" />
        ))}
      </g>
      <path d="M0 600 Q 600 540 1100 580 T 1920 540" stroke="rgba(255,255,255,0.22)" strokeWidth="2" fill="none" />
    </svg>
  );
});

export function MapScrolly() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const mapInnerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef(0);
  const [stage, setStage] = useState(0);

  useScrollProgress(sectionRef, (p) => {
    const inner = mapInnerRef.current;
    if (inner) inner.style.transform = `scale(${(1 + p * 0.12).toFixed(3)})`;

    const next = p < 0.15 ? 0 : p < 0.35 ? 1 : p < 0.6 ? 2 : 3;
    if (next !== stageRef.current) {
      stageRef.current = next;
      setStage(next);
    }
  }, 'sticky');

  const stageTitle = STAGES[stage].title;
  const [firstPart, ...rest] = stageTitle.split(',');
  const secondPart = rest.join(',').trim();
  const c = counters(stage);

  return (
    <section ref={sectionRef} id="map" className="scene" style={{ height: '340vh' }}>
      <div className="scene-pin">
        <div className="scene-stage">
        <div className="relative h-full overflow-hidden">
          <div className="map-canvas absolute inset-0">
            <div
              ref={mapInnerRef}
              className="absolute inset-0"
              style={{ transformOrigin: 'center', willChange: 'transform' }}
            >
              <MapBackground />

              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 1920 1080"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  <linearGradient id="mapScrollyRoute" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#FFFFFF" />
                    <stop offset="1" stopColor="#9CA3B0" />
                  </linearGradient>
                  <radialGradient id="mapScrollyHot" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#E04B5E" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#E04B5E" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="mapScrollySafe" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {stage >= 1 && (
                  <circle
                    cx="430"
                    cy="320"
                    r="220"
                    fill="url(#mapScrollyHot)"
                    style={{ animation: 'landing-fade-in .8s ease' }}
                  />
                )}
                {stage >= 2 && (
                  <circle
                    cx="1360"
                    cy="220"
                    r="180"
                    fill="url(#mapScrollyHot)"
                    opacity="0.7"
                    style={{ animation: 'landing-fade-in .8s ease' }}
                  />
                )}
                {stage >= 3 && (
                  <circle
                    cx="1100"
                    cy="850"
                    r="240"
                    fill="url(#mapScrollySafe)"
                    style={{ animation: 'landing-fade-in .8s ease' }}
                  />
                )}

                {stage >= 2 && (
                  <path
                    d="M340 880 C 480 820, 600 820, 720 760 S 900 600, 1080 600 S 1320 540, 1500 360"
                    stroke="url(#mapScrollyRoute)"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray="10 12"
                    strokeLinecap="round"
                    opacity="0.95"
                    style={{ animation: 'landing-fade-in .8s ease' }}
                  >
                    <animate attributeName="stroke-dashoffset" from="0" to="-44" dur="2.4s" repeatCount="indefinite" />
                  </path>
                )}
              </svg>

              {PINS.map((p, i) => {
                const visible = stage >= p.stage;
                const color = PIN_COLOR[p.type];
                return (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${p.x}%`,
                      top: `${p.y}%`,
                      color,
                      opacity: visible ? 1 : 0,
                      transform: `translate(-50%, -50%) scale(${visible ? 1 : 0.3})`,
                      transition: 'opacity .6s cubic-bezier(.2,.7,.2,1), transform .6s cubic-bezier(.2,.7,.2,1)',
                    }}
                  >
                    <div
                      className="marker-pulse h-3.5 w-3.5 rounded-full"
                      style={{ background: color, boxShadow: `0 0 18px ${color}` }}
                    />
                  </div>
                );
              })}
            </div>

            <div className="pointer-events-none absolute inset-0 opacity-30">
              <div className="scan" />
            </div>

            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)' }}
            />
          </div>

          <div className="relative mx-auto grid h-full max-w-[1320px] grid-cols-1 items-end gap-8 px-6 pb-20 lg:grid-cols-[1fr_1fr]">
            <div>
              <div className="eyebrow mb-4">El mapa, en tiempo real</div>
              <div
                key={stage}
                className="font-display text-[40px] font-semibold leading-[1.15] tracking-[-0.03em] sm:text-[56px]"
                style={{ animation: 'landing-fade-up .8s cubic-bezier(.2,.7,.2,1)' }}
              >
                <span className="gradient-text">{firstPart}</span>
                {secondPart && (
                  <>
                    <span className="gradient-text">,</span>
                    <br />
                    <span className="gradient-text-accent italic">{secondPart}</span>
                  </>
                )}
                <span className="gradient-text">.</span>
              </div>
              <p
                className="mt-5 max-w-[420px] text-[15.5px] leading-relaxed text-white/65"
                style={{ animation: 'landing-fade-up .8s cubic-bezier(.2,.7,.2,1) .15s both' }}
              >
                {STAGES[stage].body}
              </p>
            </div>

            <div className="flex justify-end">
              <div className="glass-strong w-[300px] rounded-2xl p-4">
                <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-white/45">
                  <span className="flex items-center gap-1.5">
                    <span className="landing-dot" style={{ background: '#E04B5E', boxShadow: '0 0 10px #E04B5E' }} />
                    Actividad en vivo
                  </span>
                  <span>SAN ISIDRO</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="font-display text-[24px] font-semibold">{c.reportes}</div>
                    <div className="font-mono text-[9px] uppercase tracking-widest text-white/45">reportes</div>
                  </div>
                  <div>
                    <div className="font-display text-[24px] font-semibold text-white">{c.patrullas}</div>
                    <div className="font-mono text-[9px] uppercase tracking-widest text-white/45">patrullas</div>
                  </div>
                  <div>
                    <div className="font-display text-[24px] font-semibold">{c.conectados}</div>
                    <div className="font-mono text-[9px] uppercase tracking-widest text-white/45">conectados</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute right-8 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-3">
            {STAGES.map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em]"
                style={{ color: stage >= i ? '#fff' : 'rgba(255,255,255,0.25)' }}
              >
                <span>{String(i + 1).padStart(2, '0')}</span>
                <span
                  className="h-2 w-2 rounded-full transition"
                  style={{
                    background: stage >= i ? '#FFFFFF' : 'rgba(255,255,255,0.15)',
                    boxShadow: stage >= i ? '0 0 12px #FFFFFF' : 'none',
                  }}
                />
              </div>
            ))}
          </div>

          <div className="hero-cinema-mask-bottom" />
          <div className="hero-cinema-mask-top" />
        </div>
        </div>
      </div>
    </section>
  );
}
