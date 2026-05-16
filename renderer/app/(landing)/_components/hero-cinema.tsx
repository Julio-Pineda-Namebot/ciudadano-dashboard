'use client';

import { memo, useMemo, useRef } from 'react';
import { LogoMark } from './icons';
import { SplitWords } from './scroll/split-words';
import { useScrollProgress } from './scroll/use-element-progress';

const PARTICLES = Array.from({ length: 22 }).map((_, i) => {
  const x = (i * 47) % 100;
  const y = (i * 31) % 100;
  const s = 1 + (i % 4);
  const color = i % 3 === 0 ? '#FFFFFF' : i % 3 === 1 ? '#9CA3B0' : '#D9A55E';
  return { x, y, s, color, delay: i * 0.3 };
});

const HeroCinemaBg = memo(function HeroCinemaBg() {
  return (
    <div className="absolute inset-0">
      <div className="hero-cinema-bg" />
      <div className="hero-grid-drift parallax" data-parallax="0.06" />

      <svg
        className="absolute inset-0 h-full w-full opacity-60"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="heroRoute1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="heroRoute2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#9CA3B0" stopOpacity="0" />
            <stop offset="0.5" stopColor="#9CA3B0" stopOpacity="0.8" />
            <stop offset="1" stopColor="#9CA3B0" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="heroHot" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E04B5E" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#E04B5E" stopOpacity="0" />
          </radialGradient>
        </defs>

        <path
          d="M-200 760 C 200 700, 400 580, 700 540 S 1300 460, 1600 360 S 2100 240, 2400 200"
          stroke="url(#heroRoute1)"
          strokeWidth="1.8"
          fill="none"
          strokeDasharray="4 8"
          opacity="0.55"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-40" dur="3s" repeatCount="indefinite" />
        </path>
        <path
          d="M-100 920 C 300 880, 600 800, 900 760 S 1400 700, 1700 620 S 2000 540, 2200 480"
          stroke="url(#heroRoute2)"
          strokeWidth="1.2"
          fill="none"
          strokeDasharray="2 10"
          opacity="0.45"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-30" dur="4s" repeatCount="indefinite" />
        </path>
        <path
          d="M-100 200 C 200 240, 600 200, 900 280 S 1500 360, 1900 320"
          stroke="url(#heroRoute1)"
          strokeWidth="0.9"
          fill="none"
          strokeDasharray="2 14"
          opacity="0.35"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-25" dur="5s" repeatCount="indefinite" />
        </path>

        <circle cx="1380" cy="380" r="180" fill="url(#heroHot)" />
        <circle cx="540" cy="640" r="140" fill="url(#heroHot)" opacity="0.7" />
      </svg>

      <div className="absolute inset-0 overflow-hidden">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="float-slow absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.s,
              height: p.s,
              background: p.color,
              boxShadow: `0 0 8px ${p.color}`,
              opacity: 0.5,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="hero-cinema-vignette" />
      <div className="hero-cinema-mask-top" />
      <div className="hero-cinema-mask-bottom" />
    </div>
  );
});

