"use client";

import { useRef, useState } from "react";
import { Icon } from "./icons";
import { useScrollProgress } from "./scroll/use-element-progress";

function PhoneScreen1() {
  const items: Array<[icon: Parameters<typeof Icon>[0]['name'], label: string, color: string]> = [
    ['siren', 'Robo', '#E04B5E'],
    ['eye', 'Sospechoso', '#D9A55E'],
    ['zap', 'Accidente', '#9CA3B0'],
    ['shield', 'Vandalismo', '#FFFFFF'],
  ];

  return (
    <div className="absolute inset-0 flex flex-col px-5 pt-10">
      <div className="text-center font-mono text-[10px] uppercase tracking-widest text-white/45">Paso 01</div>
      <div className="mx-auto mt-2 grid h-16 w-16 place-items-center rounded-2xl bg-[#E04B5E]/15 text-[#E04B5E] ring-1 ring-[#E04B5E]/30">
        <Icon name="siren" size={28} />
      </div>
      <div className="mt-5 text-center font-display text-[20px] font-semibold leading-tight">¿Qué está pasando?</div>
      <div className="mt-1 text-center text-[11.5px] text-white/55">Selecciona el tipo de incidencia</div>
      <div className="mt-5 grid grid-cols-2 gap-2">
        {items.map(([ic, label, c]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/3 p-3 text-left">
            <div className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: `${c}22`, color: c }}>
              <Icon name={ic} size={14} />
            </div>
            <div className="mt-2 text-[12px] font-medium text-white/85">{label}</div>
          </div>
        ))}
      </div>
      <div className="mt-auto mb-2">
        <div className="rounded-2xl bg-linear-to-r from-[#0E2030] to-[#0D1330] p-3 text-center ring-1 ring-white/10">
          <div className="font-mono text-[9px] uppercase tracking-widest text-white/45">tu ubicación</div>
          <div className="mt-0.5 text-[12px] text-white/85">San Isidro · Av. Pardo</div>
        </div>
      </div>
    </div>
  );
}

