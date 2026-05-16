'use client';

import { useEffect, useRef, type RefObject } from 'react';
import type Lenis from 'lenis';

type Mode = 'window' | 'sticky';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Drives a callback with the element's 0..1 scroll progress without triggering
 * React re-renders. The callback should mutate the DOM directly via refs.
 *
 * - 'sticky': for pinned sections; 0 at scene start, 1 at scene end.
 * - 'window': 0 when top enters bottom, 1 when bottom leaves top.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  onProgress: (p: number) => void,
  mode: Mode = 'sticky',
) {
  const cbRef = useRef(onProgress);

  useEffect(() => {
    cbRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let lastP = -1;
    let raf = 0;
    let inView = true;
    let offsetTop = 0;
    let height = 0;
    let vh = window.innerHeight;

    const measure = () => {
      // Reads offsetTop/offsetHeight — layout-bound, but only on resize/observe.
      offsetTop = 0;
      let node: HTMLElement | null = el;
      while (node) {
        offsetTop += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      height = el.offsetHeight;
      vh = window.innerHeight;
    };

    const compute = () => {
      raf = 0;
      // r.top equivalent without forcing layout: offsetTop - scrollY.
      const top = offsetTop - window.scrollY;
      let p: number;
      if (mode === 'sticky') {
        p = height <= 0 ? 0 : Math.min(1, Math.max(0, -top / height));
      } else {
        const total = height + vh;
        p = Math.min(1, Math.max(0, (vh - top) / total));
      }
      if (Math.abs(p - lastP) < 0.0005) return;
      lastP = p;
      cbRef.current(p);
    };

    const schedule = () => {
      if (raf || !inView) return;
      raf = requestAnimationFrame(compute);
    };

    const onResize = () => {
      measure();
      schedule();
    };

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        inView = entry.isIntersecting;
        if (inView) schedule();
      },
      { rootMargin: '50% 0px 50% 0px' },
    );
    io.observe(el);

    measure();
    const lenis = window.__lenis;
    if (lenis) {
      lenis.on('scroll', schedule);
    } else {
      window.addEventListener('scroll', schedule, { passive: true });
    }
    window.addEventListener('resize', onResize);
    compute();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      if (lenis) {
        lenis.off('scroll', schedule);
      } else {
        window.removeEventListener('scroll', schedule);
      }
      window.removeEventListener('resize', onResize);
    };
  }, [ref, mode]);
}
