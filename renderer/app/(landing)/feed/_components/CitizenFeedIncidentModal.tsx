'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Copy, MessageCircle, Share2, ThumbsDown, ThumbsUp, X } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'
import type {
  IncidentStatus,
  IncidentVote,
  VerifiedBy,
} from '@/lib/incidentStatus'
import { addComment, getIncidentDetail, voteIncident } from '@/app/(landing)/feed/actions'
import { TYPE_COLOR, TYPE_LABEL } from '@/app/(landing)/feed/constants'
import type {
  IncidentComment,
  IncidentDetail,
} from '@/app/(landing)/feed/_types/types'

interface CitizenFeedIncidentModalProps {
  incidentId: string | null
  onClose: () => void
}

const VIDEO_RE = /\.(mp4|mov|webm|m4v)(\?|$)/i

// Pill de estado en tono oscuro, alineado con la paleta de la landing
// (good #6BAE7A, warn #D9A55E, slate). El StatusBadge global usa fondos
// claros pensados para la grilla admin y desentona sobre el modal.
function statusPill(status: IncidentStatus, verifiedBy?: VerifiedBy | null) {
  if (status === 'verificado') {
    const label =
      verifiedBy === 'seguridad'
        ? 'Verificado por seguridad'
        : verifiedBy === 'ciudadania'
          ? 'Verificado por la ciudadanía'
          : 'Verificado'
    return {
      label,
      dot: '#6BAE7A',
      classes: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200',
    }
  }
  if (status === 'resuelto') {
    return {
      label: 'Resuelto',
      dot: '#9CA3B0',
      classes: 'border-white/15 bg-white/8 text-white/70',
    }
  }
  return {
    label: 'Pendiente',
    dot: '#D9A55E',
    classes: 'border-[#D9A55E]/30 bg-[#D9A55E]/12 text-[#E4B978]',
  }
}

