'use client'

import * as React from 'react'

export interface DateRangeValue {
  from: string
  to: string
}

export const EMPTY_DATE_RANGE: DateRangeValue = { from: '', to: '' }

function toYYYYMMDD(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function getDefaultDateRange(): DateRangeValue {
  const to = new Date()
  const from = new Date()
  from.setMonth(from.getMonth() - 1)
  return { from: toYYYYMMDD(from), to: toYYYYMMDD(to) }
}

export function isWithinDateRange(rawValue: unknown, range: DateRangeValue): boolean {
  if (!range.from && !range.to) return true
  if (rawValue == null || rawValue === '') return false

  const valueDate = new Date(rawValue as string | number | Date)
  if (Number.isNaN(valueDate.getTime())) return false

  if (range.from) {
    const fromDate = new Date(`${range.from}T00:00:00`)
    if (valueDate < fromDate) return false
  }
  if (range.to) {
    const toDate = new Date(`${range.to}T23:59:59.999`)
    if (valueDate > toDate) return false
  }
  return true
}

export function useDateRangeFilter<T>(data: T[], dateKey: keyof T & string) {
  const [dateRange, setDateRange] = React.useState<DateRangeValue>(() => getDefaultDateRange())

  const filteredData = React.useMemo(() => {
    if (!dateRange.from && !dateRange.to) return data
    return data.filter((row) =>
      isWithinDateRange((row as Record<string, unknown>)[dateKey], dateRange),
    )
  }, [data, dateKey, dateRange])

  return {
    dateRange,
    onApply: setDateRange,
    filteredData,
  }
}

export function dateRangeValueToDateRange(value: DateRangeValue | undefined) {
  if (!value) return undefined
  const from = value.from ? new Date(`${value.from}T00:00:00`) : undefined
  const to = value.to ? new Date(`${value.to}T00:00:00`) : undefined
  if (!from && !to) return undefined
  return { from, to }
}

export function dateRangeToDateRangeValue(range: { from?: Date; to?: Date } | undefined): DateRangeValue {
  if (!range) return EMPTY_DATE_RANGE
  return {
    from: range.from ? toYYYYMMDD(range.from) : '',
    to: range.to ? toYYYYMMDD(range.to) : '',
  }
}
