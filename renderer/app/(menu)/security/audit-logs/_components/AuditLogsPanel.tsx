'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { AuditLogsFilters, getDefaultAuditFilters } from '@/app/(menu)/security/audit-logs/_components/AuditLogsFilters'
import { AuditLogsTable } from '@/app/(menu)/security/audit-logs/_components/AuditLogsTable'
import { AuditLogDetailModal } from '@/app/(menu)/security/audit-logs/_components/AuditLogDetailModal'
import { getAuditLogs } from '@/app/(menu)/security/audit-logs/actions'
import type { AuditLog, AuditLogsFilterValue, AuditLogsMeta } from '@/app/(menu)/security/audit-logs/_types/types'

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

  const serverPagination = useMemo(
    () => ({
      page,
      perPage,
      totalPages: meta?.totalPages ?? 0,
      totalRows: meta?.total,
      onPageChange: setPage,
      onPerPageChange: (value: number) => {
        setPerPage(value)
        setPage(1)
      },
    }),
    [page, perPage, meta?.totalPages, meta?.total],
  )

  return (
    <div className="p-6 space-y-4">
      <AuditLogsFilters value={filters} onApply={handleApplyFilters} />

      <AuditLogsTable
        logs={logs}
        loading={loading}
        onShowDetail={setDetail}
        serverPagination={serverPagination}
      />

      <AuditLogDetailModal log={detail} onClose={() => setDetail(null)} />
    </div>
  )
}
