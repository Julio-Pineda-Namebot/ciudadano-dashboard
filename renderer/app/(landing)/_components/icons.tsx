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
