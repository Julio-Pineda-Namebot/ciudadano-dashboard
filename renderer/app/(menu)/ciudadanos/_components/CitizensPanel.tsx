'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { Filter } from '@/components/common/form/filter'
import { useDateRangeFilter, type DateRangeValue } from '@/lib/date-range'
import { CitizensTable } from './CitizensTable'
import { getCitizens } from '../actions'
import type { Citizen } from '../_types/citizen'

const filterSchema = z.object({
  range: z.object({ from: z.string(), to: z.string() }),
})

type FilterValues = z.infer<typeof filterSchema>

export function CitizensPanel() {
  const [citizens, setCitizens] = useState<Citizen[]>([])
  const [loading, setLoading] = useState(true)
  const { dateRange, onApply, filteredData } = useDateRangeFilter(citizens, 'createdAt')

  useEffect(() => {
    setLoading(true)
    getCitizens()
      .then(setCitizens)
      .catch(() => toast.error('No se pudieron cargar los ciudadanos'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Ciudadanos</h1>
      </div>

      <Filter<FilterValues>
        schema={filterSchema}
        defaultValues={{ range: dateRange }}
        body={['range']}
        config={{
          fields: {
            range: { type: 'date-range-picker', label: 'Rango de fechas' },
          },
        }}
        onSubmit={(values) => onApply(values.range as DateRangeValue)}
      />

      <CitizensTable citizens={filteredData} loading={loading} />
    </div>
  )
}
