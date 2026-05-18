'use client'

import { useMemo } from 'react'
import { DataTable } from '@/components/common/datatable/data-table'
import { getAuditLogsColumns } from '@/app/(menu)/security/audit-logs/_components/AuditLogsColumns'
import type { AuditLogsTableProps } from '@/app/(menu)/security/audit-logs/_types/types'

export function AuditLogsTable({ logs, loading, onShowDetail, serverPagination }: AuditLogsTableProps) {
  const columns = useMemo(() => getAuditLogsColumns({ onShowDetail }), [onShowDetail])

  return (
    <DataTable
      data={logs}
      columns={columns}
      loading={loading}
      emptyTitle="Sin registros"
      emptyDescription="No se encontraron registros de auditoría con los filtros aplicados."
      serverPagination={serverPagination}
    />
  )
}
