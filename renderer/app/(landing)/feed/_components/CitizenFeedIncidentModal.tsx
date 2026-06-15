'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Copy, MessageCircle, Share2, ThumbsDown, ThumbsUp, X } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { StatusBadge } from '@/components/common/StatusBadge'
import { cn } from '@/lib/utils'
import type { IncidentVote } from '@/lib/incidentStatus'
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
          <div className="flex-1 min-h-0 overflow-y-auto md:grid md:grid-cols-2 md:grid-rows-1 md:overflow-hidden">
            {/* Columna izquierda: detalle */}
            <div className="min-w-0 px-6 py-4 md:min-h-0 md:overflow-y-auto md:border-r md:border-white/10">
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
                <StatusBadge status={detail.status} verifiedBy={detail.verifiedBy} />
              </div>

              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
                {new Date(detail.createdAt).toLocaleString('es-PE')}
              </p>

              <p className="mt-3 text-sm leading-relaxed wrap-break-word text-white/90">{detail.description}</p>

              {/* Validación comunitaria */}
              <div className="mt-4 rounded-lg border border-white/10 bg-white/3 p-3">
                <p className="text-xs text-white/60">
                  👍 {detail.confirmCount}{' '}
                  {detail.confirmCount === 1 ? 'confirmación' : 'confirmaciones'} · 👎{' '}
                  {detail.disputeCount}{' '}
                  {detail.disputeCount === 1 ? 'persona no lo encontró' : 'personas no lo encontraron'}
                </p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={voting}
                    onClick={() => handleVote('confirm')}
                    className={cn(
                      'flex-1 border-white/15 bg-transparent text-white hover:bg-white/10',
                      detail.myVote === 'confirm' &&
                        'border-emerald-500/60 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/20'
                    )}
                  >
                    <ThumbsUp className="size-4" /> Confirmar reporte
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={voting}
                    onClick={() => handleVote('dispute')}
                    className={cn(
                      'flex-1 border-white/15 bg-transparent text-white hover:bg-white/10',
                      detail.myVote === 'dispute' &&
                        'border-red-500/60 bg-red-500/15 text-red-300 hover:bg-red-500/20'
                    )}
                  >
                    <ThumbsDown className="size-4" /> No lo encontré
                  </Button>
                </div>
              </div>

              {/* Compartir */}
              <div className="mt-5 border-t border-white/10 pt-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-white/60">
                  <Share2 className="size-4" /> Compartir incidencia
                </div>
                <div className="mt-2 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleWhatsApp}
                    className="flex-1 border-white/15 bg-transparent text-white hover:bg-white/10"
                  >
                    <MessageCircle className="size-4" /> WhatsApp
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCopy}
                    className="flex-1 border-white/15 bg-transparent text-white hover:bg-white/10"
                  >
                    <Copy className="size-4" /> Copiar enlace
                  </Button>
                </div>
              </div>
            </div>

            {/* Columna derecha: comentarios */}
            <div className="flex min-h-0 min-w-0 flex-col border-t border-white/10 px-6 py-4 md:border-t-0">
              <h3 className="shrink-0 text-sm font-semibold text-white/80">
                Comentarios ({comments.length})
              </h3>

              <div className="mt-2 flex flex-col gap-2 md:min-h-0 md:flex-1 md:overflow-y-auto">
                {comments.length === 0 && (
                  <p className="text-xs text-white/40">Aún no hay comentarios. Sé el primero.</p>
                )}
                {comments.map((c) => (
                  <div key={c.id} className="rounded-lg border border-white/10 bg-white/3 p-2.5">
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

              <div className="mt-3 flex shrink-0 flex-col gap-2">
                <textarea
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  maxLength={191}
                  rows={2}
                  placeholder="Escribe un comentario…"
                  className="w-full resize-none rounded-lg border border-white/12 bg-white/3 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-white/25 focus:outline-none"
                />
                <Button
                  type="button"
                  disabled={commenting || commentBody.trim().length === 0}
                  onClick={handleComment}
                  className="self-end bg-[#D9A55E] text-black hover:bg-[#D9A55E]/90"
                >
                  {commenting ? <Spinner /> : <MessageCircle className="size-4" />}
                  Comentar
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
