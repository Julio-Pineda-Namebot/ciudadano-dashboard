import { redirect } from 'next/navigation';
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

export default function LandingPage() {
  if (process.env.NEXT_PUBLIC_APP_MODE !== 'landing') {
    redirect('/login');
  }

  return (
    <>
      <ScrollProgress />
      <Navbar />
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
