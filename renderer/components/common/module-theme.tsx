'use client'

import { createContext, useContext } from 'react'

export type ModuleColor = 'blue' | 'orange' | 'green'

interface ModuleThemeContextValue {
  color: ModuleColor
}

const ModuleThemeContext = createContext<ModuleThemeContextValue | null>(null)

export function ModuleTheme({
  color,
  children,
}: {
  color: ModuleColor
  children: React.ReactNode
}) {
  return (
    <ModuleThemeContext.Provider value={{ color }}>
      {children}
    </ModuleThemeContext.Provider>
  )
}

export function useModuleTheme(): ModuleThemeContextValue | null {
  return useContext(ModuleThemeContext)
}

export const MODULE_HEADER_CLASS: Record<ModuleColor, string> = {
  blue:   'bg-[#1a3a6b] text-white [&_th]:text-white [&_th]:border-[#1a3a6b]/30',
  orange: 'bg-orange-600 text-white [&_th]:text-white [&_th]:border-orange-500/30',
  green:  'bg-emerald-700 text-white [&_th]:text-white [&_th]:border-emerald-600/30',
}

export const MODULE_BUTTON_CLASS: Record<ModuleColor, string> = {
  blue:   'bg-[#1a3a6b] hover:bg-[#1a3a6b]/90 text-white',
  orange: 'bg-orange-600 hover:bg-orange-700 text-white',
  green:  'bg-emerald-700 hover:bg-emerald-800 text-white',
}
