import { MapPin } from 'lucide-react'
import { LogoMark } from '@/app/(landing)/_components/icons'
import { TERMS_INTRO, TERMS_SECTIONS } from '@/app/(landing)/terms/TermsContent'

export const metadata = {
  title: 'Términos y Condiciones · Ciudadano',
  description:
    'Términos legales para reportar incidencias, adjuntar imágenes y compartir contenido en Ciudadano.',
}

export default function TermsPage() {
  return (
    <main className="relative min-h-screen text-white">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse at 0% 0%, rgba(255,255,255,0.05), transparent 55%), radial-gradient(ellipse at 100% 100%, rgba(217,165,94,0.06), transparent 55%), linear-gradient(180deg, rgba(11,15,28,0.95), rgba(5,7,15,1))',
        }}
      />

      <header className="sticky top-0 z-20 border-b border-white/8 bg-black/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4 sm:px-8">
          <div className="flex items-center gap-2">
            <LogoMark size={22} />
            <span className="font-display text-[14px] font-semibold tracking-tight">
              Ciudadano
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-white/12 bg-white/4 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/55">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: '#D9A55E', boxShadow: '0 0 8px #D9A55E' }}
            />
            Solo lectura
          </div>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-12 sm:px-8 sm:py-16">
        <div className="eyebrow">Legal · Reportes ciudadanos</div>
        <h1 className="mt-4 font-display text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[44px]">
          <span className="gradient-text">Términos y </span>
          <span className="gradient-text-accent italic">Condiciones</span>
        </h1>
        <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-white/65">{TERMS_INTRO}</p>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/4 p-5 backdrop-blur-md sm:p-6">
          <div className="flex items-start gap-3">
            <div
              className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg"
              style={{
                background: 'rgba(217,165,94,0.15)',
                boxShadow: '0 0 18px rgba(217,165,94,0.25)',
              }}
            >
              <MapPin size={14} />
            </div>
            <p className="text-[13px] leading-relaxed text-white/75">
              Lee con atención cada cláusula. Al marcar la casilla
              <span className="text-white"> &ldquo;Acepto los términos y condiciones&rdquo; </span>
              en el formulario de reporte, manifiestas tu conformidad expresa con
              todo lo aquí descrito, incluyendo el tratamiento de imágenes, la
              veracidad de la información y la geolocalización de la incidencia.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-10">
          {TERMS_SECTIONS.map((section) => (
            <section key={section.title} className="flex flex-col gap-3">
              <h2 className="font-display text-[20px] font-semibold tracking-tight text-white sm:text-[22px]">
                {section.title}
              </h2>
              <div className="flex flex-col gap-3">
                {section.body.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-[13.5px] leading-[1.75] text-white/70"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-12 border-t border-white/8 pt-6 font-mono text-[10.5px] uppercase tracking-[0.25em] text-white/40">
          Ciudadano · Ica, Perú · soporte@ciudadano.pe
        </footer>
      </article>
    </main>
  )
}
