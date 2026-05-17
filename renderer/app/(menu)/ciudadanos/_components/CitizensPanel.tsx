'use client'

import { Filter } from '@/components/common/form/filter'
import { useDateRangeFilter, type DateRangeValue } from '@/lib/date-range'
import { CitizensTable } from '@/app/(menu)/ciudadanos/_components/CitizensTable'
import { citizenFilterSchema, type CitizenFilterValues, type CitizensPanelProps } from '@/app/(menu)/ciudadanos/_types/types'

export function CitizensPanel({ citizens }: CitizensPanelProps) {
  const { dateRange, onApply, filteredData } = useDateRangeFilter(citizens, 'createdAt')

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Ciudadanos</h1>
      </div>

      <Filter<CitizenFilterValues>
        schema={citizenFilterSchema}
        defaultValues={{ range: dateRange }}
        body={['range']}
        config={{
          fields: {
            range: { type: 'date-range-picker', label: 'Rango de fechas' },
          },
        }}
        onSubmit={(values) => onApply(values.range as DateRangeValue)}
      />

      <CitizensTable citizens={filteredData} />
    </div>
  )
}
