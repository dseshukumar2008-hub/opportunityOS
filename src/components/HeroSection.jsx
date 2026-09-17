import { Link } from 'react-router-dom';
import DashboardPreview from './DashboardPreview';
import { analyticsService } from '../services/analyticsService';

export default function HeroSection() {
  return (
    <section id="hero" className="relative w-full max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-12 xl:gap-20 pt-16 lg:pt-20 pb-8 lg:pb-12 overflow-hidden min-h-[calc(100vh-72px)]">


      {/* Left Column: Copy */}
      <div className="flex-1 w-full max-w-xl z-10 shrink-0 xl:ml-8">
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
          <span>🚀</span> The Operating System for Student Opportunities
        </div>

        <h1 className="text-[2.75rem] xl:text-[3rem] leading-[1.05] font-black text-slate-900 mb-4 tracking-tight">
          Build Your Career,<br />
          One Measurable Step at a <span className="text-indigo-600">Time.</span>
        </h1>

        <p className="text-base xl:text-lg text-slate-600 mb-6 leading-relaxed max-w-lg">
          Build your profile, improve your resume, discover your skill gaps, and grow with personalized career guidance.
        </p>


        {/* Buttons */}
        <div className="flex items-center gap-4 mb-6 xl:mb-8">
          <Link
            to="/signup"
            onClick={() => analyticsService.trackEvent('CTA Click', { label: 'Get Started Free' })}
            className="btn-primary px-5 py-2.5 xl:px-6 xl:py-3 text-sm xl:text-base font-medium shadow-md shadow-indigo-200">
            Get Started Free
          </Link>

        </div>


      </div>

      {/* Right Column: Dashboard Mockup */}
      <div className="flex-1 w-full lg:max-w-[700px] xl:max-w-[850px] relative mt-8 lg:mt-0 z-0">
        <DashboardPreview />
      </div>
    </section>
  );
}
