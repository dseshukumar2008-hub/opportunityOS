import { X, Link, GitBranch, Bot, Sparkles, Lock } from 'lucide-react';
import { useEffect } from 'react';

export default function GithubAnalysisHowItWorksModal({ isOpen, onClose }) {
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
            How GitHub Analysis Works
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
              <Link size={22} />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-bold text-slate-900 mb-1 flex items-center gap-2">
                1. Connect Your GitHub Profile 🔗
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Enter your GitHub username or connect your public GitHub profile for analysis.
              </p>
            </div>
          </div>

          <div className="flex gap-4 group">
            <div className="shrink-0 w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:bg-[#6D5DF6] group-hover:text-white text-[#6D5DF6] transition-all">
              <GitBranch size={22} />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-bold text-slate-900 mb-1 flex items-center gap-2">
                2. Analyze Your Repositories 📂
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                The system examines your repositories, programming languages, projects, activity, and overall GitHub presence.
              </p>
            </div>
          </div>

          <div className="flex gap-4 group">
            <div className="shrink-0 w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:bg-[#6D5DF6] group-hover:text-white text-[#6D5DF6] transition-all">
              <Bot size={22} />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-bold text-slate-900 mb-1 flex items-center gap-2">
                3. AI Evaluates Your Developer Profile 🤖
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                AI analyzes your project quality, technical skills, code portfolio, consistency, and strengths.
              </p>
            </div>
          </div>

          <div className="flex gap-4 group">
            <div className="shrink-0 w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:bg-[#6D5DF6] group-hover:text-white text-[#6D5DF6] transition-all">
              <Sparkles size={22} />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-bold text-slate-900 mb-1 flex items-center gap-2">
                4. Get Actionable Insights 🚀
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Receive your GitHub Alignment score, identified strengths, improvement areas, skill insights, and next-step recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50/80 border-t border-slate-100 p-4 px-6 flex items-center justify-center gap-2">
          <Lock size={14} className="text-slate-400" />
          <p className="text-[12px] font-bold text-slate-500">
            Only publicly available GitHub profile and repository information is analyzed.
          </p>
        </div>
      </div>
    </div>
  );
}
