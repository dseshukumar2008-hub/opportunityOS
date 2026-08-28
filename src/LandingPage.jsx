import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CapabilitiesSection from './components/CapabilitiesSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';


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




      <Footer />
    </div>
  );
}
