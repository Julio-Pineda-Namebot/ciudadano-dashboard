import { Icon, LogoMark } from '@/app/(landing)/_components/icons'

export const metadata = {
  title: 'Términos y Condiciones · Ciudadano',
  description:
    'Términos legales para reportar incidencias, adjuntar imágenes y compartir contenido en Ciudadano.',
}

type Section = {
  title: string
  body: string[]
}

const SECTIONS: Section[] = [
  {
    title: '1. Aceptación de los términos',
    body: [
      'Al marcar la casilla de aceptación y enviar un reporte a través de la plataforma Ciudadano, declaras haber leído, comprendido y aceptado plenamente los presentes términos y condiciones. Si no estás de acuerdo con cualquiera de las cláusulas, debes abstenerte de registrar incidencias.',
      'Estos términos podrán ser modificados en cualquier momento. La versión vigente será la publicada en esta página y aplicará a todos los reportes futuros realizados desde la fecha de su publicación.',
    ],
  },
  {
    title: '2. Veracidad de la información',
    body: [
      'El usuario se compromete a registrar únicamente incidencias reales, verificables y de las cuales haya sido testigo directo o cuente con evidencia razonable. La generación deliberada de reportes falsos, exagerados o malintencionados constituye una falta grave y puede acarrear responsabilidad civil y/o penal conforme a la legislación peruana vigente.',
      'Ciudadano se reserva el derecho de validar la información, suspender cuentas, eliminar reportes y, de ser necesario, poner los hechos en conocimiento de las autoridades competentes cuando se identifique mal uso de la plataforma.',
    ],
  },
  {
    title: '3. Contenido multimedia (imágenes y videos)',
    body: [
      'Al adjuntar una imagen o video a un reporte, el usuario garantiza que cuenta con todos los derechos necesarios sobre el contenido, que fue capturado por sí mismo o cuenta con autorización expresa de quien lo haya generado, y que su difusión no vulnera derechos de terceros.',
      'No se permite cargar contenido que: (a) muestre rostros identificables de menores de edad sin consentimiento de sus padres o tutores; (b) exhiba a víctimas en condiciones que afecten su dignidad; (c) contenga material violento, sexual, discriminatorio u ofensivo; (d) revele datos personales sensibles como placas, documentos de identidad, direcciones particulares o números telefónicos.',
      'El usuario otorga a Ciudadano una licencia no exclusiva, gratuita y revocable para almacenar, procesar, mostrar y difundir el contenido cargado, con la finalidad exclusiva de operar el servicio de reporte ciudadano y mejorar la seguridad de la comunidad.',
    ],
  },
  {
    title: '4. Geolocalización y datos personales',
    body: [
      'Para que un reporte sea válido se requiere fijar un punto en el mapa. Este dato se almacena junto con la incidencia y puede ser visualizado por otros usuarios de la plataforma en formato agregado y anónimo. No se publica información identificable del autor del reporte.',
      'El tratamiento de tus datos personales se realiza conforme a la Ley N° 29733 — Ley de Protección de Datos Personales y su reglamento. Puedes ejercer en cualquier momento tus derechos ARCO escribiendo a soporte@ciudadano.pe.',
    ],
  },
  {
    title: '5. Uso aceptable',
    body: [
      'Queda prohibido emplear la plataforma para: difundir spam, promociones comerciales, propaganda política, mensajes que inciten al odio, discriminación, violencia o cualquier actividad ilícita. Tampoco se permite utilizar herramientas automatizadas, bots o cuentas falsas para inflar el número de reportes.',
      'Cualquier intento de comprometer la seguridad del sistema, acceder a datos no autorizados o interferir con el funcionamiento normal del servicio será considerado una infracción grave y podrá derivar en acciones legales.',
    ],
  },
  {
    title: '6. Responsabilidad de Ciudadano',
    body: [
      'Ciudadano funciona como un agregador colaborativo de información ciudadana. No constituye un canal oficial de emergencias ni reemplaza a la Policía Nacional, Serenazgo, Bomberos o cualquier servicio público de respuesta. Para emergencias, comunícate siempre con la línea 105 o con la entidad competente.',
      'La plataforma se ofrece "tal cual está" y no garantiza disponibilidad ininterrumpida, ausencia de errores o resultados específicos derivados del uso de la información publicada.',
    ],
  },
  {
    title: '7. Moderación y eliminación de contenido',
    body: [
      'Nos reservamos el derecho de eliminar, ocultar o editar reportes y materiales adjuntos que incumplan estos términos, sin necesidad de aviso previo. En caso de reincidencia, podemos suspender de forma temporal o definitiva la cuenta del usuario.',
      'Si consideras que un reporte vulnera tus derechos o los términos aquí descritos, puedes solicitar su revisión escribiendo a moderacion@ciudadano.pe, adjuntando el enlace o identificador del reporte y la razón de tu solicitud.',
    ],
  },
  {
    title: '8. Legislación aplicable',
    body: [
      'Los presentes términos se rigen por las leyes de la República del Perú. Cualquier controversia derivada de su interpretación o aplicación será resuelta ante los tribunales competentes del distrito judicial de Ica, renunciando las partes a cualquier otro fuero que pudiera corresponderles.',
    ],
  },
]

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
          <div className="flex items-center gap-1.5 rounded-lg border border-[#E04B5E]/30 bg-[#E04B5E]/10 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#FF8A99]">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: '#E04B5E', boxShadow: '0 0 8px #E04B5E' }}
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
        <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-white/65">
          Última actualización: 27 de mayo de 2026. Estos términos regulan el uso del
          módulo de reportes ciudadanos de Ciudadano, incluyendo el registro de
          incidencias, la carga de fotografías o videos y la publicación de
          ubicaciones geográficas en el mapa colaborativo.
        </p>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/4 p-5 backdrop-blur-md sm:p-6">
          <div className="flex items-start gap-3">
            <div
              className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg"
              style={{
                background: 'rgba(217,165,94,0.15)',
                boxShadow: '0 0 18px rgba(217,165,94,0.25)',
              }}
            >
              <Icon name="pin" size={14} />
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
          {SECTIONS.map((section) => (
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

        <div className="mt-14 flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/4 p-6 text-center backdrop-blur-md">
          <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.3em] text-[#FF8A99]">
            <Icon name="x" size={12} />
            Sin retorno desde esta pestaña
          </div>
          <p className="max-w-md text-[13px] leading-relaxed text-white/65">
            Esta página es únicamente informativa. Para volver al reporte, cierra esta
            pestaña y regresa a la ventana original donde iniciaste el flujo.
          </p>
        </div>

        <footer className="mt-12 border-t border-white/8 pt-6 font-mono text-[10.5px] uppercase tracking-[0.25em] text-white/40">
          Ciudadano · Ica, Perú · soporte@ciudadano.pe
        </footer>
      </article>
    </main>
  )
}
