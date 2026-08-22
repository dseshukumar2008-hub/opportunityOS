import  { useState, useEffect } from 'react';
import { Sparkles, GitBranch, Target, User, Code, BarChart3, Lock, Info } from 'lucide-react';
import GithubAnalysisHowItWorksModal from './GithubAnalysisHowItWorksModal';
import { useCareer } from '../../contexts/CareerContext';

const ROLES = [
  "Software Engineer",
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "AI Engineer",
  "Machine Learning Engineer",
  "Data Scientist",
  "Data Analyst",
  "Cloud Engineer",
  "DevOps Engineer",
  "Cyber Security Engineer",
  "Mobile App Developer"
];

export default function GithubUpload({ onAnalyze, loading }) {
  const { careerContext } = useCareer();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  
  // Use context targetRole if available and it exists in ROLES list, otherwise fallback to first role
  const initialRole = careerContext?.targetRole && ROLES.includes(careerContext.targetRole)
    ? careerContext.targetRole
    : ROLES[0];
    
  const [targetRole, setTargetRole] = useState(initialRole);

  useEffect(() => {
    if (careerContext?.targetRole && ROLES.includes(careerContext.targetRole)) {
// eslint-disable-next-line react-hooks/set-state-in-effect
      setTargetRole(careerContext.targetRole);
    }
  }, [careerContext?.targetRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setError('Please enter a GitHub username.');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      const result = await onAnalyze(trimmedUsername, targetRole);
      
      if (result && !result.success) {
        if (result.error === 'USER_NOT_FOUND') {
          setError('GitHub user not found. Please check the username and try again.');
        } else {
          // If it fails for another reason, we can set a generic error or rely on parent's toast
          setError('');
        }
      }
    } catch (_e) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-4 lg:py-6">
      
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-6">
        {/* Left: Text Content */}
        <div className="flex-1 space-y-3 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#F4F2FF] text-[#6D5DF6] rounded-full text-[13px] font-bold tracking-wide">
            <Sparkles size={16} /> OpportunityOS GitHub Analyzer
          </div>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-4xl md:text-[40px] lg:text-[44px] font-extrabold text-[#111827] tracking-tight leading-[1.1]">
              Analyze Your GitHub
            </h1>
            <button 
              type="button"
              onClick={() => setShowHowItWorks(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-[#6D5DF6] hover:bg-indigo-100 transition-colors text-sm font-bold shadow-sm shrink-0"
            >
              <Info size={16} /> How It Works
            </button>
          </div>
          <p className="text-base lg:text-lg text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
            Get AI-powered insights about your repositories, technologies, contributions, and career alignment.
          </p>
        </div>

        {/* Right: Decorative Illustration */}
        <div className="relative w-full max-w-[400px] lg:max-w-[420px] h-[220px] hidden sm:block shrink-0">
          {/* Faint Window Outline */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[180px] bg-white border border-slate-100 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="h-8 border-b border-slate-50 flex items-center px-4 gap-1.5 bg-slate-50/50">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
            </div>
            <div className="p-4 space-y-3">
              <div className="h-2 w-3/4 bg-slate-100 rounded-full"></div>
              <div className="h-2 w-1/2 bg-slate-100 rounded-full"></div>
              <div className="h-2 w-5/6 bg-slate-100 rounded-full"></div>
            </div>
          </div>

          {/* Main GitHub Bubble */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full bg-gradient-to-br from-[#6D5DF6] to-[#5542F6] flex items-center justify-center shadow-[0_0_60px_rgba(109,93,246,0.25)] z-10 border-4 border-white">
            <svg viewBox="0 0 24 24" width="60" height="60" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-white relative z-20">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
              <path d="M9 18c-4.51 2-5-2-7-2"></path>
            </svg>
            
            {/* Glow rings */}
            <div className="absolute inset-0 rounded-full border border-[#6D5DF6]/20 scale-[1.3]"></div>
            <div className="absolute inset-0 rounded-full border border-[#6D5DF6]/10 scale-[1.6]"></div>
          </div>

          {/* Decorative Badges */}
          <div className="absolute top-[30%] left-[5%] w-14 h-14 bg-white rounded-xl shadow-[0_8px_20px_rgba(16,185,129,0.15)] border border-emerald-50 flex items-center justify-center z-20 transform -rotate-6">
             <Code size={24} className="text-emerald-500" />
          </div>

          <div className="absolute bottom-[20%] right-[5%] w-14 h-14 bg-white rounded-xl shadow-[0_8px_20px_rgba(245,158,11,0.15)] border border-orange-50 flex items-center justify-center z-20 transform rotate-6">
             <BarChart3 size={24} className="text-orange-400" />
          </div>
        </div>
      </div>

      {/* Main Analysis Card */}
      <div className="bg-white rounded-[20px] p-5 sm:p-6 lg:px-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100">
        
        {/* Card Header */}
        <div className="flex items-center gap-4 mb-5">
           <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
             <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                <path d="M9 18c-4.51 2-5-2-7-2"></path>
              </svg>
           </div>
           <div>
             <h2 className="text-[22px] font-extrabold text-[#111827] mb-1 tracking-tight">Connect Your GitHub Profile</h2>
             <p className="text-[15px] font-medium text-slate-500">Enter your GitHub username and select your target role to get started.</p>
           </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {/* Username Field */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[13px] font-bold text-slate-700">
                <User size={14} className="text-slate-400" /> GitHub Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. torvalds"
                className={`w-full px-4 py-2.5 bg-white border rounded-xl focus:bg-slate-50 focus:ring-4 transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400 ${
                  error 
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-50' 
                    : 'border-slate-200 focus:border-[#6D5DF6] focus:ring-[#6D5DF6]/10'
                }`}
                required
              />
              {error && (
                <p className="text-red-500 text-[13px] font-medium mt-1.5 flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  {error}
                </p>
              )}
            </div>

            {/* Target Role Field */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[13px] font-bold text-slate-700">
                <Target size={14} className="text-[#6D5DF6]" /> Target Role
              </label>
              <div className="relative">
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:bg-slate-50 focus:border-[#6D5DF6] focus:ring-4 focus:ring-[#6D5DF6]/10 transition-all outline-none font-medium text-slate-900 appearance-none"
                >
                  {ROLES.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={loading || isValidating || !username.trim()}
              className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#6D5DF6] to-[#5542F6] text-white px-8 py-3 rounded-xl text-[15px] font-bold hover:shadow-[0_8px_20px_rgba(109,93,246,0.25)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {loading || isValidating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {isValidating ? 'Checking GitHub...' : 'Analyzing Profile...'}
                </>
              ) : (
                <>
                  <GitBranch size={20} /> Analyze GitHub
                </>
              )}
            </button>
          </div>
          
          <div className="text-center pt-1">
            <p className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-400">
              <Lock size={12} /> We only read public data. Your privacy is safe with us.
            </p>
          </div>
        </form>
      </div>

      <GithubAnalysisHowItWorksModal 
        isOpen={showHowItWorks} 
        onClose={() => setShowHowItWorks(false)} 
      />
    </div>
  );
}
