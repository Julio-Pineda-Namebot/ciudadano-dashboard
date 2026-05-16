import { Icon, LogoMark } from './icons';

const COLUMNS: Array<[heading: string, items: string[]]> = [
  ['Producto', ['Funciones', 'Mapa', 'Planes', 'Cambios']],
  ['Comunidad', ['Vecinos', 'Juntas', 'Aliados', 'Blog']],
];

const SOCIALS = ['twitter', 'instagram', 'linkedin'] as const;

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#040611] pt-16 pb-10">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <LogoMark size={28} />
              <span className="font-display text-[18px] font-semibold tracking-tight">Ciudadano</span>
            </div>
            <p className="mt-4 max-w-[320px] text-[13.5px] text-white/55">
              Tu comunidad más segura, unida y vigilante. Hecho en Lima, con vecinos para vecinos.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-lg bg-white/4 text-white/70 ring-1 ring-white/10 transition hover:bg-white/8 hover:text-white"
                  aria-label={s}
                >
                  <Icon name={s} size={14} />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map(([heading, items]) => (
            <div key={heading}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-white/40">{heading}</div>
              <ul className="mt-4 space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-[13.5px] text-white/70 transition hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 text-[12px] text-white/40 md:flex-row">
          <span>© 2026 Ciudadano. Todos los derechos reservados.</span>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-white/70">Privacidad</a>
            <a href="#" className="hover:text-white/70">Términos</a>
            <a href="#" className="hover:text-white/70">Estado</a>
            <span className="flex items-center gap-1.5">
              <span className="landing-dot" style={{ background: '#6BAE7A', boxShadow: '0 0 10px #6BAE7A' }} />
              Operativo
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
