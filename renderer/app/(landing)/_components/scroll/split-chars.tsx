'use client';

import { useEffect, useRef } from 'react';

type Props = {
  text: string;
  className?: string;
  lineBreaks?: boolean;
  charDelay?: number;
  baseDelay?: number;
};

export function SplitChars({
  text,
  className = '',
  lineBreaks = false,
  charDelay = 0.012,
  baseDelay = 0,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

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

  const lines = lineBreaks ? text.split('\n') : [text];
  let counter = 0;

  return (
    <div ref={ref} className={`split-chars ${className}`}>
      {lines.map((line, li) => (
        <span key={li} className="split-line">
          {Array.from(line).map((ch, i) => {
            const delay = baseDelay + counter * charDelay;
            counter += 1;
            if (ch === ' ') {
              return (
                <span key={i} className="split-space">
                  &nbsp;
                </span>
              );
            }
            return (
              <span key={i} className="split-char" style={{ transitionDelay: `${delay}s` }}>
                <span className="split-char-inner">{ch}</span>
              </span>
            );
          })}
          {li < lines.length - 1 && <br />}
        </span>
      ))}
    </div>
  );
}
