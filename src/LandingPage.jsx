import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CapabilitiesSection from './components/CapabilitiesSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import { useEffect } from 'react';
import { analyticsService } from './services/analyticsService';

export default function LandingPage() {
  useEffect(() => {
    analyticsService.trackEvent('Page Visit', { page: 'Landing Page' });
  }, []);

  return (
    <div className="min-h-screen bg-[#FCFCFD] text-slate-900 font-sans overflow-x-hidden flex flex-col">
      <Navbar />
      <HeroSection />
      <CapabilitiesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      
      {/* FAQ and CTA side by side block */}
      <section className="w-full max-w-[1400px] mx-auto px-6 py-24 flex flex-col lg:flex-row gap-12 items-start">
        <div className="flex-1 w-full">
          <FAQSection />
        </div>
        <div className= "flex-1 w-full mt-10 lg:mt-0">
          <CTASection />
        </div>
      </section>

      <Footer />
    </div>
  );
}
