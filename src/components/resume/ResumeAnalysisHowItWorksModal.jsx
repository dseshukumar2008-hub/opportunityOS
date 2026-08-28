import { X, FileText, Bot, Target, Sparkles, Lock } from 'lucide-react';
import { useEffect } from 'react';

export default function ResumeAnalysisHowItWorksModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-[24px] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            How AI Resume Analysis Works
          </h2>
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors bg-white hover:bg-slate-100 p-1 rounded-full shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        {/* Steps */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex gap-4 group">
            <div className="shrink-0 w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:bg-[#6D5DF6] group-hover:text-white text-[#6D5DF6] transition-all">
              <FileText size={22} />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-bold text-slate-900 mb-1 flex items-center gap-2">
                1. Upload & Extract 📄
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Your resume is securely processed and key information such as skills, education, projects, and experience is extracted.
              </p>
            </div>
          </div>

          <div className="flex gap-4 group">
            <div className="shrink-0 w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:bg-[#6D5DF6] group-hover:text-white text-[#6D5DF6] transition-all">
              <Bot size={22} />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-bold text-slate-900 mb-1 flex items-center gap-2">
                2. AI Analysis 🤖
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                AI evaluates your resume content, structure, clarity, and overall professional quality.
              </p>
            </div>
          </div>

          <div className="flex gap-4 group">
            <div className="shrink-0 w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:bg-[#6D5DF6] group-hover:text-white text-[#6D5DF6] transition-all">
              <Target size={22} />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-bold text-slate-900 mb-1 flex items-center gap-2">
                3. ATS Evaluation 🎯
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Your resume is checked for ATS compatibility and keyword optimization.
              </p>
            </div>
          </div>

          <div className="flex gap-4 group">
            <div className="shrink-0 w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:bg-[#6D5DF6] group-hover:text-white text-[#6D5DF6] transition-all">
              <Sparkles size={22} />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-bold text-slate-900 mb-1 flex items-center gap-2">
                4. Personalized Insights 🚀
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Get your resume score, strengths, areas for improvement, skill gaps, and actionable recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50/80 border-t border-slate-100 p-4 px-6 flex items-center justify-center gap-2">
          <Lock size={14} className="text-slate-400" />
          <p className="text-[12px] font-bold text-slate-500">
            Your resume data is used only to generate personalized analysis and insights.
          </p>
        </div>
      </div>
    </div>
  );
}
