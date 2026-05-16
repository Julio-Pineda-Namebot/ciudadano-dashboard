import { Icon } from './icons';

export function FinalCTA() {
  return (
    <section id="contact" className="relative py-28">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="reveal relative overflow-hidden rounded-[32px] border border-white/8 px-8 py-20 text-center sm:px-16">
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                'radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.25), transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(180,184,194,0.25), transparent 60%), linear-gradient(180deg, rgba(11,15,28,0.95), rgba(5,7,15,1))',
            }}
          />
          <div className="grid-bg absolute inset-0 -z-10 opacity-30" />

          {Array.from({ length: 14 }).map((_, i) => {
            const color = i % 3 === 0 ? '#FFFFFF' : i % 3 === 1 ? '#9CA3B0' : '#D9A55E';
            return (
              <span
                key={i}
                className="float-slow absolute rounded-full"
                style={{
                  left: `${(i * 73) % 100}%`,
                  top: `${(i * 41) % 100}%`,
                  width: 2 + (i % 4),
                  height: 2 + (i % 4),
                  background: color,
                  boxShadow: `0 0 12px ${color}`,
                  opacity: 0.5,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            );
          })}

          <div className="landing-chip mx-auto">
            <span className="landing-dot" /> CIUDADANO · DISPONIBLE EN PERÚ
          </div>
          <h2 className="mx-auto mt-6 max-w-[860px] font-display text-[44px] font-semibold leading-none tracking-[-0.03em] sm:text-[72px]">
            <span className="gradient-text">Empieza a proteger </span>
            <span className="gradient-text-accent italic">tu comunidad</span>{' '}
            <span className="gradient-text">hoy.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[520px] text-[16px] text-white/65">
            Únete a más de 142,000 vecinos que ya viven en una ciudad más conectada y vigilante.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a href="/login" className="landing-btn landing-btn-primary h-12 px-6 text-[14.5px]">
              Iniciar sesión <Icon name="arrow" size={14} />
            </a>
            <a href="#voices" className="landing-btn landing-btn-ghost h-12 px-6 text-[14.5px]">
              Hablar con tu junta vecinal
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-white/45">
            <div className="flex items-center gap-2 text-[12px]">
              <Icon name="apple" size={16} /> App Store
            </div>
            <div className="h-3 w-px bg-white/15" />
            <div className="flex items-center gap-2 text-[12px]">
              <Icon name="google" size={16} /> Google Play
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
