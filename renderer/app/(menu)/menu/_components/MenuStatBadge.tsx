'use client'

export function MenuStatBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl bg-muted/50 border border-border/50 flex-1 sm:flex-none sm:px-6 sm:py-3">
      <span className="text-base sm:text-xl font-bold text-foreground">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}
