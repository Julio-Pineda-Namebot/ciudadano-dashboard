'use client';

import { useEffect, useRef } from 'react';

type Props = {
  text: string;
  className?: string;
  wordDelay?: number;
};

export function SplitWords({ text, className = '', wordDelay = 0.06 }: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const words = text.split(' ');
  return (
    <span ref={ref} className={`split-words ${className}`}>
      {words.map((w, i) => (
        <span key={i} className="split-word-mask">
          <span className="split-word" style={{ transitionDelay: `${i * wordDelay}s` }}>
            {w}
          </span>
          {i < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}
