import type { CSSProperties } from 'react';

type IconName =
  | 'shield' | 'bell' | 'chat' | 'route' | 'camera' | 'users' | 'chart'
  | 'arrow' | 'play' | 'download' | 'pin' | 'check' | 'x' | 'sparkle'
  | 'lock' | 'siren' | 'plus' | 'minus' | 'menu' | 'chevron'
  | 'twitter' | 'instagram' | 'linkedin' | 'apple' | 'google'
  | 'grid' | 'zap' | 'eye' | 'radio' | 'star' | 'quote';

const paths: Record<IconName, React.ReactNode> = {
  shield: <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" />,
  bell: <><path d="M6 9a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6z" /><path d="M10 18a2 2 0 004 0" /></>,
  chat: <path d="M4 5h16v10H8l-4 4V5z" />,
  route: <><circle cx="6" cy="6" r="2" /><circle cx="18" cy="18" r="2" /><path d="M6 8c0 5 6 4 6 8s6 2 6-2" /></>,
  camera: <><path d="M3 7h4l2-2h6l2 2h4v11H3z" /><circle cx="12" cy="13" r="3.5" /></>,
  users: <><circle cx="9" cy="9" r="3" /><circle cx="17" cy="10" r="2.2" /><path d="M3 19c0-3 3-5 6-5s6 2 6 5" /><path d="M15 19c0-2 2-4 4-4s2 1 2 3" /></>,
  chart: <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  play: <path d="M7 5l12 7-12 7V5z" />,
  download: <path d="M12 4v12M6 12l6 6 6-6M4 20h16" />,
  pin: <><path d="M12 21s7-6 7-12a7 7 0 10-14 0c0 6 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></>,
  check: <path d="M4 12l5 5 11-12" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  sparkle: <path d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3z" />,
  lock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></>,
  siren: <path d="M5 17h14M7 17a5 5 0 0110 0M12 5v3M5 9l-1.5-1.5M19 9l1.5-1.5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  chevron: <path d="M6 9l6 6 6-6" />,
  twitter: <path d="M22 5.8c-.7.3-1.5.6-2.3.7a4 4 0 001.8-2.2 8 8 0 01-2.5 1A4 4 0 0012 9.4c0 .3 0 .6.1.9A11.4 11.4 0 013 4.8a4 4 0 001.2 5.3 4 4 0 01-1.8-.5v.1a4 4 0 003.2 4 4 4 0 01-1.8.1 4 4 0 003.7 2.8A8 8 0 012 18.4 11.4 11.4 0 008.1 20c7.3 0 11.3-6 11.3-11.3v-.5A8 8 0 0022 5.8z" />,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></>,
  linkedin: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 10v7M8 7.5v.01M12 17v-4a2 2 0 014 0v4M12 10v7" /></>,
  apple: <path d="M16 13c0-3 2.5-4 2.5-4-1.4-2-3.5-2.3-4.3-2.3-1.8-.2-3.6 1.1-4.5 1.1-1 0-2.4-1-4-1-2.1 0-4 1.2-5.1 3.1-2.2 3.8-.6 9.4 1.6 12.5 1 1.5 2.3 3.2 4 3.1 1.6-.1 2.2-1 4.2-1s2.5 1 4.2 1c1.7 0 2.8-1.5 3.9-3 1.2-1.8 1.7-3.5 1.7-3.6 0 0-3.2-1.2-3.2-4.9zM14 4.5c.8-1 1.4-2.4 1.2-3.8C14 .8 12.6 1.6 11.7 2.6c-.8.8-1.5 2.2-1.3 3.5 1.3.1 2.7-.7 3.6-1.6z" />,
  google: <path d="M12 11v4h6c-.5 2-2.5 4-6 4a6 6 0 110-12c1.6 0 3 .6 4 1.5l3-3A10 10 0 0012 2a10 10 0 100 20c5.7 0 10-4 10-10 0-.7 0-1.3-.2-2H12z" />,
  grid: <><rect x="4" y="4" width="7" height="7" /><rect x="13" y="4" width="7" height="7" /><rect x="4" y="13" width="7" height="7" /><rect x="13" y="13" width="7" height="7" /></>,
  zap: <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />,
  eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  radio: <><circle cx="12" cy="12" r="2" /><path d="M16 8a6 6 0 010 8M8 8a6 6 0 000 8M19 5a10 10 0 010 14M5 5a10 10 0 000 14" /></>,
  star: <path d="M12 3l2.7 5.7 6.3.9-4.5 4.4 1 6.3L12 17.3l-5.5 3 1-6.3L3 9.6l6.3-.9L12 3z" />,
  quote: <path d="M7 7h4v4c0 3-2 5-4 5M14 7h4v4c0 3-2 5-4 5" />,
};

type IconProps = {
  name: IconName;
  size?: number;
  stroke?: number;
  className?: string;
  style?: CSSProperties;
};

export function Icon({ name, size = 20, stroke = 1.6, className = '', style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden
    >
      {paths[name]}
    </svg>
  );
}

export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <path d="M32 4 L56 12 V30 C56 44 46 54 32 60 C18 54 8 44 8 30 V12 L32 4 Z" fill="white" />
      <path d="M32 9 L51 15.3 V30 C51 41.5 43 50 32 55 C21 50 13 41.5 13 30 V15.3 L32 9 Z" fill="black" />
      <path d="M32 12 L48 17.4 V30 C48 40 41 47.6 32 52 C23 47.6 16 40 16 30 V17.4 L32 12 Z" fill="white" />
      <g fill="black">
        <path d="M32 19 L43 28 V40 H21 V28 L32 19 Z" />
        <rect x="29.5" y="32" width="5" height="8" fill="white" />
        <rect x="23.5" y="30" width="4" height="4" fill="white" />
        <rect x="36.5" y="30" width="4" height="4" fill="white" />
        <circle cx="32" cy="26" r="1.4" fill="white" />
      </g>
    </svg>
  );
}
