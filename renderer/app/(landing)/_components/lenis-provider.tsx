'use client';

import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';

type Section = { id: string; label: string; n: string };

const SECTIONS: Section[] = [
  { id: 'hero',     label: 'Inicio',         n: '01' },
  { id: 'flow',     label: 'Cómo funciona',  n: '02' },
  { id: 'map',      label: 'Mapa',           n: '03' },
  { id: 'features', label: 'Funciones',      n: '04' },
  { id: 'pricing',  label: 'Planes',         n: '05' },
  { id: 'voices',   label: 'Voces',          n: '06' },
  { id: 'contact',  label: 'Contacto',       n: '07' },
];

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Skip smooth-scrolling on users that asked for reduced motion: the JS
    // overhead is unnecessary and the easing itself is what they want avoided.
    // Scroll-driven effects still work via native scroll events (see use-element-progress).
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lenis = reducedMotion
      ? null
      : new Lenis({
          autoRaf: true,
          duration: 1.4,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          anchors: { offset: -60, duration: 1.6 },
          lerp: 0.085,
          autoToggle: true,
        });
    if (lenis) window.__lenis = lenis;

    const revealEls = document.querySelectorAll(
      '.reveal, .reveal-x, .reveal-scale, .reveal-blur, .word-reveal',
    );
    const revealIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            revealIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    revealEls.forEach((el) => revealIo.observe(el));

    const progressBar = document.getElementById('scrollProgress');
    const markerLabel = document.getElementById('sectionMarkerLabel');
    const markerBar = document.getElementById('sectionMarkerBar');
    const markerNum = document.getElementById('sectionMarkerNum');

    // --- Active section: IntersectionObserver instead of per-frame polling ---
    const sectionNodes = SECTIONS.map((s) => ({
      meta: s,
      node: document.getElementById(s.id),
    })).filter((x): x is { meta: Section; node: HTMLElement } => x.node !== null);

    let activeMeta: Section = SECTIONS[0];
    const applyActive = (meta: Section) => {
      if (meta === activeMeta) return;
      activeMeta = meta;
      if (markerLabel) markerLabel.textContent = meta.label;
      if (markerNum) markerNum.textContent = meta.n;
    };

    const sectionIo = new IntersectionObserver(
      () => {
        let best: { meta: Section; ratio: number } | null = null;
        const vh = window.innerHeight;
        for (const { meta, node } of sectionNodes) {
          const r = node.getBoundingClientRect();
          const visible = Math.min(r.bottom, vh) - Math.max(r.top, 0);
          const ratio = visible / vh;
          if (!best || ratio > best.ratio) best = { meta, ratio };
        }
        if (best && best.ratio > 0) applyActive(best.meta);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    sectionNodes.forEach(({ node }) => sectionIo.observe(node));

    // --- Parallax: cache layer centers (documentY) so per-frame is pure math ---
    type ParallaxLayer = { el: HTMLElement; speed: number; centerY: number };
    const allParallax = Array.from(
      document.querySelectorAll<HTMLElement>('[data-parallax]'),
    );
    const visibleParallax = new Set<ParallaxLayer>();
    const layerMap = new Map<HTMLElement, ParallaxLayer>();

    const measureLayer = (el: HTMLElement): ParallaxLayer => {
      const r = el.getBoundingClientRect();
      return {
        el,
        speed: parseFloat(el.dataset.parallax ?? '0.15') || 0.15,
        centerY: r.top + window.scrollY + r.height / 2,
      };
    };

    allParallax.forEach((el) => {
      const layer = measureLayer(el);
      layerMap.set(el, layer);
    });
    let winH = window.innerHeight;

    const parallaxIo = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          const layer = layerMap.get(el);
          if (!layer) continue;
          if (entry.isIntersecting) visibleParallax.add(layer);
          else {
            visibleParallax.delete(layer);
            el.style.transform = '';
          }
        }
      },
      { rootMargin: '20% 0px 20% 0px' },
    );
    allParallax.forEach((el) => parallaxIo.observe(el));

    const remeasureLayers = () => {
      winH = window.innerHeight;
      allParallax.forEach((el) => {
        const fresh = measureLayer(el);
        layerMap.set(el, fresh);
        // Keep the visible set referencing fresh objects.
        for (const existing of visibleParallax) {
          if (existing.el === el) {
            visibleParallax.delete(existing);
            visibleParallax.add(fresh);
            break;
          }
        }
      });
    };

    const onScroll = ({ scroll, limit }: { scroll: number; limit: number }) => {
      const p = limit > 0 ? scroll / limit : 0;
      if (progressBar) progressBar.style.transform = `scaleX(${p})`;
      if (markerBar) markerBar.style.setProperty('--p', p.toFixed(3));

      if (visibleParallax.size > 0) {
        const viewCenter = scroll + winH / 2;
        visibleParallax.forEach((layer) => {
          const ty = (viewCenter - layer.centerY) * layer.speed;
          layer.el.style.transform = `translate3d(0, ${ty.toFixed(2)}px, 0)`;
        });
      }
    };

    const nativeOnScroll = () =>
      onScroll({
        scroll: window.scrollY,
        limit: document.documentElement.scrollHeight - window.innerHeight,
      });

    if (lenis) {
      lenis.on('scroll', onScroll);
    } else {
      window.addEventListener('scroll', nativeOnScroll, { passive: true });
    }
    nativeOnScroll();

    window.addEventListener('resize', remeasureLayers);

    return () => {
      revealIo.disconnect();
      sectionIo.disconnect();
      parallaxIo.disconnect();
      window.removeEventListener('resize', remeasureLayers);
      if (lenis) {
        lenis.destroy();
        delete window.__lenis;
      } else {
        window.removeEventListener('scroll', nativeOnScroll);
      }
    };
  }, []);

  return <>{children}</>;
}
