'use client'

import { createContext, useContext, useState } from 'react'

export type BreadcrumbSegment = {
  label: string
  href?: string
}

type BreadcrumbContextType = {
  items: BreadcrumbSegment[]
  setItems: (items: BreadcrumbSegment[]) => void
}

const BreadcrumbContext = createContext<BreadcrumbContextType>({
  items: [],
  setItems: () => {},
})

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BreadcrumbSegment[]>([])
  return (
    <BreadcrumbContext.Provider value={{ items, setItems }}>
      {children}
    </BreadcrumbContext.Provider>
  )
}

export function useBreadcrumb() {
  return useContext(BreadcrumbContext)
}
