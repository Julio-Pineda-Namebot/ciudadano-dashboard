'use client'

import { Filter } from '@/components/common/form/filter'
import {
  getDefaultDateRange,
  type DateRangeValue,
} from '@/lib/date-range'
import {
  auditLogsFilterSchema,
  type AuditAction,
  type AuditLogsFilterFormValues,
  type AuditLogsFilterValue,
  type AuditLogsFiltersProps,
} from '@/app/(menu)/security/audit-logs/_types/types'

export function getDefaultAuditFilters(): AuditLogsFilterValue {
  const range = getDefaultDateRange()
  return { dateFrom: range.from, dateTo: range.to, action: '' }
}

export function AuditLogsFilters({ value, onApply }: AuditLogsFiltersProps) {
  const defaultValues: AuditLogsFilterFormValues = {
    range: { from: value.dateFrom, to: value.dateTo },
    action: value.action,
  }

  return (
    <Filter<AuditLogsFilterFormValues>
      schema={auditLogsFilterSchema}
      defaultValues={defaultValues}
      body={['range', 'action']}
      config={{
        fields: {
          range: { type: 'date-range-picker', label: 'Rango de fechas' },
          action: {
            type: 'combobox',
            label: 'Acción',
            placeholder: 'Todas',
            options: [
              { value: '', label: 'Todas' },
              { value: 'INSERT', label: 'Creación' },
              { value: 'UPDATE', label: 'Actualización' },
              { value: 'DELETE', label: 'Eliminación' },
            ],
          },
        },
      }}
      onSubmit={(values) => {
        const range = (values.range ?? { from: '', to: '' }) as DateRangeValue
        const action = (values.action ?? '') as AuditAction | ''
        onApply({ dateFrom: range.from, dateTo: range.to, action })
      }}
    />
  )
}
