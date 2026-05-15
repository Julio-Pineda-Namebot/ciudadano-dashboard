'use client'

import { z } from 'zod'
import { Filter } from '@/components/common/form/filter'
import {
  getDefaultDateRange,
  type DateRangeValue,
} from '@/lib/date-range'
import type { AuditAction } from '../_types/audit-log'

const AUDIT_ACTIONS = ['', 'INSERT', 'UPDATE', 'DELETE'] as const

const filterSchema = z.object({
  range: z.object({ from: z.string(), to: z.string() }),
  action: z.enum(AUDIT_ACTIONS),
})

type FilterFormValues = z.infer<typeof filterSchema>

export interface AuditLogsFilterValue {
  dateFrom: string
  dateTo: string
  action: AuditAction | ''
}

export function getDefaultAuditFilters(): AuditLogsFilterValue {
  const range = getDefaultDateRange()
  return { dateFrom: range.from, dateTo: range.to, action: '' }
}

interface Props {
  value: AuditLogsFilterValue
  onApply: (value: AuditLogsFilterValue) => void
}

export function AuditLogsFilters({ value, onApply }: Props) {
  const defaultValues: FilterFormValues = {
    range: { from: value.dateFrom, to: value.dateTo },
    action: value.action,
  }

  return (
    <Filter<FilterFormValues>
      schema={filterSchema}
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
