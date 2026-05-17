'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { FeatureCard } from '@/app/(menu)/menu/_types/types'

export function MenuFeatureCard({ card }: { card: FeatureCard }) {
  const inner = (
    <div
      className={`group h-full flex flex-col gap-4 rounded-xl border p-5 transition-all duration-200 ${
        card.disabled
          ? 'opacity-50 cursor-not-allowed border-border bg-card'
          : 'cursor-pointer border-border bg-card hover:border-sidebar-primary/40 hover:shadow-md hover:-translate-y-0.5'
      } ${card.border}`}
    >
      <div className={`flex size-11 items-center justify-center rounded-lg ${card.bg} ${card.color}`}>
        {card.icon}
      </div>
      <div className="space-y-1 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground text-sm">{card.title}</h3>
          {card.disabled && (
            <span className="text-[10px] font-medium bg-muted text-muted-foreground rounded-full px-2 py-0.5">
              Próximamente
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{card.description}</p>
      </div>
      <div
        className={`flex items-center gap-1 text-xs font-medium transition-all ${
          card.disabled ? 'invisible' : `${card.color} group-hover:gap-2`
        }`}
      >
        Ir al módulo <ArrowRight className="size-3" />
      </div>
    </div>
  )

  return card.disabled ? (
    <div className="h-full">{inner}</div>
  ) : (
    <Link href={card.href} className="h-full">
      {inner}
    </Link>
  )
}
