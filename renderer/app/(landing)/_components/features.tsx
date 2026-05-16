'use client';

import { useRef, type MouseEvent, type ReactNode } from 'react';
import { Icon } from './icons';

type IconName = Parameters<typeof Icon>[0]['name'];

type CardProps = {
  icon: IconName;
  title: string;
  body: string;
  accent?: string;
  big?: boolean;
  children?: ReactNode;
};

function FeatureCard({ icon, title, body, accent = '#FFFFFF', big = false, children }: CardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={`feature group relative rounded-2xl border border-white/7 bg-white/2 p-6 ${big ? 'lg:p-7' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div
          className="grid h-11 w-11 place-items-center rounded-xl"
          style={{ background: `${accent}18`, color: accent, boxShadow: `inset 0 0 0 1px ${accent}33` }}
        >
          <Icon name={icon} size={18} />
        </div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-white/30">Función</div>
      </div>
      <div className="mt-6">
        <h3 className="font-display text-[22px] font-semibold tracking-tight text-white">{title}</h3>
        <p className="mt-2 max-w-[340px] text-[14px] leading-relaxed text-white/55">{body}</p>
      </div>
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}

export function Features() {
  return (
    <section id="features" className="relative mt-[20vh] py-16 sm:py-20 md:mt-[60vh] lg:mt-[100vh] lg:py-28">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <div className="mb-10 flex flex-col items-start gap-5 sm:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="reveal landing-chip">
              <span className="landing-dot" /> FUNCIONES
            </div>
            <h2 className="reveal reveal-delay-1 mt-5 max-w-[720px] font-display text-[32px] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[44px] lg:text-[56px]">
              <span className="gradient-text">Una sola app para </span>
              <span className="gradient-text-accent">protegerlo todo</span>
              <span className="gradient-text">.</span>
            </h2>
          </div>
          <p className="reveal reveal-delay-2 max-w-[420px] text-[15px] text-white/55">
            La fuerza de tu vecindario, en una sola app. Cada función diseñada para que vivas, transites y duermas tranquilo.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div className="reveal lg:col-span-2">
            <FeatureCard
              big
              icon="siren"
              accent="#E04B5E"
              title="Reporte de incidencias"
              body="Reporta robos, vandalismo o situaciones de riesgo en menos de 8 segundos. Tu cuadra entera lo sabrá en tiempo real."
            >
              <div className="grid grid-cols-4 gap-2">
                {['Robo', 'Sospechoso', 'Accidente', 'Vandalismo'].map((t) => (
                  <div
                    key={t}
                    className="rounded-lg border border-white/10 bg-white/3 px-2.5 py-2 text-center text-[11px] text-white/70"
                  >
                    {t}
                  </div>
                ))}
              </div>
            </FeatureCard>
          </div>

          <div className="reveal reveal-delay-1">
            <FeatureCard
              icon="bell"
              accent="#D9A55E"
              title="Alertas en tiempo real"
              body="Notificaciones push verificadas por la comunidad. Solo lo que necesitas saber, cuando lo necesitas saber."
            >
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/3 p-2">
                <span className="landing-dot" style={{ background: '#D9A55E', boxShadow: '0 0 10px #D9A55E' }} />
                <div className="text-[11.5px] text-white/75">Alerta cercana · 320 m</div>
                <div className="ml-auto font-mono text-[10px] text-white/40">2 min</div>
              </div>
            </FeatureCard>
          </div>

          <div className="reveal">
            <FeatureCard
              icon="chat"
              accent="#FFFFFF"
              title="Chat vecinal"
              body="Comunicación cifrada con tu junta vecinal y serenazgo. Verificada, sin spam."
            >
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <div
                    className="h-5 w-5 shrink-0 rounded-full"
                    style={{ background: 'linear-gradient(135deg,#9CA3B0,#FFFFFF)' }}
                  />
                  <div className="rounded-lg bg-white/4 px-2 py-1 text-[11px] text-white/80">
                    Vi a alguien sospechoso en Berlín
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <div className="rounded-lg bg-white/15 px-2 py-1 text-[11px] text-white">Voy a verificar</div>
                </div>
              </div>
            </FeatureCard>
          </div>

          <div className="reveal reveal-delay-1 lg:col-span-2">
            <FeatureCard
              big
              icon="route"
              accent="#9CA3B0"
              title="Recorrido seguro"
              body="Caminos sugeridos por los reportes vecinales recientes. Evita zonas con incidencias activas."
            >
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-[10px] text-white/60">A</div>
                <div className="flex-1 border-t border-dashed border-white/20" />
                <div className="rounded-full bg-[#6BAE7A]/15 px-2 py-0.5 text-[10px] text-[#B8D6BC]">+12% más seguro</div>
                <div className="flex-1 border-t border-dashed border-white/20" />
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-[10px] text-white">B</div>
              </div>
            </FeatureCard>
          </div>

          <div className="reveal reveal-delay-2">
            <FeatureCard
              icon="camera"
              accent="#B8D6BC"
              title="Cámaras públicas"
              body="Acceso autorizado a CCTV pública integrada con la municipalidad y serenazgo."
            >
              <div className="grid grid-cols-3 gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="aspect-square overflow-hidden rounded-md bg-linear-to-br from-[#0E1530] to-[#070A18] ring-1 ring-white/10"
                  >
                    <div
                      className="h-full w-full"
                      style={{ background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 6px)' }}
                    />
                  </div>
                ))}
              </div>
            </FeatureCard>
          </div>

          <div className="reveal reveal-delay-2 lg:col-span-2">
            <FeatureCard
              big
              icon="users"
              accent="#FFFFFF"
              title="Comunidades privadas"
              body="Tu edificio, tu manzana o tu junta vecinal. Espacios cifrados de coordinación."
            >
              <div className="flex items-center -space-x-2">
                {['#FFFFFF', '#9CA3B0', '#D9A55E', '#6BAE7A', '#E04B5E'].map((c, i) => (
                  <div
                    key={i}
                    className="h-7 w-7 rounded-full ring-2 ring-[#0B0F1C]"
                    style={{ background: `linear-gradient(135deg, ${c}, ${c}99)` }}
                  />
                ))}
                <div className="ml-3 text-[11px] text-white/60">+ 38 vecinos</div>
              </div>
            </FeatureCard>
          </div>

          <div className="reveal reveal-delay-3 md:col-span-2 lg:col-span-3">
            <FeatureCard
              big
              icon="chart"
              accent="#FFFFFF"
              title="Estadísticas de seguridad"
              body="Reportes mensuales con tendencias, mapas de calor y comparativas por distrito. Decisiones basadas en datos."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-white/2 p-4">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-white/40">incidencias / semana</div>
                  <div className="mt-3 flex items-end gap-1.5">
                    {[40, 52, 38, 60, 45, 28, 32, 22, 18, 14, 12, 10].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm"
                        style={{
                          height: h,
                          background: `linear-gradient(180deg, rgba(255,255,255,${0.3 + i * 0.05}), rgba(255,255,255,0.15))`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="mt-3 text-[12px] text-[#B8D6BC]">↓ 38% vs. mes anterior</div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/2 p-4">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-white/40">distribución de reportes</div>
                  <div className="mt-3 space-y-2">
                    {([
                      ['Robos', '#E04B5E', 62],
                      ['Sospechosos', '#D9A55E', 24],
                      ['Vandalismo', '#9CA3B0', 9],
                      ['Otros', '#FFFFFF', 5],
                    ] as const).map(([k, c, p]) => (
                      <div key={k}>
                        <div className="flex items-center justify-between text-[11px] text-white/70">
                          <span>{k}</span>
                          <span className="font-mono text-white/45">{p}%</span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${p}%`, background: c, boxShadow: `0 0 12px ${c}66` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/2 p-4">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-white/40">cobertura por zona</div>
                  <div className="mt-3 grid grid-cols-8 gap-1">
                    {Array.from({ length: 32 }).map((_, i) => {
                      const intensity = Math.max(0, Math.min(1, (Math.sin(i * 1.3) + 1) / 2));
                      return (
                        <div
                          key={i}
                          className="aspect-square rounded-sm"
                          style={{ background: `rgba(255,255,255, ${0.08 + intensity * 0.55})` }}
                        />
                      );
                    })}
                  </div>
                  <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-white/40">
                    <span>Bajo</span>
                    <span>Alto</span>
                  </div>
                </div>
              </div>
            </FeatureCard>
          </div>
        </div>
      </div>
    </section>
  );
}
