import { CheckCircle2, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-white flex font-sans">
      
      {/* Left Sidebar - Hidden on mobile, visible on lg screens */}
      <div className="hidden lg:flex lg:flex-col lg:w-[45%] xl:w-5/12 bg-[#6C4CF1] text-white p-12 xl:p-16 relative overflow-hidden">
        
        {/* Background Decorative Pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40L40 0H20L0 20M40 40V20L20 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)"/>
          </svg>
        </div>

        {/* Branding Logo */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer z-10 mb-16 w-max">
          <div className="relative flex items-center justify-center w-8 h-8">
            <div className="absolute inset-0 border-4 border-white rounded-full opacity-50"></div>
            <div className="absolute inset-1 border-4 border-white rounded-full opacity-80"></div>
            <div className="absolute inset-2 bg-white rounded-full"></div>
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">OpportunityOS</span>
        </Link>

        {/* Content */}
        <div className="flex-1 z-10 flex flex-col justify-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-[1.1] tracking-tight">
            Your career journey<br/>starts here.
          </h1>
          <p className="text-indigo-100 text-lg mb-12 max-w-md">
            Join thousands of students who are already discovering internships, winning hackathons, and landing their dream roles.
          </p>

          {/* Product Benefits */}
          <div className="space-y-5 mb-12">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-500/30 flex items-center justify-center shrink-0">
                <CheckCircle2 size={14} className="text-indigo-200" />
              </div>
              <span className="font-medium text-indigo-50">AI-powered opportunity matching</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-500/30 flex items-center justify-center shrink-0">
                <CheckCircle2 size={14} className="text-indigo-200" />
              </div>
              <span className="font-medium text-indigo-50">Automated application tracking</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-500/30 flex items-center justify-center shrink-0">
                <CheckCircle2 size={14} className="text-indigo-200" />
              </div>
              <span className="font-medium text-indigo-50">Smart resume builder & feedback</span>
            </div>
          </div>
        </div>

        {/* Student Success Statistics */}
        <div className="z-10 bg-indigo-700/40 rounded-2xl p-6 border border-indigo-400/20 backdrop-blur-md mt-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex -space-x-3">
               <img alt="student" className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-slate-100" src="https://api.dicebear.com/7.x/notionists/svg?seed=Alex&backgroundColor=60a5fa" />
               <img alt="student" className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-slate-100" src="https://api.dicebear.com/7.x/notionists/svg?seed=Sam&backgroundColor=34d399" />
               <img alt="student" className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-slate-100" src="https://api.dicebear.com/7.x/notionists/svg?seed=Jordan&backgroundColor=f472b6" />
            </div>
            <div className="flex flex-col">
              <div className="flex text-amber-400 gap-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <span className="text-sm font-medium mt-1 text-indigo-100">Loved by 25,000+ students</span>
            </div>
          </div>
          <p className="text-sm text-indigo-100 leading-relaxed italic">
            "OpportunityOS completely changed how I apply for internships. I went from zero responses to 3 offers in a month!"
          </p>
        </div>
      </div>

      {/* Right Side - Form Container */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-32 bg-[#FAFAFA] lg:bg-white overflow-y-auto">
        
        {/* Mobile Logo (only visible on small screens) */}
        <div className="flex lg:hidden justify-center mb-8">
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <div className="relative flex items-center justify-center w-8 h-8">
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full opacity-50"></div>
              <div className="absolute inset-1 border-4 border-indigo-600 rounded-full opacity-80"></div>
              <div className="absolute inset-2 bg-[#6C4CF1] rounded-full"></div>
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-900">OpportunityOS</span>
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto">
          {children}
        </div>
        
      </div>
    </div>
  );
}
