import type { CSSProperties, ReactNode } from 'react';

// Logos de marca. lucide-react eliminó los iconos de marca, así que estos se
// mantienen como SVG propios (mismo trazo que el resto de la UI).

type BrandIconProps = {
  size?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Renders a standardized SVG wrapper for brand icons.
 *
 * @param size - Width and height of the SVG in pixels (default: 20)
 * @param className - Optional CSS class applied to the SVG element
 * @param style - Optional inline styles applied to the SVG element
 * @param children - SVG elements (paths, shapes) that compose the brand mark
 * @returns The rendered `<svg>` element containing the provided children
 */
function BrandSvg({
  size = 20,
  className,
  style,
  children,
}: BrandIconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden
    >
      {children}
    </svg>
  );
}

/**
 * Renders the Apple brand icon as an inline SVG.
 *
 * @returns An SVG JSX element displaying the Apple logo. `props.size` controls the SVG width and height; `props.className` and `props.style` are applied to the root SVG.
 */
export function AppleIcon(props: BrandIconProps) {
  return (
    <BrandSvg {...props}>
      <path d="M16 13c0-3 2.5-4 2.5-4-1.4-2-3.5-2.3-4.3-2.3-1.8-.2-3.6 1.1-4.5 1.1-1 0-2.4-1-4-1-2.1 0-4 1.2-5.1 3.1-2.2 3.8-.6 9.4 1.6 12.5 1 1.5 2.3 3.2 4 3.1 1.6-.1 2.2-1 4.2-1s2.5 1 4.2 1c1.7 0 2.8-1.5 3.9-3 1.2-1.8 1.7-3.5 1.7-3.6 0 0-3.2-1.2-3.2-4.9zM14 4.5c.8-1 1.4-2.4 1.2-3.8C14 .8 12.6 1.6 11.7 2.6c-.8.8-1.5 2.2-1.3 3.5 1.3.1 2.7-.7 3.6-1.6z" />
    </BrandSvg>
  );
}

/**
 * Render the Google brand mark as an inline SVG icon.
 *
 * @param props - Icon properties; `size` sets the SVG width and height in pixels, `className` is applied to the SVG element, and `style` is passed to the SVG's `style`.
 * @returns A JSX element containing the Google logo rendered as an inline SVG.
 */
export function GoogleIcon(props: BrandIconProps) {
  return (
    <BrandSvg {...props}>
      <path d="M12 11v4h6c-.5 2-2.5 4-6 4a6 6 0 110-12c1.6 0 3 .6 4 1.5l3-3A10 10 0 0012 2a10 10 0 100 20c5.7 0 10-4 10-10 0-.7 0-1.3-.2-2H12z" />
    </BrandSvg>
  );
}

/**
 * Renders the Twitter brand mark as an inline SVG.
 *
 * @returns A JSX element containing the Twitter logo, sized and styled according to the provided `BrandIconProps`.
 */
export function TwitterIcon(props: BrandIconProps) {
  return (
    <BrandSvg {...props}>
      <path d="M22 5.8c-.7.3-1.5.6-2.3.7a4 4 0 001.8-2.2 8 8 0 01-2.5 1A4 4 0 0012 9.4c0 .3 0 .6.1.9A11.4 11.4 0 013 4.8a4 4 0 001.2 5.3 4 4 0 01-1.8-.5v.1a4 4 0 003.2 4 4 4 0 01-1.8.1 4 4 0 003.7 2.8A8 8 0 012 18.4 11.4 11.4 0 008.1 20c7.3 0 11.3-6 11.3-11.3v-.5A8 8 0 0022 5.8z" />
    </BrandSvg>
  );
}

/**
 * Renders the Instagram brand icon as an inline SVG.
 *
 * @param props - Props to customize the icon's size, CSS class, and inline style.
 * @returns An SVG element representing the Instagram logo (scalable, uses currentColor for strokes/fills).
 */
export function InstagramIcon(props: BrandIconProps) {
  return (
    <BrandSvg {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </BrandSvg>
  );
}

/**
 * Renders the LinkedIn brand icon as an inline SVG.
 *
 * @param props - BrandIconProps to customize the icon's `size`, `className`, and `style`.
 * @returns An SVG element representing the LinkedIn brand mark.
 */
export function LinkedinIcon(props: BrandIconProps) {
  return (
    <BrandSvg {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10v7M8 7.5v.01M12 17v-4a2 2 0 014 0v4M12 10v7" />
    </BrandSvg>
  );
}
