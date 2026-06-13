'use client'

import { X } from 'lucide-react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { TermsContent } from '@/app/(landing)/terms/TermsContent'

export function CitizenFeedTermsSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="text-white underline decoration-white/40 underline-offset-2 transition hover:decoration-white"
        >
          términos y condiciones
        </button>
      </SheetTrigger>
      {/* !w-full en móvil; ~mitad acotada en desktop. El !important gana al w-3/4
          por defecto del SheetContent (conflicto de variantes con twMerge). */}
      <SheetContent
        side="right"
        showCloseButton={false}
        // El feed corre bajo Lenis (smooth scroll); el Sheet se monta en un portal
        // fuera del <main data-lenis-prevent>, así que sin esto Lenis intercepta el
        // wheel y el scroll nativo del sheet no funciona.
        data-lenis-prevent
        className="gap-0 overflow-y-auto border-l border-white/10 p-0 text-white w-full! sm:w-[46vw]! sm:max-w-[600px]!"
        style={{
          background:
            'radial-gradient(ellipse at 100% 0%, rgba(217,165,94,0.07), transparent 55%), linear-gradient(180deg, rgba(11,15,28,0.97), rgba(5,7,15,1))',
        }}
      >
        <SheetHeader className="sticky top-0 z-10 flex-row items-center justify-between border-b border-white/10 bg-black/30 px-6 py-4 backdrop-blur-md">
          <SheetTitle className="bg-linear-to-r from-white to-neutral-400 bg-clip-text text-[19px] font-semibold tracking-tight text-transparent">
            Términos y Condiciones
          </SheetTitle>
          <SheetClose
            aria-label="Cerrar"
            className="grid h-8 w-8 place-items-center rounded-lg text-white/60 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <X size={18} />
          </SheetClose>
        </SheetHeader>
        <div className="px-6 py-6">
          <TermsContent />
        </div>
      </SheetContent>
    </Sheet>
  )
}
