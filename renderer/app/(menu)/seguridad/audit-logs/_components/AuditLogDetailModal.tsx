'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AuditLogBadge } from './AuditLogBadge'
import type { AuditLog } from '../_types/audit-log'
import { formatDateTime } from '@/lib/utils'

interface Props {
  log: AuditLog | null
  onClose: () => void
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

function ChangesView({ log }: { log: AuditLog }) {
  if (!log.changes) {
    return <p className="text-sm text-muted-foreground">Sin cambios registrados.</p>
  }

  if (log.action === 'UPDATE' && 'old' in log.changes && 'new' in log.changes) {
    const oldVals = log.changes.old as Record<string, unknown>
    const newVals = log.changes.new as Record<string, unknown>
    const keys = Array.from(new Set([...Object.keys(oldVals), ...Object.keys(newVals)]))

    if (keys.length === 0) {
      return <p className="text-sm text-muted-foreground">Sin cambios efectivos.</p>
    }

    return (
      <div className="overflow-hidden rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Campo</th>
              <th className="px-3 py-2 text-left font-medium">Antes</th>
              <th className="px-3 py-2 text-left font-medium">Ahora</th>
            </tr>
          </thead>
          <tbody>
            {keys.map((key) => (
              <tr key={key} className="border-t">
                <td className="px-3 py-2 font-mono text-xs">{key}</td>
                <td className="px-3 py-2 align-top">
                  <pre className="whitespace-pre-wrap wrap-break-word text-xs text-muted-foreground">
                    {formatValue(oldVals[key])}
                  </pre>
                </td>
                <td className="px-3 py-2 align-top">
                  <pre className="whitespace-pre-wrap wrap-break-word text-xs">
                    {formatValue(newVals[key])}
                  </pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const single =
    log.action === 'INSERT' && 'new' in log.changes
      ? (log.changes.new as Record<string, unknown>)
      : log.action === 'DELETE' && 'old' in log.changes
        ? (log.changes.old as Record<string, unknown>)
        : null

  if (!single) {
    return <p className="text-sm text-muted-foreground">Sin cambios registrados.</p>
  }

  const keys = Object.keys(single)
  if (keys.length === 0) {
    return <p className="text-sm text-muted-foreground">Sin campos registrados.</p>
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Campo</th>
            <th className="px-3 py-2 text-left font-medium">Valor</th>
          </tr>
        </thead>
        <tbody>
          {keys.map((key) => (
            <tr key={key} className="border-t">
              <td className="px-3 py-2 font-mono text-xs">{key}</td>
              <td className="px-3 py-2 align-top">
                <pre className="whitespace-pre-wrap wrap-break-word text-xs">
                  {formatValue(single[key])}
                </pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function AuditLogDetailModal({ log, onClose }: Props) {
  const open = log !== null

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-3xl" dismissible={false} showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Detalle del registro</span>
            {log && <AuditLogBadge action={log.action} />}
          </DialogTitle>
          <DialogDescription>
            {log
              ? `${log.entity} · ${formatDateTime(log.createdAt)}`
              : ''}
          </DialogDescription>
        </DialogHeader>

        {log && (
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 pr-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Administrador</p>
                  <p className="text-sm">
                    {log.admin.firstName} {log.admin.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">@{log.admin.username}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Correo</p>
                  <p className="text-sm">{log.admin.email}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Entidad</p>
                  <p className="text-sm">
                    {log.entity}
                    <span className="ml-2 font-mono text-xs text-muted-foreground">
                      {log.entityId}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">IP</p>
                  <p className="font-mono text-sm">{log.ip ?? '—'}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground">Mensaje</p>
                <p className="text-sm">{log.mensaje}</p>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Cambios</p>
                <ChangesView log={log} />
              </div>
            </div>
          </ScrollArea>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