export function CitizenFeedIncidentModal({
  incidentId,
  onClose,
}: CitizenFeedIncidentModalProps) {
  const open = incidentId !== null

  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState<IncidentDetail | null>(null)
  const [comments, setComments] = useState<IncidentComment[]>([])
  const [commentBody, setCommentBody] = useState('')
  const [voting, startVote] = useTransition()
  const [commenting, startComment] = useTransition()
  const lastLoadedId = useRef<string | null>(null)

  useEffect(() => {
    if (!incidentId) return
    lastLoadedId.current = incidentId
    // Reset síncrono al abrir otra incidencia: muestra el spinner y limpia el
    // detalle anterior antes del fetch. Es la sincronización esperada con la API.
    /* eslint-disable react-hooks/set-state-in-effect */
    setLoading(true)
    setDetail(null)
    setComments([])
    setCommentBody('')
    /* eslint-enable react-hooks/set-state-in-effect */
    getIncidentDetail(incidentId)
      .then((res) => {
        // Evita pisar el estado si el usuario abrió otra incidencia entre tanto.
        if (lastLoadedId.current !== incidentId) return
        setDetail(res)
        setComments(res?.comments ?? [])
      })
      .finally(() => {
        if (lastLoadedId.current === incidentId) setLoading(false)
      })
  }, [incidentId])

  const handleVote = (vote: IncidentVote) => {
    if (!detail) return
    const nextVote: IncidentVote | null = detail.myVote === vote ? null : vote
    startVote(async () => {
      const res = await voteIncident(detail.id, nextVote)
      if ('error' in res) {
        toast.error(res.error)
        return
      }
      setDetail((prev) =>
        prev
          ? {
              ...prev,
              confirmCount: res.confirmCount,
              disputeCount: res.disputeCount,
              myVote: nextVote,
              // El estado solo cambia cuando se registra un voto (no al quitarlo).
              ...(nextVote !== null
                ? { status: res.status, verifiedBy: res.verifiedBy }
                : {}),
            }
          : prev
      )
    })
  }

  const handleComment = () => {
    if (!detail) return
    const body = commentBody.trim()
    if (!body) return
    startComment(async () => {
      const res = await addComment(detail.id, body)
      if ('error' in res) {
        toast.error(res.error)
        return
      }
      setComments((prev) => [...prev, res.comment])
      setCommentBody('')
      toast.success('Comentario publicado')
    })
  }

  const shareUrl =
    detail && typeof window !== 'undefined'
      ? `${window.location.origin}/feed?incident=${detail.id}`
      : ''

  const handleWhatsApp = () => {
    if (!detail) return
    const text = `Incidencia (${TYPE_LABEL[detail.incidentType]}) reportada en Ciudadano: ${detail.description}`
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}`,
      '_blank'
    )
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Enlace copiado')
    } catch {
      toast.error('No se pudo copiar el enlace')
    }
  }

  const isVideo = detail?.multimediaUrl && VIDEO_RE.test(detail.multimediaUrl)

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        showCloseButton={false}
        dismissible={false}
        className="flex max-h-[88vh] w-[calc(100vw-2rem)] max-w-6xl sm:max-w-6xl flex-col gap-0 overflow-hidden border-white/10 bg-[#0b0f1c] p-0 text-white"
      >
        {/* Encabezado fijo con cierre solo por la X */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-6 py-4">
          <DialogTitle className="text-white">Detalle de la incidencia</DialogTitle>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="grid size-8 place-items-center rounded-md text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <X className="size-4" />
          </button>
        </div>

        {loading || !detail ? (
          <div className="flex items-center justify-center gap-2 px-6 py-16 text-white/60">
            <Spinner />
            <span>Cargando…</span>
          </div>
        ) : (
          <div
            data-lenis-prevent
            className="dark-scroll flex-1 min-h-0 overflow-y-auto md:grid md:grid-cols-2 md:grid-rows-1 md:overflow-hidden"
          >
            {/* Columna izquierda: detalle */}
            <div
              data-lenis-prevent
              className="dark-scroll min-w-0 px-6 py-4 md:min-h-0 md:overflow-y-auto md:border-r md:border-white/10"
            >
              {detail.multimediaUrl && (
                <div className="mb-4 overflow-hidden rounded-lg border border-white/10 bg-black/40">
                  {isVideo ? (
                    <video src={detail.multimediaUrl} controls className="h-56 w-full object-cover" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={detail.multimediaUrl} alt="Evidencia" className="h-56 w-full object-cover" />
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center gap-1.5 text-sm font-semibold"
                  style={{ color: TYPE_COLOR[detail.incidentType] }}
                >
                  <span
                    className="inline-block size-2 rounded-full"
                    style={{
                      background: TYPE_COLOR[detail.incidentType],
                      boxShadow: `0 0 8px ${TYPE_COLOR[detail.incidentType]}`,
                    }}
                  />
                  {TYPE_LABEL[detail.incidentType]}
                </span>
                {(() => {
                  const pill = statusPill(detail.status, detail.verifiedBy)
                  return (
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
                        pill.classes
                      )}
                    >
                      <span
                        className="size-1.5 rounded-full"
                        style={{ background: pill.dot }}
                      />
                      {pill.label}
                    </span>
                  )
                })()}
              </div>

              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
                {new Date(detail.createdAt).toLocaleString('es-PE')}
              </p>

              <p className="mt-3 text-sm leading-relaxed wrap-break-word text-white/90">{detail.description}</p>

              {/* Validación comunitaria */}
              <div className="mt-4 rounded-xl border border-white/10 bg-white/2.5 p-3.5">
                <div className="flex items-center gap-4 text-xs text-white/55">
                  <span className="inline-flex items-center gap-1.5">
                    <ThumbsUp className="size-3.5 text-[#6BAE7A]" />
                    <span className="font-semibold text-white/80">{detail.confirmCount}</span>
                    {detail.confirmCount === 1 ? 'confirmación' : 'confirmaciones'}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ThumbsDown className="size-3.5 text-[#E04B5E]" />
                    <span className="font-semibold text-white/80">{detail.disputeCount}</span>
                    {detail.disputeCount === 1 ? 'no lo encontró' : 'no lo encontraron'}
                  </span>
                </div>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    disabled={voting}
                    onClick={() => handleVote('confirm')}
                    className={cn(
                      'inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/3 px-4 py-2.5 text-sm font-medium text-white/80 transition-colors',
                      'hover:border-[#6BAE7A]/40 hover:bg-[#6BAE7A]/10 hover:text-white',
                      'disabled:cursor-not-allowed disabled:opacity-50',
                      detail.myVote === 'confirm' &&
                        'border-[#6BAE7A]/50 bg-[#6BAE7A]/15 text-[#9BD3A8] hover:bg-[#6BAE7A]/20'
                    )}
                  >
                    <ThumbsUp className="size-4" /> Confirmar reporte
                  </button>
                  <button
                    type="button"
                    disabled={voting}
                    onClick={() => handleVote('dispute')}
                    className={cn(
                      'inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/3 px-4 py-2.5 text-sm font-medium text-white/80 transition-colors',
                      'hover:border-[#E04B5E]/40 hover:bg-[#E04B5E]/10 hover:text-white',
                      'disabled:cursor-not-allowed disabled:opacity-50',
                      detail.myVote === 'dispute' &&
                        'border-[#E04B5E]/50 bg-[#E04B5E]/15 text-[#F0909C] hover:bg-[#E04B5E]/20'
                    )}
                  >
                    <ThumbsDown className="size-4" /> No lo encontré
                  </button>
                </div>
              </div>

              {/* Compartir */}
              <div className="mt-5 border-t border-white/10 pt-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-white/60">
                  <Share2 className="size-4" /> Compartir incidencia
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={handleWhatsApp}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/3 px-4 py-2.5 text-sm font-medium text-white/80 transition-colors hover:border-[#6BAE7A]/40 hover:bg-[#6BAE7A]/10 hover:text-white"
                  >
                    <MessageCircle className="size-4" /> WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/3 px-4 py-2.5 text-sm font-medium text-white/80 transition-colors hover:border-[#D9A55E]/40 hover:bg-[#D9A55E]/10 hover:text-white"
                  >
                    <Copy className="size-4" /> Copiar enlace
                  </button>
                </div>
              </div>
            </div>

            {/* Columna derecha: comentarios */}
            <div className="flex min-h-0 min-w-0 flex-col border-t border-white/10 px-6 py-4 md:border-t-0">
              <h3 className="shrink-0 text-sm font-semibold text-white/80">
                Comentarios ({comments.length})
              </h3>

              <div
                data-lenis-prevent
                className="dark-scroll mt-2 flex flex-col gap-2 md:min-h-0 md:flex-1 md:overflow-y-auto md:pr-1"
              >
                {comments.length === 0 && (
                  <p className="text-xs text-white/40">Aún no hay comentarios. Sé el primero.</p>
                )}
                {comments.map((c) => (
                  <div key={c.id} className="rounded-lg border border-white/8 bg-white/3 p-2.5 transition-colors hover:border-white/15 hover:bg-white/5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-white/80">{c.authorName}</span>
                      <span className="font-mono text-[10px] text-white/35">
                        {new Date(c.createdAt).toLocaleString('es-PE')}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-white/85">{c.content}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex shrink-0 flex-col gap-2.5 border-t border-white/8 pt-3">
                <textarea
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleComment()
                  }}
                  maxLength={191}
                  rows={2}
                  placeholder="Escribe un comentario…"
                  className="w-full resize-none rounded-xl border border-white/12 bg-white/4 px-3.5 py-2.5 text-sm text-white placeholder:text-white/35 transition focus:border-[#D9A55E]/50 focus:bg-white/6 focus:outline-none focus:ring-2 focus:ring-[#D9A55E]/20"
                />
                <button
                  type="button"
                  disabled={commenting || commentBody.trim().length === 0}
                  onClick={handleComment}
                  className="inline-flex items-center justify-center gap-2 self-end rounded-xl bg-linear-to-b from-[#E4B978] to-[#D9A55E] px-5 py-2.5 text-sm font-semibold text-[#1a1205] shadow-[0_10px_28px_-12px_rgba(217,165,94,0.7)] transition hover:from-[#EAC288] hover:to-[#DEAC68] hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                >
                  {commenting ? <Spinner /> : <MessageCircle className="size-4" />}
                  Comentar
                </button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