function PhoneScreen2() {
  const confirms: Array<[name: string, msg: string, color: string, icon: Parameters<typeof Icon>[0]['name']]> = [
    ['Lucía M.', 'Confirmado · cerca', '#FFFFFF', 'check'],
    ['Junta Pardo', 'Sereno avisado', '#6BAE7A', 'shield'],
    ['Carlos Q.', 'Voy a verificar', '#9CA3B0', 'eye'],
  ];

  return (
    <div className="absolute inset-0 flex flex-col px-5 pt-10">
      <div className="text-center font-mono text-[10px] uppercase tracking-widest text-white/45">Paso 02</div>
      <div className="relative mx-auto mt-2 grid h-16 w-16 place-items-center rounded-full bg-[#E04B5E]/15 text-[#E04B5E] ring-1 ring-[#E04B5E]/30">
        <Icon name="radio" size={28} />
        <span className="absolute inset-[-8px] animate-ping rounded-full border border-[#E04B5E] opacity-60" />
      </div>
      <div className="mt-5 text-center font-display text-[20px] font-semibold leading-tight">Alerta enviada</div>
      <div className="mt-1 text-center text-[11.5px] text-white/55">A 14 vecinos en 320 m</div>

      <div className="mt-6 space-y-2.5">
        {confirms.map(([n, m, c, ic], i) => (
          <div
            key={n}
            className="flex items-center gap-2.5 rounded-xl bg-white/4 p-2.5 ring-1 ring-white/10"
            style={{ animation: `landing-reveal-up .6s ease ${i * 0.2}s both` }}
          >
            <div className="h-8 w-8 rounded-full" style={{ background: `linear-gradient(135deg, ${c}, ${c}88)` }} />
            <div className="flex-1">
              <div className="text-[11.5px] font-medium text-white">{n}</div>
              <div className="text-[10px] text-white/55">{m}</div>
            </div>
            <div className="grid h-6 w-6 place-items-center rounded-full" style={{ background: `${c}22`, color: c }}>
              <Icon name={ic} size={11} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhoneScreen3() {
  return (
    <div className="absolute inset-0 flex flex-col px-5 pt-10">
      <div className="text-center font-mono text-[10px] uppercase tracking-widest text-white/45">Paso 03</div>
      <div className="mx-auto mt-2 grid h-16 w-16 place-items-center rounded-2xl bg-white/15 text-white ring-1 ring-white/30">
        <Icon name="route" size={28} />
      </div>
      <div className="mt-5 text-center font-display text-[20px] font-semibold leading-tight">Ruta segura</div>
      <div className="mt-1 text-center text-[11.5px] text-white/55">+12% más seguro · 8 min</div>

      <div
        className="relative mt-4 h-[180px] overflow-hidden rounded-2xl"
        style={{ background: 'linear-gradient(180deg, #0E1530, #060814)' }}
      >
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 280 180" fill="none">
          <defs>
            <linearGradient id="phoneScreen3Route" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#9CA3B0" />
            </linearGradient>
            <radialGradient id="phoneScreen3Danger" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#E04B5E" stopOpacity="0.5" />
              <stop offset="1" stopColor="#E04B5E" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g opacity="0.4">
            {[
              [10, 10, 60, 40], [80, 10, 80, 55], [170, 10, 100, 40],
              [10, 60, 60, 55], [80, 75, 80, 40], [170, 60, 100, 55],
              [10, 125, 60, 45], [80, 125, 80, 45], [170, 125, 100, 45],
            ].map(([x, y, w, h], i) => (
              <rect key={i} x={x} y={y} width={w} height={h} rx="3" fill="#0F1530" />
            ))}
          </g>
          <circle cx="210" cy="50" r="55" fill="url(#phoneScreen3Danger)" />
          <path
            d="M30 150 C 80 130, 110 100, 150 90 S 230 60, 250 30"
            stroke="url(#phoneScreen3Route)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="2 4"
          >
            <animate attributeName="stroke-dashoffset" from="0" to="-30" dur="2s" repeatCount="indefinite" />
          </path>
          <circle cx="30" cy="150" r="5" fill="#FFFFFF" />
          <circle cx="250" cy="30" r="5" fill="#9CA3B0" />
        </svg>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl bg-white/4 px-3 py-2 ring-1 ring-white/10">
        <div className="flex items-center gap-2">
          <Icon name="check" size={14} className="text-[#6BAE7A]" />
          <span className="text-[11.5px] text-white/85">Evita zona activa</span>
        </div>
        <span className="font-mono text-[10px] text-white/40">8 min</span>
      </div>
    </div>
  );
}

const STEPS = [
  { num: '01', title: 'Reporta', body: 'Un toque. Geolocalización, evidencia fotográfica opcional, anonimato si lo prefieres. Tu cuadra entera lo sabrá en segundos.' },
  { num: '02', title: 'Tu comunidad recibe', body: 'Vecinos confirman la alerta. Serenazgo y patrullas reciben el aviso. La comunidad responde.' },
  { num: '03', title: 'Apóyate en la red', body: 'La app sugiere rutas que evitan zonas activas y te conecta con quienes pueden ayudarte cerca.' },
] as const;

export function PhoneScrolly() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const phoneWrapRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  useScrollProgress(sectionRef, (p) => {
    const phone = phoneWrapRef.current;
    if (phone) {
      phone.style.transform = `translate3d(0, ${(-p * 30).toFixed(1)}px, 0) scale(${(0.96 + p * 0.04).toFixed(3)})`;
    }
    const bar = progressBarRef.current;
    if (bar) bar.style.transform = `scaleX(${p.toFixed(3)})`;

    const next = p < 0.22 ? 0 : p < 0.5 ? 1 : 2;
    if (next !== activeRef.current) {
      activeRef.current = next;
      setActive(next);
    }
  }, 'sticky');

  return (
    <section ref={sectionRef} id="flow" className="scene" style={{ height: '260vh' }}>
      <div className="scene-pin">
        <div className="scene-stage">
        <div className="relative h-full">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.10), transparent 55%), radial-gradient(circle at 50% 60%, rgba(180,184,194,0.08), transparent 60%)',
            }}
          />
          <div className="grid-bg grid-bg-fade absolute inset-0 opacity-30" />

          <div className="relative mx-auto grid h-full max-w-[1240px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-[1fr_440px_1fr]">
            <div className="hidden lg:block">
              <div className="eyebrow mb-4">Cómo funciona</div>
              <h2 className="font-display text-[30px] font-semibold leading-[1.15] tracking-[-0.03em] xl:text-[36px]">
                <span className="gradient-text">Tres pasos. </span>
                <span className="gradient-text-accent italic">Cero fricción.</span>
              </h2>
              <p className="mt-3 max-w-[380px] text-[13.5px] leading-relaxed text-white/55">
                Diseñado para que reportar, alertar y moverte sea tan inmediato como sacar el teléfono del bolsillo.
              </p>

              <div className="mt-6 space-y-2">
                {STEPS.map((s, i) => (
                  <div
                    key={s.num}
                    className={`group flex items-start gap-3 rounded-2xl border p-3 transition-all duration-500 ${
                      active === i ? 'border-white/40 bg-white/6' : 'border-white/7 bg-white/2'
                    }`}
                  >
                    <div className={`font-mono text-[10px] tracking-widest transition ${active === i ? 'text-white' : 'text-white/30'}`}>{s.num}</div>
                    <div className="flex-1">
                      <div className={`text-[13px] font-medium transition ${active === i ? 'text-white' : 'text-white/55'}`}>{s.title}</div>
                      <div className={`mt-0.5 text-[11.5px] leading-snug transition ${active === i ? 'text-white/70' : 'text-white/35'}`}>{s.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              ref={phoneWrapRef}
              className="relative flex justify-center"
              style={{ willChange: 'transform' }}
            >
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.20), transparent 70%)' }}
              />

              <div className="phone-outer phone relative" style={{ width: 340, height: 700 }}>
                <div className="absolute left-[-3px] top-[120px] h-[60px] w-[3px] rounded-l bg-white/10" />
                <div className="absolute left-[-3px] top-[200px] h-[90px] w-[3px] rounded-l bg-white/10" />
                <div className="absolute right-[-3px] top-[160px] h-[110px] w-[3px] rounded-l bg-white/10" />

                <div
                  className="absolute inset-[8px] overflow-hidden rounded-[36px]"
                  style={{ background: 'linear-gradient(180deg,#0A0E1E 0%, #060814 100%)' }}
                >
                  <div className="absolute left-1/2 top-2 z-20 h-[26px] w-[100px] -translate-x-1/2 rounded-full bg-black" />
                  <div className="absolute left-0 right-0 top-0 flex justify-between px-6 pt-3 font-mono text-[10px] text-white/60">
                    <span>21:48</span>
                    <span>Ciudadano</span>
                  </div>

                  <div className={`phone-screen ${active === 0 ? 'is-active' : ''}`}>
                    <PhoneScreen1 />
                  </div>
                  <div className={`phone-screen ${active === 1 ? 'is-active' : ''}`}>
                    <PhoneScreen2 />
                  </div>
                  <div className={`phone-screen ${active === 2 ? 'is-active' : ''}`}>
                    <PhoneScreen3 />
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden justify-end lg:flex">
              <div className="flex flex-col items-end gap-8 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                {STEPS.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className={`transition ${active === i ? 'text-white' : ''}`}>{s.title}</span>
                    <span
                      className={`h-2 w-2 rounded-full transition ${active === i ? 'bg-white shadow-[0_0_12px_#FFFFFF]' : 'bg-white/15'}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-12 mx-auto h-[2px] w-[200px] overflow-hidden rounded-full bg-white/10">
            <div
              ref={progressBarRef}
              className="h-full origin-left"
              style={{
                background: 'linear-gradient(90deg,#FFFFFF,#9CA3B0)',
                transformOrigin: '0 50%',
                transform: 'scaleX(0)',
                willChange: 'transform',
              }}
            />
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
