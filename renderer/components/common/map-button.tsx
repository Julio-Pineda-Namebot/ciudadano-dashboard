import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface MapButtonProps {
  onClick: () => void
  title: string
  className?: string
  children: ReactNode
}

export function MapButton({ onClick, title, className, children }: MapButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "absolute z-10 flex items-center justify-center rounded-lg bg-white p-2 shadow-md border border-gray-200 hover:bg-gray-50 active:scale-95 transition-transform",
        className
      )}
    >
      {children}
    </button>
  )
}