export function HeroCinema() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgWrapRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const radarRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const leftDataRef = useRef<HTMLDivElement | null>(null);
  const rightDataRef = useRef<HTMLDivElement | null>(null);
  const scrollIndRef = useRef<HTMLDivElement | null>(null);

  const radarRings = useMemo(() => [0, 1, 2], []);

  useScrollProgress(sectionRef, (p) => {
    const logoScale = 1 + p * 3.5;
    const contentOpacity = Math.max(0, 1 - Math.max(0, p - 0.35) * 1.8);
    const subOpacity = Math.max(0, 1 - p * 2);
    const subY = p * -40;
    const bgScale = 1 + p * 0.2;
    const bgOpacity = Math.max(0, 1 - p * 0.6);
    const dropShadow = Math.max(0, 0.2 - p * 0.18);

    const subOpacityStr = subOpacity.toFixed(3);

    const bg = bgWrapRef.current;
    if (bg) {
      bg.style.transform = `scale(${bgScale.toFixed(3)})`;
      bg.style.opacity = bgOpacity.toFixed(3);
    }
    const logo = logoRef.current;
    if (logo) {
      logo.style.transform = `scale(${logoScale.toFixed(3)})`;
      logo.style.opacity = contentOpacity.toFixed(3);
      logo.style.filter = `drop-shadow(0 30px 80px rgba(255,255,255,${dropShadow.toFixed(3)}))`;
    }
    const radar = radarRef.current;
    if (radar) radar.style.opacity = (contentOpacity * 0.5).toFixed(3);

    const eyebrow = eyebrowRef.current;
    if (eyebrow) {
      eyebrow.style.opacity = subOpacityStr;
      eyebrow.style.transform = `translateY(${subY.toFixed(1)}px)`;
    }
    const text = textRef.current;
    if (text) {
      text.style.opacity = subOpacityStr;
      text.style.transform = `translateY(${subY.toFixed(1)}px)`;
    }
    if (leftDataRef.current) leftDataRef.current.style.opacity = subOpacityStr;
    if (rightDataRef.current) rightDataRef.current.style.opacity = subOpacityStr;
    if (scrollIndRef.current) scrollIndRef.current.style.opacity = subOpacityStr;
  }, 'sticky');

  return (
    <section ref={sectionRef} id="hero" className="scene" style={{ height: '120vh' }}>
      <div className="scene-pin">
        <div className="scene-stage">
        <div
          ref={bgWrapRef}
          className="absolute inset-0"
          style={{ willChange: 'transform, opacity' }}
        >
          <HeroCinemaBg />
        </div>

        <div className="relative z-10 flex h-full flex-col items-center justify-center">
          <div
            ref={eyebrowRef}
            className="mb-8"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="eyebrow whitespace-nowrap">Seguridad vecinal · Perú</div>
          </div>

          <div className="relative grid place-items-center" style={{ width: 280, height: 280 }}>
            <div
              ref={radarRef}
              className="pointer-events-none absolute inset-0 grid place-items-center"
              style={{ willChange: 'opacity' }}
            >
              {radarRings.map((i) => (
                <span
                  key={i}
                  className="absolute rounded-full border border-white/15"
                  style={{
                    width: 400 + i * 120,
                    height: 400 + i * 120,
                    animation: `landing-radar-pulse 4s cubic-bezier(.2,.7,.2,1) ${i * 1.3}s infinite`,
                  }}
                />
              ))}
            </div>

            <div
              ref={logoRef}
              className="relative"
              style={{
                transformOrigin: 'center center',
                willChange: 'transform, opacity, filter',
              }}
            >
              <LogoMark size={280} />
            </div>
          </div>
        </div>

        <div
          ref={textRef}
          className="absolute inset-x-0 bottom-32 z-10 mx-auto max-w-[760px] px-6 text-center"
          style={{ willChange: 'transform, opacity' }}
        >
          <h1 className="font-display text-[36px] font-semibold leading-[1.05] tracking-tight sm:text-[52px]">
            <SplitWords text="El barrio cuida al barrio." className="gradient-text" wordDelay={0.06} />
          </h1>
          <p className="reveal reveal-delay-3 mx-auto mt-5 max-w-[480px] text-[14.5px] leading-relaxed text-white/60 sm:text-[16px]">
            Reporta, alerta y movilízate con tu cuadra. Una app de seguridad construida por vecinos, para vecinos.
          </p>
        </div>

        <div
          ref={leftDataRef}
          className="absolute left-8 top-1/2 z-10 hidden -translate-y-1/2 lg:block"
          style={{ willChange: 'opacity' }}
        >
          <div className="font-mono space-y-6 text-[10px] uppercase tracking-[0.3em] text-white/35">
            <div><div className="text-white/70">142,318</div><div>vecinos</div></div>
            <div><div className="text-white/70">18 s</div><div>respuesta</div></div>
            <div><div className="text-white/70">98.4%</div><div>precisión</div></div>
          </div>
        </div>

        <div
          ref={rightDataRef}
          className="absolute right-8 top-1/2 z-10 hidden -translate-y-1/2 lg:block"
          style={{ willChange: 'opacity' }}
        >
          <div className="font-mono space-y-6 text-right text-[10px] uppercase tracking-[0.3em] text-white/35">
            <div><div className="text-white/70">LIVE</div><div>actividad</div></div>
            <div><div className="text-white/70">87</div><div>reportes hoy</div></div>
            <div><div className="text-white/70">12</div><div>patrullas</div></div>
          </div>
        </div>

        <div
          ref={scrollIndRef}
          className="absolute bottom-10 right-8 z-10"
          style={{ willChange: 'opacity' }}
        >
          <div className="scrolldown">
            <div className="mouse" />
            <span>Scroll</span>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
