import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';
import { db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { User, GraduationCap, Code2, Target, FileText, UploadCloud, Sparkles } from 'lucide-react';

import WelcomeStep from './WelcomeStep';
import ProfileStep from './ProfileStep';
import EducationStep from './EducationStep';
import SkillsStep from './SkillsStep';
import CareerInterestsStep from './CareerInterestsStep';
import AboutStep from './AboutStep';
import ResumeStep from './ResumeStep';
import SuccessStep from './SuccessStep';

export default function FloatingOnboarding() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({
    profile: {
      fullName: '',
      phone: '',
      dob: '',
      avatar: null
    },
    education: {
      university: '',
      degree: '',
      branch: '',
      currentYear: '',
      graduationYear: '',
      cgpa: '',
      currentSemester: ''
    },
    skills: [],
    careerInterests: [],
    about: { bio: '' },
    resume: {}
  });

  useEffect(() => {
    if (profile) {
      setOnboardingData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          fullName: profile?.profile?.fullName || prev.profile.fullName || profile?.name || '',
          phone: profile?.profile?.phone || prev.profile.phone || profile?.phone || '',
          dob: profile?.profile?.dob || prev.profile.dob || ''
        },
        education: {
          ...prev.education,
          ...profile?.education
        },
        skills: profile?.skills || prev.skills,
        careerInterests: profile?.careerInterests || prev.careerInterests,
        about: {
          ...prev.about,
          ...profile?.about
        },
        resume: profile?.resume || prev.resume
      }));
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    const isLocallyCompleted = localStorage.getItem(`onboarding_${user.uid}`) === 'completed';
    
    if (isLocallyCompleted) {
      setIsLoading(false);
      setIsVisible(false);
      return;
    }

    const checkOnboardingStatus = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.onboardingCompleted === true) {
            localStorage.setItem(`onboarding_${user.uid}`, 'completed');
            setIsVisible(false);
          } else {
            setIsVisible(true);
          }
        } else {
          setIsVisible(true);
        }
      } catch (error) {
        console.error("[ONBOARDING] Error fetching onboarding status:", error);
        setIsVisible(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [user]);

  useEffect(() => {
    window.openOnboardingModal = () => {
      setCurrentStep(0);
      setIsVisible(true);
    };
    return () => {
      delete window.openOnboardingModal;
    };
  }, []);

  // Lock background scrolling when modal is visible
  useEffect(() => {
    if (isVisible) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    };
  }, [isVisible]);

  // Default to step 1 if currentStep is 0 (Welcome step removed)
  useEffect(() => {
    if (currentStep === 0 && isVisible) {
      setCurrentStep(1);
    }
  }, [currentStep, isVisible]);

  const handleNext = () => setCurrentStep(prev => prev + 1);
  const handleBack = () => setCurrentStep(prev => prev - 1);

  const updateOnboardingData = (stepKey, newData) => {
    setOnboardingData(prev => {
      if (Array.isArray(prev[stepKey])) {
        return { ...prev, [stepKey]: newData };
      }
      return {
        ...prev,
        [stepKey]: { ...prev[stepKey], ...newData }
      };
    });
  };

  const handleFinish = async () => {
    if (!user) return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { 
        onboardingCompleted: true,
        profile: {
          fullName: onboardingData.profile.fullName,
          phone: onboardingData.profile.phone,
          dob: onboardingData.profile.dob
        },
        education: onboardingData.education,
        skills: onboardingData.skills,
        careerInterests: onboardingData.careerInterests,
        about: onboardingData.about,
        resume: onboardingData.resume
      });
      localStorage.setItem(`onboarding_${user.uid}`, 'completed');
    } catch (e) {
      console.error('Error saving onboarding state:', e);
    }
    setIsVisible(false);
    toast.success('Dashboard unlocked!');
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(255,255,255,0.18)] backdrop-blur-[18px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (!isVisible) return null;

  // Subtract 1 from currentStep for the progress calculation because Step 0 is Welcome (and Success is 7)
  // Or map them exactly based on meaningful steps. We'll show progress for steps 1 to 6.
  const progressStep = Math.max(1, Math.min(6, currentStep));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-[#FAFBFF] backdrop-blur-md overflow-hidden">
      
      {/* Premium Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Ambient lighting blobs */}
        <div className="absolute top-[-10%] left-[-5%] w-[800px] h-[800px] bg-[#E9D5FF]/30 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[900px] h-[900px] bg-[#BAE6FD]/20 rounded-full blur-[150px]" />
        <div className="absolute top-[30%] left-[30%] w-[600px] h-[600px] bg-[#FBCFE8]/15 rounded-full blur-[120px]" />
        
        {/* Very subtle grain texture */}
        <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      </div>

      {/* Main Glass Card - 16:9 aspect ratio approx */}
      <div className="w-full max-w-[1200px] h-[85vh] min-h-[675px] bg-white rounded-[36px] border border-white/60 shadow-[0_20px_80px_rgba(124,58,237,0.08)] relative z-10 flex overflow-hidden">
        
        {/* LEFT SIDEBAR */}
        <div className="w-[390px] h-full shrink-0 flex flex-col pt-10 pb-8 px-8 border-r-[1px] border-white/40 bg-gradient-to-b from-white via-[#FCFAFF]/90 to-[#F4F0FF]/90 backdrop-blur-2xl shadow-[inset_1px_1px_0_rgba(255,255,255,0.8),4px_0_24px_rgba(124,58,237,0.03)] relative z-20 overflow-hidden">
          
          {/* Subtle background glows */}
          <div className="absolute top-[50px] left-[20px] w-[200px] h-[200px] bg-[#9333EA]/10 blur-[60px] rounded-full pointer-events-none"></div>

          {/* Radial Dot Texture */}
          <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply" 
               style={{ backgroundImage: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.05) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          </div>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-12 relative z-10">
            <div className="relative">
              {/* Subtle purple radial glow specifically behind logo */}
              <div className="absolute inset-0 bg-[#7C3AED]/30 blur-xl rounded-full scale-150"></div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-xl shadow-[0_4px_12px_rgba(124,58,237,0.3)] shrink-0 relative z-10 border border-white/20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
              </div>
            </div>
            <div>
              <h1 className="text-[20px] font-extrabold text-[#1F2435] leading-tight tracking-tight">OpportunityOS</h1>
              <p className="text-[13px] text-slate-500 font-medium leading-none mt-1">Your Career. Organized.</p>
            </div>
          </div>

          {/* Vertical Timeline */}
          <div className="flex-1 flex flex-col justify-center relative z-10">
            <div className="relative">
              {/* Vertical connector line (Gradient: Purple -> Blue -> Pink) */}
              <div className="absolute left-[20px] top-[30px] bottom-[30px] w-[2px] bg-gradient-to-b from-[rgba(124,58,237,0.15)] via-[rgba(59,130,246,0.15)] to-[rgba(236,72,153,0.15)] blur-[0.5px] -z-10 rounded-full"></div>
              
              {[
                { id: 1, title: 'Personal Details', desc: 'Tell us about yourself', icon: <User size={22} className="text-[#6D5BFF]" strokeWidth={2} /> },
                { id: 2, title: 'Education', desc: 'Your academic background', icon: <GraduationCap size={22} className="text-[#3B82F6]" strokeWidth={2} /> },
                { id: 3, title: 'Skills', desc: 'Your technical skills', icon: <Code2 size={22} className="text-[#10B981]" strokeWidth={2} /> },
                { id: 4, title: 'Career Interests', desc: 'Your career preferences', icon: <Target size={22} className="text-[#6366F1]" strokeWidth={2} /> },
                { id: 5, title: 'About You', desc: 'Your story and experiences', icon: <FileText size={22} className="text-[#F97316]" strokeWidth={2} /> },
                { id: 6, title: 'Resume Upload', desc: 'Upload your resume', icon: <UploadCloud size={22} className="text-[#EC4899]" strokeWidth={2} /> }
              ].map((step) => {
                const isActive = currentStep === step.id;
                const isPast = currentStep > step.id;
                
                return (
                  <div key={step.id} className={`flex items-center gap-4 relative mb-8 last:mb-0 group cursor-pointer transition-opacity duration-200 ${!isActive && !isPast ? 'opacity-70 hover:opacity-100' : 'opacity-100'}`} onClick={() => currentStep > 0 && currentStep < 7 && setCurrentStep(step.id)}>
                    
                    {isActive && (
                      <div className="absolute inset-y-[-10px] -inset-x-4 bg-white/60 backdrop-blur-md rounded-[20px] border border-[rgba(255,255,255,0.8)] shadow-[0_12px_30px_rgba(124,58,237,0.15)] transition-transform duration-200 ease-out hover:-translate-y-[2px] -z-10"></div>
                    )}

                    {isPast ? (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] text-white shadow-[0_0_12px_rgba(124,58,237,0.4)] animate-in zoom-in duration-300">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                    ) : (
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-[14px] font-bold transition-all duration-300 ${isActive ? 'bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] text-white shadow-[0_0_15px_rgba(124,58,237,0.3)]' : 'bg-white border border-[#E5DEFF] text-slate-400 shadow-sm'}`}>
                        {step.id}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-[22px] flex items-center justify-center ${isActive ? 'drop-shadow-sm' : ''}`}>{step.icon}</div>
                      <div className="flex flex-col">
                        <span className={`text-[16px] font-bold transition-colors ${isActive || isPast ? 'text-[#7C3AED]' : 'text-[#1F2435]'}`}>{step.title}</span>
                        <span className="text-[13px] text-slate-500 font-medium mt-0.5">{step.desc}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT AREA */}
        <div className="flex-1 h-full flex flex-col bg-white overflow-hidden relative">
          
          {/* Right Content Header (Progress) */}
          {currentStep > 0 && currentStep < 7 && (
            <div className="w-full pt-10 px-12 flex items-center justify-between shrink-0">
              <div className="flex flex-col gap-2.5 w-[300px]">
                <span className="text-[12px] font-bold text-[#6D5BFF] uppercase tracking-wider">
                  STEP {progressStep} OF 6
                </span>
                <div className="w-full h-[6px] bg-[#EEF1F7] rounded-full overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
                  <div 
                    className="h-full bg-gradient-to-r from-[#6D5BFF] to-[#8B7DFF] rounded-full transition-all duration-500 ease-out shadow-[0_2px_4px_rgba(109,91,255,0.2)]"
                    style={{ width: `${(progressStep / 6) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-500 px-4 py-2 bg-[#F8F9FB] rounded-full border border-slate-100 shadow-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
                <span className="text-[13px] font-semibold text-slate-500">Your data is secure</span>
              </div>
            </div>
          )}

          {/* Form Content Area */}
          <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col h-full w-full">
            {currentStep === 1 && <ProfileStep onNext={handleNext} data={onboardingData.profile} updateData={(d) => updateOnboardingData('profile', d)} />}
            {currentStep === 2 && <EducationStep onNext={handleNext} onBack={handleBack} data={onboardingData.education} updateData={(d) => updateOnboardingData('education', d)} />}
            {currentStep === 3 && <SkillsStep onNext={handleNext} onBack={handleBack} data={onboardingData.skills} updateData={(d) => updateOnboardingData('skills', d)} />}
            {currentStep === 4 && <CareerInterestsStep onNext={handleNext} onBack={handleBack} data={onboardingData.careerInterests} updateData={(d) => updateOnboardingData('careerInterests', d)} />}
            {currentStep === 5 && <AboutStep onNext={handleNext} onBack={handleBack} data={onboardingData.about} updateData={(d) => updateOnboardingData('about', d)} />}
            {currentStep === 6 && <ResumeStep onNext={handleNext} onBack={handleBack} />}
            {currentStep === 7 && <SuccessStep onFinish={handleFinish} data={onboardingData} />}
          </div>

        </div>
      </div>
    </div>
  );
}
