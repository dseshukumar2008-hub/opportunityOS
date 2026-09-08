import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CapabilitiesSection from './components/CapabilitiesSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';


import Footer from './components/Footer';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { analyticsService } from './services/analyticsService';


export default function LandingPage() {
  useEffect(() => {
    analyticsService.trackEvent('Page Visit', { page: 'Landing Page' });
  }, []);

  return (
    <>
      <Helmet>
        <title>OpportunityOS - Accelerate Your Career with AI</title>
        <meta name="description" content="An open-source AI platform that accelerates your career through resume analysis, skill gap tracking, AI mock interviews, and personalized career roadmaps." />
        <link rel="canonical" href="https://opportunityos.app/" />
      </Helmet>
      <div className="min-h-screen bg-[#FCFCFD] text-slate-900 font-sans overflow-x-hidden flex flex-col">
        <Navbar />
        <HeroSection />
      <CapabilitiesSection />
      <FeaturesSection />
      <HowItWorksSection />




        <Footer />
      </div>
    </>
  );
}
