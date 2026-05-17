'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AuditLogsFilters, getDefaultAuditFilters, type AuditLogsFilterValue } from './AuditLogsFilters'
import { AuditLogsTable } from './AuditLogsTable'
import { AuditLogsPagination } from './AuditLogsPagination'
import { AuditLogDetailModal } from './AuditLogDetailModal'
import { getAuditLogs } from '../actions'
import type { AuditLog, AuditLogsMeta } from '../_types/audit-log'

const DEFAULT_PER_PAGE = 20

export function AuditLogsPanel() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [meta, setMeta] = useState<AuditLogsMeta | null>(null)
  const [filters, setFilters] = useState<AuditLogsFilterValue>(getDefaultAuditFilters)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE)
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState<AuditLog | null>(null)

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getAuditLogs({
        page,
        perPage,
        action: filters.action || undefined,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
      })
      setLogs(res.data)
      setMeta(res.meta)
    } catch {
      toast.error('No se pudieron cargar los registros de auditoría')
      setLogs([])
      setMeta(null)
    } finally {
      setLoading(false)
    }
  }, [page, perPage, filters])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  function handleApplyFilters(value: AuditLogsFilterValue) {
    setFilters(value)
    setPage(1)
  }

  function handlePerPageChange(value: number) {
    setPerPage(value)
    setPage(1)
  }

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Logs de auditoría</h1>
      </div>

      <AuditLogsFilters value={filters} onApply={handleApplyFilters} />

      <AuditLogsTable logs={logs} loading={loading} onShowDetail={setDetail} />

      <AuditLogsPagination
        meta={meta}
        onPageChange={setPage}
        onPerPageChange={handlePerPageChange}
      />

      <AuditLogDetailModal log={detail} onClose={() => setDetail(null)} />
    </div>
  )
}
