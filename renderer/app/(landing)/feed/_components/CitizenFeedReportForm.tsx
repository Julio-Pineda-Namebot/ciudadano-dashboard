'use client'

import { useEffect, useState, type RefObject } from 'react'
import { ArrowRight, Camera, Check, X } from 'lucide-react'
import { CitizenFeedTermsSheet } from './CitizenFeedTermsSheet'
import { TYPE_COLOR, TYPE_LABEL } from '@/app/(landing)/feed/constants'
import type { IncidentType, RoutePoint } from '@/app/(landing)/feed/_types/types'

interface CitizenFeedReportFormProps {
  formRef: RefObject<HTMLFormElement | null>
  action: (formData: FormData) => void
  pending: boolean
  selected: RoutePoint | null
  onClearSelected: () => void
  resetSignal: number
}

/**
 * Renders the "Reportar · Mi cuadra" incident report form and manages its local UI state.
 *
 * The form includes incident type selection, description, location (hidden latitude/longitude),
 * an image/video uploader (required for all types except `robo`), a terms acceptance checkbox,
 * and a submit button that is disabled until a location is selected and terms are accepted.
 *
 * @param formRef - Ref forwarded to the native `<form>` element.
 * @param action - Submit handler used as the form `action`.
 * @param pending - When true, disables submission and shows a pending label.
 * @param selected - Currently chosen map point; its `lat`/`lon` populate hidden inputs and
 *                   enable the submit button when present.
 * @param onClearSelected - Callback invoked to clear the selected location.
 * @param resetSignal - Incrementing signal from the parent used to clear component-local state
 *                      (media preview, incident type, terms checkbox) after the parent performs
 *                      a successful native form reset.
 * @returns The rendered JSX for the report form.
 */
export function CitizenFeedReportForm({
  formRef,
  action,
  pending,
  selected,
  onClearSelected,
  resetSignal,
}: CitizenFeedReportFormProps) {
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [incidentType, setIncidentType] = useState<IncidentType | ''>('')

  // El parent incrementa resetSignal tras un reporte exitoso (y resetea el form
  // nativo); aquí limpiamos el estado local que el reset nativo no controla.
  useEffect(() => {
    if (resetSignal > 0) {
      setMediaPreview(null)
      setTermsAccepted(false)
      setIncidentType('')
    }
  }, [resetSignal])

  // La imagen es obligatoria salvo para robo (accidente y vandalismo la requieren).
  const mediaRequired = incidentType !== 'robo'

  return (
    <>
      <div>
        <div className="eyebrow">Reportar · Mi cuadra</div>
        <h1 className="mt-3 font-display text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[28px]">
          <span className="gradient-text">Registra una </span>
          <span className="gradient-text-accent italic">incidencia</span>
        </h1>
        <p className="mt-2 text-[13px] text-white/55">
          Toca un punto del mapa para marcar la ubicación. Luego describe lo ocurrido.
        </p>
      </div>

      <form ref={formRef} action={action} className="flex flex-col gap-4">
        <input type="hidden" name="latitude" value={selected?.lat ?? ''} />
        <input type="hidden" name="longitude" value={selected?.lon ?? ''} />

        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-white/55">
            Tipo
          </span>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(TYPE_LABEL) as IncidentType[]).map((t) => (
              <label
                key={t}
                className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/4 px-2 py-2.5 text-[12.5px] text-white/70 transition hover:bg-white/8 has-[input:checked]:border-white/40 has-[input:checked]:bg-white/10 has-[input:checked]:text-white"
              >
                <input
                  type="radio"
                  name="incident_type"
                  value={t}
                  required
                  className="sr-only"
                  onChange={() => setIncidentType(t)}
                />
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: TYPE_COLOR[t], boxShadow: `0 0 8px ${TYPE_COLOR[t]}` }}
                />
                {TYPE_LABEL[t]}
              </label>
            ))}
          </div>
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-white/55">
            Descripción
          </span>
          <textarea
            name="description"
            required
            minLength={10}
            maxLength={191}
            placeholder="Describe brevemente lo que ocurrió (10–191 caracteres)…"
            rows={4}
            className="w-full resize-none rounded-xl border border-white/10 bg-white/4 px-3 py-2.5 text-[13.5px] text-white placeholder:text-white/30 outline-none transition focus:border-white/30 focus:bg-white/8"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-white/55">
            Ubicación
          </span>
          <div className="rounded-xl border border-white/10 bg-white/4 px-3 py-2.5 text-[12.5px]">
            {selected ? (
              <div className="flex items-center justify-between gap-3">
                <div className="font-mono text-white/85">
                  {selected.lat.toFixed(5)}, {selected.lon.toFixed(5)}
                </div>
                <button
                  type="button"
                  onClick={onClearSelected}
                  className="text-white/40 transition hover:text-white"
                  aria-label="Limpiar ubicación"
                >
                  <X size={13} />
                </button>
              </div>
            ) : (
              <span className="text-white/40">Toca el mapa para seleccionar un punto.</span>
            )}
          </div>
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-white/55">
            Foto o video{incidentType === 'robo' && <span className="text-white/35"> (opcional)</span>}
          </span>
          <div className="relative flex items-center gap-3 rounded-xl border border-dashed border-white/15 bg-white/3 px-3 py-3">
            <input
              type="file"
              name="multimedia"
              accept="image/*,video/*"
              required={mediaRequired}
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) {
                  setMediaPreview(null)
                  return
                }
                if (file.type.startsWith('image/')) {
                  setMediaPreview(URL.createObjectURL(file))
                } else {
                  setMediaPreview(null)
                }
              }}
            />
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/8 text-white/80">
              <Camera size={15} />
            </div>
            <div className="flex-1 text-[12.5px] text-white/55">
              {mediaPreview
                ? 'Archivo listo'
                : mediaRequired
                  ? 'Adjunta una foto o video del incidente'
                  : 'Adjunta una foto o video (opcional para robo)'}
            </div>
            {mediaPreview && (
              <img
                src={mediaPreview}
                alt="preview"
                className="h-10 w-10 rounded-md object-cover ring-1 ring-white/15"
              />
            )}
          </div>
        </label>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/4 px-3 py-3 transition hover:bg-white/6 has-[input:checked]:border-white/30 has-[input:checked]:bg-white/8">
          <input
            type="checkbox"
            name="terms_accepted"
            required
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="peer sr-only"
          />
          <span
            aria-hidden
            className="mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] border border-white/25 bg-white/5 transition peer-checked:border-[#D9A55E] peer-checked:bg-[#D9A55E] peer-checked:shadow-[0_0_12px_rgba(217,165,94,0.55)]"
          >
            {termsAccepted && <Check size={11} />}
          </span>
          <span className="text-[12.5px] leading-relaxed text-white/75">
            Acepto los <CitizenFeedTermsSheet />{' '}
            sobre veracidad del reporte, uso de imágenes y geolocalización.
          </span>
        </label>

        <button
          type="submit"
          disabled={pending || !selected || !termsAccepted}
          className="landing-btn landing-btn-primary mt-1 h-12 w-full text-[14px] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? 'Reportando…' : <>Reportar <ArrowRight size={14} /></>}
        </button>
      </form>
    </>
  )
}
