import { Poppins, JetBrains_Mono } from 'next/font/google';
import { LenisProvider } from './_components/lenis-provider';
import './landing.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-landing-mono',
});

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`landing-root flex-1 ${poppins.variable} ${jetbrainsMono.variable}`}>
      <LenisProvider>{children}</LenisProvider>
    </div>
  );
}
