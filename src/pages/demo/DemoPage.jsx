import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, X, Rocket, CheckCircle2, Home } from 'lucide-react';
import DemoTimeline from './DemoTimeline';
import DemoPreviewCard from './DemoPreviewCard';

const DEMO_STEPS = [
  { id: 1, title: 'Create Profile', description: 'Set up your personal details, education, skills, and career interests.' },
  { id: 2, title: 'Personalized Dashboard', description: 'Get a personalized dashboard based on your profile, skills, and career goals.' },
  { id: 3, title: 'AI Resume Analysis', description: 'Upload your resume and receive AI-powered insights, ATS score, and improvement suggestions.' },
  { id: 4, title: 'Smart Opportunity Matching', description: 'Discover opportunities that match your skills, education, and interests.' },
  { id: 5, title: 'AI Career Coach', description: 'Receive personalized career guidance, ask questions, and get actionable recommendations.' },
  { id: 6, title: 'Career Roadmap', description: 'Generate a personalized learning roadmap to achieve your target career.' },
  { id: 7, title: 'Skill Gap Analysis', description: 'Identify missing skills and receive recommendations to improve your profile.' },
  { id: 8, title: 'Welcome to OpportunityOS', description: 'Your AI-powered career workspace is now ready. Launch your personalized dashboard.' }
];

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };  

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleExit = () => {
    navigate('/signup');
  };

  const isCompleted = currentStep > DEMO_STEPS.length;

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100 text-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Rocket size={40} className="text-emerald-500" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Congratulations!</h1>
          <p className="text-slate-500 mb-8 leading-relaxed">
            You have completed the OpportunityOS Experience. You are now ready to accelerate your career.
          </p>
          
          <div className="bg-slate-50 rounded-2xl p-6 text-left mb-8 space-y-4">
            <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-xs">Your Summary</h3>
            {[
              'Resume Optimized (ATS 88)',
              'Opportunities Matched',
              'Team Joined',
              'Network Expanded',
              'Career Readiness Improved'
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                <span className="text-sm font-medium text-slate-700">{item}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={handleExit}
            className="w-full bg-[#6C4CF1] hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-[0_8px_30px_rgb(108,76,241,0.3)] hover:shadow-[0_8px_30px_rgb(108,76,241,0.5)] flex items-center justify-center gap-2"
          >
            Create Your Account <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
      
      {/* Left Column - Timeline & Navigation */}
      <div className="w-full md:w-[45%] lg:w-[40%] xl:w-[35%] bg-[#F8FAFC] border-r border-slate-200 flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-xl font-black text-slate-900">OpportunityOS Demo</h1>
            <p className="text-sm font-medium text-slate-500 mt-0.5">Experience the career journey.</p>
          </div>
          <button onClick={handleExit} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-slate-100 w-full shrink-0">
          <div 
            className="h-full bg-[#6C4CF1] transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / DEMO_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Timeline Area */}
        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="mb-6 flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>Step {currentStep} of {DEMO_STEPS.length}</span>
          </div>
          <DemoTimeline steps={DEMO_STEPS} currentStep={currentStep} />
        </div>

        {/* Footer Controls */}
        <div className="px-8 py-6 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:text-[#6C4CF1] hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft size={16} /> Return to Homepage
            </button>
            {currentStep > 1 && (
              <button 
                onClick={handlePrevious}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft size={16} /> Previous
              </button>
            )}
          </div>
          
          <button 
            onClick={handleNext}
            className="bg-[#6C4CF1] hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all shadow-md shadow-indigo-200"
          >
            {currentStep === DEMO_STEPS.length ? 'Finish Demo' : 'Next Step'} <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Right Column - Preview Area */}
      <div className="hidden md:flex flex-1 bg-slate-50 relative overflow-hidden items-center justify-center">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-indigo-100/40 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-50/60 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
        
        <DemoPreviewCard step={currentStep} />
      </div>
      
    </div>
  );
}
