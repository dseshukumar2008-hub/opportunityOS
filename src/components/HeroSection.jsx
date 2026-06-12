import { Briefcase, Code, GraduationCap, Trophy, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardPreview from './DashboardPreview';

export default function HeroSection() {
  return (
    <section id="hero" className="relative w-full max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-12 xl:gap-20 pt-16 lg:pt-20 pb-8 lg:pb-12 overflow-hidden min-h-[calc(100vh-80px)] lg:min-h-0">
      
      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      {/* Left Column: Copy */}
      <div className="flex-1 w-full max-w-xl z-10 shrink-0 xl:ml-8">
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
          <span>🚀</span> The Operating System for Student Opportunities
        </div>
        
        <h1 className="text-[2.75rem] xl:text-[3rem] leading-[1.05] font-black text-slate-900 mb-4 tracking-tight">
          Find. Track. Win.<br/>
          Your Next <span className="text-indigo-600">Opportunity.</span>
        </h1>
        
        <p className="text-base xl:text-lg text-slate-600 mb-6 leading-relaxed max-w-lg">
          Discover internships, hackathons, scholarships and competitions. Track applications, build resumes, team up with others and accelerate your career.
        </p>

        {/* Opportunity Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-6 xl:mb-8">
          <div className="flex items-center gap-2 bg-white border border-slate-200 shadow-sm px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-lg text-xs xl:text-sm font-semibold text-slate-700">
            <div className="w-5 h-5 xl:w-6 xl:h-6 bg-green-100 text-green-600 rounded flex items-center justify-center"><Briefcase size={12}/></div>
            Internships
          </div>  
          <div className="flex items-center gap-2 bg-white border border-slate-200 shadow-sm px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-lg text-xs xl:text-sm font-semibold text-slate-700">
            <div className="w-5 h-5 xl:w-6 xl:h-6 bg-purple-100 text-purple-600 rounded flex items-center justify-center"><Code size={12}/></div>
            Hackathons
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 shadow-sm px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-lg text-xs xl:text-sm font-semibold text-slate-700">
            <div className="w-5 h-5 xl:w-6 xl:h-6 bg-blue-100 text-blue-600 rounded flex items-center justify-center"><GraduationCap size={12}/></div>
            Scholarships
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 shadow-sm px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-lg text-xs xl:text-sm font-semibold text-slate-700">
            <div className="w-5 h-5 xl:w-6 xl:h-6 bg-amber-100 text-amber-600 rounded flex items-center justify-center"><Trophy size={12}/></div>
            Competitions
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4 mb-6 xl:mb-8">
          <Link to="/signup" className="bg-[#6C4CF1] hover:bg-indigo-700 text-white px-5 py-2.5 xl:px-6 xl:py-3 rounded-lg font-medium transition-colors shadow-md shadow-indigo-200 text-sm xl:text-base">
            Get Started Free
          </Link>
          <Link to="/demo" className="flex items-center gap-2 bg-white hover:bg-indigo-50 border-2 border-indigo-600 text-indigo-600 px-5 py-2 xl:px-6 xl:py-2.5 rounded-lg font-medium transition-colors text-sm xl:text-base">
            <Play size={18} fill="currentColor" />
            Start Full Demo
          </Link>
        </div>

        {/* Social Proof */}
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            <img src="https://i.pravatar.cc/100?img=1" alt="Avatar" className="w-8 h-8 xl:w-10 xl:h-10 rounded-full border-2 border-white object-cover" />
            <img src="https://i.pravatar.cc/100?img=2" alt="Avatar" className="w-8 h-8 xl:w-10 xl:h-10 rounded-full border-2 border-white object-cover" />
            <img src="https://i.pravatar.cc/100?img=3" alt="Avatar" className="w-8 h-8 xl:w-10 xl:h-10 rounded-full border-2 border-white object-cover" />
            <img src="https://i.pravatar.cc/100?img=4" alt="Avatar" className="w-8 h-8 xl:w-10 xl:h-10 rounded-full border-2 border-white object-cover" />
          </div>
          <p className="text-xs xl:text-sm text-slate-600 font-medium">Join 25,000+ students building their future</p>
        </div>
      </div>

      {/* Right Column: Dashboard Mockup */}
      <div className="flex-1 w-full lg:max-w-[700px] xl:max-w-[850px] relative mt-8 lg:mt-0 z-0">
        <DashboardPreview />
      </div>
    </section>
  );
}
