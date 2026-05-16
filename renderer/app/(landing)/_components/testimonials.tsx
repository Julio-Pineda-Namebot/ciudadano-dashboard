import { Icon } from './icons';

const ITEMS = [
  {
    name: 'Lucía Mendoza',
    role: 'Vecina · San Borja',
    quote:
      'En tres meses bajaron los reportes de robos en mi cuadra. Cuando algo pasa, todos nos enteramos al instante.',
    avatar: '#FFFFFF',
  },
  {
    name: 'Carlos Quispe',
    role: 'Administrador vecinal · Surco',
    quote: 'Coordinar con serenazgo dejó de ser un dolor. El panel de admin nos dio orden y datos reales para la junta.',
    avatar: '#9CA3B0',
  },
  {
    name: 'Junta Residencial Pardo',
    role: 'Miraflores',
    quote: 'Los vecinos se sienten escuchados. Ya no dependemos solo del grupo de WhatsApp para saber lo que pasa.',
    avatar: '#D9A55E',
  },
  {
    name: 'Andrea Ríos',
    role: 'Vecina · San Isidro',
    quote: 'La ruta segura me salvó dos veces. Es como tener radar para evitar lo malo antes de toparte con ello.',
    avatar: '#6BAE7A',
  },
  {
    name: 'Diego Vargas',
    role: 'Junta Vecinal Salaverry',
    quote: 'Pasamos de la queja al dato. Reportamos a la municipalidad con evidencia, gráficos y mapas.',
    avatar: '#C58999',
  },
  {
    name: 'Patricia León',
    role: 'Vecina · Magdalena',
    quote: 'Por fin una app que respeta mi privacidad y al mismo tiempo me hace sentir parte de algo más grande.',
    avatar: '#B8D6BC',
  },
];

export function Testimonials() {
  return (
    <section id="voices" className="relative py-28">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="mb-14 max-w-[760px]">
          <div className="reveal landing-chip">
            <span className="landing-dot" /> COMUNIDAD
          </div>
          <h2 className="reveal reveal-delay-1 mt-5 font-display text-[44px] font-semibold leading-[1.02] tracking-[-0.02em] sm:text-[58px]">
            <span className="gradient-text">Lo que dicen </span>
            <span className="gradient-text-accent italic">los vecinos</span>
            <span className="gradient-text">.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((t, i) => (
            <div
              key={t.name}
              className={`reveal reveal-delay-${(i % 4) + 1} group relative overflow-hidden rounded-2xl border border-white/7 bg-white/2 p-6 transition hover:border-white/15`}
            >
              <Icon name="quote" size={18} className="text-white/15" />
              <p className="mt-3 text-[14.5px] leading-relaxed text-white/80">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3">
                <div
                  className="h-9 w-9 rounded-full ring-2 ring-[#0B0F1C]"
                  style={{
                    background: `linear-gradient(135deg, ${t.avatar}, ${t.avatar}88)`,
                    boxShadow: `0 0 24px -8px ${t.avatar}`,
                  }}
                />
                <div>
                  <div className="text-[13px] font-medium text-white">{t.name}</div>
                  <div className="text-[11.5px] text-white/45">{t.role}</div>
                </div>
                <div className="ml-auto flex gap-0.5 text-white">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Icon key={s} name="star" size={11} stroke={1} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
