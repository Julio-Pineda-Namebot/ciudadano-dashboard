import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { Navbar } from './_components/navbar';
import { HeroCinema } from './_components/hero-cinema';
import { PhoneScrolly } from './_components/phone-scrolly';
import { MapScrolly } from './_components/map-scrolly';
import { StatMoment } from './_components/stat-moment';
import { Features } from './_components/features';
import { Pricing } from './_components/pricing';
import { Testimonials } from './_components/testimonials';
import { FinalCTA } from './_components/final-cta';
import { Footer } from './_components/footer';
import { ScrollProgress, SectionMarker } from './_components/section-marker';

/**
 * Render the server-side landing page and redirect to /login if NEXT_PUBLIC_APP_MODE is not 'landing'.
 *
 * Renders site chrome, landing sections, footer, and scroll-related UI; passes the presence of an authenticated session to the Navbar.
 *
 * @returns The landing page JSX element composed of scroll helpers, Navbar (with authentication state), the main landing sections, Footer, and a SectionMarker.
 */
export default async function LandingPage() {
  if (process.env.NEXT_PUBLIC_APP_MODE !== 'landing') {
    redirect('/login');
  }

  // Solo presencia de cookie (sin red): si el token está vencido, "Volver a mi feed"
  // rebota limpio a /login al hacer clic. La página de login sí valida con el backend.
  const isAuthenticated = (await getSession()) !== null;

  return (
    <>
      <ScrollProgress />
      <Navbar isAuthenticated={isAuthenticated} />
      <main className="relative">
        <HeroCinema />
        <PhoneScrolly />
        <MapScrolly />
        <StatMoment />
        <Features />
        <Pricing />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
      <SectionMarker />
    </>
  );
}
