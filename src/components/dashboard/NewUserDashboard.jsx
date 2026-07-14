import React, { useState, useEffect } from 'react';
import { Rocket, CheckCircle2, User, FileText, Target, Code, MessageSquare, Briefcase, Lock, ArrowUpRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function NewUserDashboard() {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchProgress = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setProgressData(userDoc.data());
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProgress();
  }, [user]);

  const getProgressPercent = () => {
    if (!progressData) return 0;
    let completedSteps = 0;
    if (progressData.profile?.fullName && progressData.profile?.college) completedSteps++;
    if (progressData.skills?.length > 0) completedSteps++;
    if (progressData.interests?.length > 0) completedSteps++;
    if (progressData.goals?.length > 0) completedSteps++;
    if (progressData.preferredLocations?.length > 0) completedSteps++;
    return Math.min(100, Math.round((completedSteps / 5) * 100));
  };

  const isProfileComplete = progressData?.profile?.fullName && progressData?.profile?.college;
  const isResumeUploaded = !!progressData?.resumeUrl;
  
  const triggerOnboarding = () => {
    if (window.openOnboardingModal) {
      window.openOnboardingModal();
    }
  };

  const progressPercent = getProgressPercent();

  return (
    <div className="w-full max-w-[1600px] mx-auto p-4 lg:p-8 bg-[#F8FAFC]">
      <div className="flex flex-col gap-6">

        {/* ── Welcome Banner ── */}
        <div className="bg-white rounded-[24px] border border-slate-100 p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="flex flex-col md:flex-row items-center gap-8 flex-1">
            <div className="w-48 h-48 rounded-full bg-indigo-50/50 flex flex-col items-center justify-center shrink-0 border border-indigo-100 relative">
              <Rocket size={80} className="text-[#6C4CF1]" />
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome to OpportunityOS! 👏</h1>
              <p className="text-slate-500 text-[15px] font-medium max-w-lg mb-8">
                Let's build your personalized career dashboard in just a few simple steps.
              </p>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-bold text-slate-900">Your onboarding progress</span>
                <span className="text-[13px] font-bold text-[#6C4CF1]">{progressPercent}% Complete</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#6C4CF1] transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-[320px] shrink-0 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h3 className="text-[14px] font-bold text-slate-900 mb-4">Complete these steps to unlock your full potential</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {isProfileComplete ? <CheckCircle2 size={18} className="text-green-500" /> : <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-300" />}
                <span className={`text-[13px] font-medium ${isProfileComplete ? 'text-slate-500 line-through' : 'text-slate-700'}`}>Complete your profile</span>
              </div>
              <div className="flex items-center gap-3">
                {isResumeUploaded ? <CheckCircle2 size={18} className="text-green-500" /> : <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-300" />}
                <span className={`text-[13px] font-medium ${isResumeUploaded ? 'text-slate-500 line-through' : 'text-slate-700'}`}>Upload your resume</span>
              </div>
              <div className="flex items-center gap-3">
                {progressData?.goals?.length > 0 ? <CheckCircle2 size={18} className="text-green-500" /> : <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-300" />}
                <span className={`text-[13px] font-medium ${progressData?.goals?.length > 0 ? 'text-slate-500 line-through' : 'text-slate-700'}`}>Select your career goal</span>
              </div>
              <div className="flex items-center gap-3">
                {progressData?.skills?.length > 0 ? <CheckCircle2 size={18} className="text-green-500" /> : <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-300" />}
                <span className={`text-[13px] font-medium ${progressData?.skills?.length > 0 ? 'text-slate-500 line-through' : 'text-slate-700'}`}>Add your skills</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-300" />
                <span className="text-[13px] font-medium text-slate-700">Explore career paths</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Status Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#F3F0FF] text-[#6C4CF1] flex items-center justify-center mb-4">
              <User size={20} />
            </div>
            <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wide mb-1">Profile Completion</p>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{isProfileComplete ? 'Completed' : 'Not Started'}</h3>
            <p className="text-[13px] text-slate-500 mb-6 flex-1">Complete your profile to unlock personalized insights.</p>
            <button onClick={triggerOnboarding} className="text-[13px] font-bold text-[#6C4CF1] hover:text-indigo-700 flex items-center gap-1">
              {isProfileComplete ? 'Update Profile' : 'Complete Profile'} <ArrowUpRight size={16} />
            </button>
          </div>
          
          <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <FileText size={20} />
            </div>
            <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wide mb-1">Resume</p>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{isResumeUploaded ? 'Uploaded' : 'Not Uploaded'}</h3>
            <p className="text-[13px] text-slate-500 mb-6 flex-1">Upload your resume to get AI analysis and improve your score.</p>
            <button onClick={triggerOnboarding} className="text-[13px] font-bold text-[#6C4CF1] hover:text-indigo-700 flex items-center gap-1">
              Upload Resume <ArrowUpRight size={16} />
            </button>
          </div>
          
          <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-4">
              <Target size={20} />
            </div>
            <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wide mb-1">Career Readiness</p>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Awaiting Profile</h3>
            <p className="text-[13px] text-slate-500 mb-6 flex-1">Complete your profile to calculate your career readiness score.</p>
            <button onClick={triggerOnboarding} className="text-[13px] font-bold text-[#6C4CF1] hover:text-indigo-700 flex items-center gap-1">
              Learn More <ArrowUpRight size={16} />
            </button>
          </div>
        </div>

        {/* ── AI Career Copilot ── */}
        <div className="bg-[#6C4CF1] rounded-[24px] p-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                <Sparkles size={24} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-white">AI Career Copilot</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white uppercase tracking-wider">Your AI Career Coach</span>
                </div>
                <p className="text-white/80 text-[14px]">Get personalized guidance and take action to accelerate your career</p>
              </div>
            </div>
            <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold py-2.5 px-5 rounded-xl transition-colors text-[14px] flex items-center gap-2 backdrop-blur-sm">
              <MessageSquare size={16} /> Ask Career Coach
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
            <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-indigo-50 text-[#6C4CF1] flex items-center justify-center mb-3">
                <User size={18} />
              </div>
              <h4 className="text-[14px] font-bold text-slate-900 mb-2">Complete Profile</h4>
              <p className="text-[12px] text-slate-500 mb-4 flex-1">Tell us about yourself and your career goals.</p>
              <button onClick={triggerOnboarding} className="w-full bg-indigo-50 hover:bg-indigo-100 text-[#6C4CF1] font-bold py-2 rounded-xl text-[12px] transition-colors flex items-center justify-center gap-1">
                Start Now <ArrowUpRight size={14} />
              </button>
            </div>
            
            <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <FileText size={18} />
              </div>
              <h4 className="text-[14px] font-bold text-slate-900 mb-2">Upload Resume</h4>
              <p className="text-[12px] text-slate-500 mb-4 flex-1">Upload your resume to get AI analysis and improve.</p>
              <button onClick={triggerOnboarding} className="w-full bg-indigo-50 hover:bg-indigo-100 text-[#6C4CF1] font-bold py-2 rounded-xl text-[12px] transition-colors flex items-center justify-center gap-1">
                Upload Now <ArrowUpRight size={14} />
              </button>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-3">
                <Target size={18} />
              </div>
              <h4 className="text-[14px] font-bold text-slate-900 mb-2">Career Roadmap</h4>
              <p className="text-[12px] text-slate-500 mb-4 flex-1">Generate an AI-powered career roadmap.</p>
              <button className="w-full bg-indigo-50 hover:bg-indigo-100 text-[#6C4CF1] font-bold py-2 rounded-xl text-[12px] transition-colors flex items-center justify-center gap-1">
                Explore Now <ArrowUpRight size={14} />
              </button>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
                <MessageSquare size={18} />
              </div>
              <h4 className="text-[14px] font-bold text-slate-900 mb-2">Chat with Coach</h4>
              <p className="text-[12px] text-slate-500 mb-4 flex-1">Ask questions and get personalized guidance.</p>
              <button className="w-full bg-indigo-50 hover:bg-indigo-100 text-[#6C4CF1] font-bold py-2 rounded-xl text-[12px] transition-colors flex items-center justify-center gap-1">
                Start Chat <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Locked Widgets Row 1 ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-[24px] border border-slate-100 p-8 shadow-sm flex flex-col items-center justify-center text-center h-[240px]">
            <div className="flex items-center gap-2 self-start absolute ml-2 mt-2 top-4 left-4">
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                <User size={14} className="text-[#6C4CF1]" />
              </div>
              <span className="font-bold text-[14px] text-slate-900">Career Health</span>
            </div>
            <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center mb-4">
              <Lock size={20} className="text-slate-300" />
            </div>
            <p className="text-[13px] text-slate-500 max-w-[200px] mb-4">Complete your profile to see your career health insights.</p>
            <button onClick={triggerOnboarding} className="px-5 py-2 bg-[#F3F0FF] text-[#6C4CF1] font-bold rounded-xl text-[13px]">
              Complete Profile
            </button>
          </div>
          
          <div className="bg-white rounded-[24px] border border-slate-100 p-8 shadow-sm flex flex-col items-center justify-center text-center h-[240px]">
            <div className="flex items-center gap-2 self-start absolute ml-2 mt-2 top-4 left-4">
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                <FileText size={14} className="text-[#6C4CF1]" />
              </div>
              <span className="font-bold text-[14px] text-slate-900">Career Roadmap Progress</span>
            </div>
            <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center mb-4">
              <Lock size={20} className="text-slate-300" />
            </div>
            <p className="text-[13px] text-slate-500 max-w-[260px] mb-4">Complete your profile to generate an AI-powered career roadmap and track your progress.</p>
            <button className="px-5 py-2 bg-[#F3F0FF] text-[#6C4CF1] font-bold rounded-xl text-[13px]">
              Generate Roadmap
            </button>
          </div>
        </div>

        {/* ── Locked Widgets Row 2 ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-[24px] border border-slate-100 p-8 shadow-sm flex flex-col items-center justify-center text-center h-[240px] relative">
            <div className="flex items-center gap-2 absolute top-6 left-6">
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                <Target size={14} className="text-[#6C4CF1]" />
              </div>
              <span className="font-bold text-[14px] text-slate-900">Skill Gap Analysis</span>
            </div>
            <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center mb-4 mt-8">
              <Lock size={20} className="text-slate-300" />
            </div>
            <p className="text-[13px] text-slate-500 max-w-[200px] mb-4">Select your target role to discover the skills you need to learn.</p>
            <button onClick={triggerOnboarding} className="px-5 py-2 bg-[#F3F0FF] text-[#6C4CF1] font-bold rounded-xl text-[13px]">
              Choose Target Role
            </button>
          </div>
          
          <div className="bg-white rounded-[24px] border border-slate-100 p-8 shadow-sm flex flex-col items-center justify-center text-center h-[240px] relative">
            <div className="flex items-center gap-2 absolute top-6 left-6">
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                <FileText size={14} className="text-[#6C4CF1]" />
              </div>
              <span className="font-bold text-[14px] text-slate-900">Resume Insights</span>
            </div>
            <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center mb-4 mt-8">
              <Lock size={20} className="text-slate-300" />
            </div>
            <p className="text-[13px] text-slate-500 max-w-[200px] mb-4">Upload your resume to get your ATS score and insights.</p>
            <button onClick={triggerOnboarding} className="px-5 py-2 bg-[#F3F0FF] text-[#6C4CF1] font-bold rounded-xl text-[13px]">
              Upload Resume
            </button>
          </div>
        </div>

        {/* ── Locked Widgets Row 3 ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white rounded-[24px] border border-slate-100 p-8 shadow-sm flex flex-col items-center justify-center text-center min-h-[240px] relative">
              <div className="flex items-center gap-2 absolute top-6 left-6">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                  <Briefcase size={14} className="text-[#6C4CF1]" />
                </div>
                <span className="font-bold text-[14px] text-slate-900">Project Recommendations</span>
              </div>
              <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center mb-4 mt-8">
                <Lock size={20} className="text-slate-300" />
              </div>
              <p className="text-[13px] text-slate-500 max-w-[260px] mb-4">Complete your profile and add skills to get AI-powered project recommendations.</p>
              <button onClick={triggerOnboarding} className="px-5 py-2 bg-[#F3F0FF] text-[#6C4CF1] font-bold rounded-xl text-[13px]">
                Complete Profile
              </button>
            </div>
            
            <div className="bg-white rounded-[24px] border border-slate-100 p-8 shadow-sm flex flex-col items-center justify-center text-center min-h-[240px] relative">
              <div className="flex items-center gap-2 absolute top-6 left-6">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                  <User size={14} className="text-[#6C4CF1]" />
                </div>
                <span className="font-bold text-[14px] text-slate-900">People You May Know</span>
              </div>
              <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center mb-4 mt-8">
                <Lock size={20} className="text-slate-300" />
              </div>
              <p className="text-[13px] text-slate-500 max-w-[260px] mb-4">Build your profile to discover students and professionals with similar interests and goals.</p>
              <button onClick={triggerOnboarding} className="px-5 py-2 bg-[#F3F0FF] text-[#6C4CF1] font-bold rounded-xl text-[13px]">
                Complete Profile
              </button>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm h-full flex flex-col relative">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                  <User size={14} className="text-[#6C4CF1]" />
                </div>
                <span className="font-bold text-[14px] text-slate-900">AI Career Copilot</span>
              </div>
              
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-[#6C4CF1]" />
                  <span className="text-[11px] font-bold tracking-wider text-[#6C4CF1] uppercase">Up Next</span>
                </div>
                <p className="text-[14px] font-bold text-slate-900 mb-4">Complete your profile to unlock better matches.</p>
                <button onClick={triggerOnboarding} className="w-full bg-[#6C4CF1] hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-[13px] transition-colors">
                  Complete Profile →
                </button>
              </div>

              <div className="mt-auto">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={14} className="text-[#6C4CF1]" />
                  <span className="text-[11px] font-bold tracking-wider text-[#6C4CF1] uppercase">Suggested Questions</span>
                </div>
                <div className="space-y-2">
                  {['How do I improve my ATS score?', 'What skills should I learn next?', 'Which career paths fit my profile?', 'How can I become internship-ready?'].map((q, i) => (
                    <div key={i} className="bg-slate-50 p-3 rounded-xl text-[13px] text-slate-700 font-medium border border-transparent hover:border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer">
                      {q}
                    </div>
                  ))}
                </div>
                <div className="relative mt-4">
                  <input type="text" placeholder="Ask your Career Coach anything..." disabled className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-4 pr-12 text-[13px] cursor-not-allowed" />
                  <button disabled className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-200 text-white rounded-lg flex items-center justify-center cursor-not-allowed">
                    <MessageSquare size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
