import type { ReactNode } from 'react';
import { Icon } from './icons';

type Plan = {
  name: string;
  price: string;
  sub: string;
  desc: string;
  cta: string;
  ctaTone: 'primary' | 'ghost';
  ctaHref: string;
  popular?: boolean;
  features: Array<[label: string, enabled: boolean]>;
};

const PLANS: Plan[] = [
  {
    name: 'Gratuito',
    price: 'S/ 0',
    sub: 'para siempre',
    desc: 'Para empezar a proteger tu cuadra hoy mismo.',
    cta: 'Crear cuenta gratis',
    ctaTone: 'ghost',
    ctaHref: '/login',
    features: [
      ['Mapa de incidencias', true],
      ['Reportar (5 al mes)', true],
      ['Ver cámaras públicas', true],
      ['1 comunidad vecinal', true],
      ['Recorrido seguro', false],
      ['Chat ilimitado', false],
    ],
  },
  {
    name: 'Premium',
    price: 'S/ 15',
    sub: 'por mes',
    desc: 'La experiencia completa para vecinos comprometidos.',
    cta: 'Comenzar Premium',
    ctaTone: 'primary',
    ctaHref: '/login',
    popular: true,
    features: [
      ['Todo lo del plan Gratuito', true],
      ['Reportes ilimitados', true],
      ['Recorrido seguro', true],
      ['Chat vecinal ilimitado', true],
      ['Alertas prioritarias', true],
      ['Hasta 5 comunidades', true],
    ],
  },
  {
    name: 'Comunidad',
    price: 'S/ 120',
    sub: 'por mes',
    desc: 'Para juntas vecinales y residenciales completas.',
    cta: 'Contactar ventas',
    ctaTone: 'ghost',
    ctaHref: '#contact',
    features: [
      ['Licencia Premium x20 personas', true],
      ['Panel de admin vecinal', true],
      ['Comunidades ilimitadas', true],
      ['Estadísticas de seguridad', true],
      ['Canal directo con PNP', true],
      ['Soporte prioritario', true],
    ],
  },
];

function PriceFeature({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  return (
    <li
      className={`flex items-start gap-3 text-[14px] ${
        enabled ? 'text-white/85' : 'text-white/30 line-through decoration-white/15'
      }`}
    >
      <div
        className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full ${
          enabled ? 'bg-white/15 text-white' : 'bg-white/5 text-white/25'
        }`}
      >
        <Icon name={enabled ? 'check' : 'x'} size={10} stroke={2.4} />
      </div>
      <span>{children}</span>
    </li>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="relative py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <div className="mb-10 text-center sm:mb-16">
          <div className="reveal landing-chip mx-auto">
            <span className="landing-dot" /> PLANES
          </div>
          <h2 className="reveal reveal-delay-1 mx-auto mt-5 max-w-[820px] font-display text-[32px] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[44px] lg:text-[58px]">
            <span className="gradient-text">Empieza gratis. </span>
            <span className="gradient-text-accent italic">Crece cuando quieras</span>
            <span className="gradient-text">.</span>
          </h2>
          <p className="reveal reveal-delay-2 mx-auto mt-5 max-w-[560px] text-[15px] text-white/55">
            Sin contratos. Sin sorpresas. Cancela cuando quieras.
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
          {PLANS.map((p, i) => {
            const pop = p.popular ?? false;
            return (
              <div
                key={p.name}
                className={`reveal reveal-delay-${i} relative flex flex-col rounded-3xl p-7 ${
                  pop ? 'glow-card border-0 lg:scale-[1.04] lg:py-9' : 'border border-white/7 bg-white/2'
                }`}
                style={
                  pop
                    ? {
                        background:
                          'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(180,184,194,0.05) 30%, rgba(11,15,28,0.9) 80%)',
                      }
                    : undefined
                }
              >
                {pop && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div
                      className="rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest"
                      style={{
                        background: 'linear-gradient(180deg,#FFFFFF,#CCCCCC)',
                        color: '#03121A',
                        boxShadow: '0 0 24px -2px rgba(255,255,255,0.7)',
                      }}
                    >
                      ★ Más Popular
                    </div>
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between">
                    <div className="font-display text-[16px] font-medium tracking-tight text-white/85">{p.name}</div>
                    {pop && <Icon name="sparkle" size={16} className="text-white" />}
                  </div>
                  <div className="mt-5 flex items-baseline gap-2">
                    <div className="font-display text-[56px] font-semibold leading-none tracking-[-0.03em]">{p.price}</div>
                    <div className="text-[13px] text-white/55">{p.sub}</div>
                  </div>
                  <p className="mt-3 max-w-[300px] text-[13.5px] text-white/55">{p.desc}</p>
                </div>

                <ul className="mt-7 space-y-3">
                  {p.features.map(([f, on]) => (
                    <PriceFeature key={f} enabled={on}>
                      {f}
                    </PriceFeature>
                  ))}
                </ul>

                <div className="mt-8 flex-1" />
                <a
                  href={p.ctaHref}
                  className={`landing-btn h-12 w-full text-[14px] ${
                    p.ctaTone === 'primary' ? 'landing-btn-primary' : 'landing-btn-ghost'
                  }`}
                >
                  {p.cta} <Icon name="arrow" size={14} />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
