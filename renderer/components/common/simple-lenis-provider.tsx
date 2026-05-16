'use client';

import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';

export function SimpleLenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      autoToggle: true,
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
