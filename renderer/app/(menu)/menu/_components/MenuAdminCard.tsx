'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { AdminCard } from '@/app/(menu)/menu/_types/types'

export function MenuAdminCard({ card }: { card: AdminCard }) {
  const inner = (
    <div
      className={`flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-200 ${
        card.disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:border-sidebar-primary/40 hover:shadow-sm cursor-pointer'
      }`}
    >
      <div className={`flex size-9 items-center justify-center rounded-lg ${card.bg} ${card.color}`}>
        {card.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{card.title}</p>
        <p className="text-xs text-muted-foreground truncate">{card.description}</p>
      </div>
      {card.disabled ? (
        <span className="text-[10px] font-medium bg-muted text-muted-foreground rounded-full px-2 py-0.5 shrink-0">
          Próximamente
        </span>
      ) : (
        <ArrowRight className={`size-4 shrink-0 ${card.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
      )}
    </div>
  )

  return card.disabled ? (
    <div>{inner}</div>
  ) : (
    <Link href={card.href} className="group">
      {inner}
    </Link>
  )
}
