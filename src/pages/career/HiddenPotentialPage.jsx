import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Sparkles, Target, Zap, ChevronDown, CheckCircle2, CircleDashed, LayoutDashboard } from 'lucide-react';
import { useHiddenPotential } from '../../hooks/useHiddenPotential';
import { Link } from 'react-router-dom';

function PotentialCareerCard({ career, index }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-500 bg-emerald-50 border-emerald-100';
    if (score >= 60) return 'text-indigo-500 bg-indigo-50 border-indigo-100';
    return 'text-amber-500 bg-amber-50 border-amber-100';
  };

  const scoreColor = getScoreColor(career.potentialScore);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div 
        className="p-5 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h3 className="text-[18px] font-black text-slate-900">{career.role}</h3>
          <p className="text-[13px] font-semibold text-slate-500 mt-1 flex items-center gap-1.5">
            <Sparkles size={12} className="text-indigo-500" /> AI Detected High Match
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`px-4 py-2 rounded-xl border flex flex-col items-center ${scoreColor}`}>
            <span className="text-[22px] font-black leading-none">{career.potentialScore}</span>
            <span className="text-[9px] font-bold uppercase tracking-wider opacity-80 mt-1">Match</span>
          </div>
          <ChevronDown 
            size={20} 
            className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
          />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100 bg-slate-50/50"
          >
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Col: Why You Match */}
              <div className="space-y-5">
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-emerald-500" /> Existing Strengths
                  </h4>
                  <ul className="space-y-2">
                    {career.whyYouMatch.strengths.map((str, i) => (
                      <li key={i} className="text-[13px] font-semibold text-slate-700 flex items-start gap-2">
                        <span className="text-emerald-500 mt-0.5">•</span> {str}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <Zap size={12} className="text-amber-500" /> Evidence
                  </h4>
                  <p className="text-[13px] font-semibold text-slate-700 bg-white p-3 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-900 block mb-1">Projects:</span>
                    {career.whyYouMatch.matchingProjects.join(', ')}
                  </p>
                  <p className="text-[13px] font-medium text-slate-600 italic mt-2 px-1">
                    "{career.whyYouMatch.githubEvidence}"
                  </p>
                </div>
              </div>

              {/* Right Col: Skill Gaps & Action Plan */}
              <div className="space-y-5">
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <CircleDashed size={12} className="text-rose-500" /> Missing Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {career.skillGaps.missing.map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-md text-[11px] font-bold">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] font-bold text-slate-500 mt-2">
                    Estimated Effort: <span className="text-slate-700">{career.skillGaps.learningEffort}</span>
                  </p>
                </div>

                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-3">Action Plan</h4>
                  <div className="relative pl-3 border-l-2 border-indigo-100 space-y-4">
                    <div className="relative">
                      <div className="absolute -left-[18px] top-1 w-3 h-3 rounded-full bg-indigo-500 border-2 border-white"></div>
                      <p className="text-[10px] font-black text-indigo-500 mb-1">30 DAYS</p>
                      <ul className="space-y-1">
                        {career.actionPlan.days30.map((item, i) => (
                          <li key={i} className="text-[12px] font-medium text-slate-700 leading-tight">• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[18px] top-1 w-3 h-3 rounded-full bg-indigo-300 border-2 border-white"></div>
                      <p className="text-[10px] font-black text-indigo-400 mb-1">60 DAYS</p>
                      <ul className="space-y-1">
                        {career.actionPlan.days60.map((item, i) => (
                          <li key={i} className="text-[12px] font-medium text-slate-700 leading-tight">• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[18px] top-1 w-3 h-3 rounded-full bg-slate-200 border-2 border-white"></div>
                      <p className="text-[10px] font-black text-slate-400 mb-1">90 DAYS</p>
                      <ul className="space-y-1">
                        {career.actionPlan.days90.map((item, i) => (
                          <li key={i} className="text-[12px] font-medium text-slate-700 leading-tight">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function HiddenPotentialPage() {
  const { report, currentTarget, isLoading, isGenerating, generateReport } = useHiddenPotential();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 sm:px-10 py-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
              <Compass size={18} />
              <span className="text-[13px] font-black uppercase tracking-widest">Discovery Engine</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hidden Potential</h1>
            <p className="text-[15px] font-medium text-slate-500 mt-2 max-w-lg leading-relaxed">
              Based on your skills, GitHub, and resume, our AI has uncovered alternative tech careers you have a surprisingly high aptitude for.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Link 
              to="/dashboard"
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 text-[13px] font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center w-full sm:w-auto"
            >
              Back to Dashboard
            </Link>
            <button
              onClick={generateReport}
              disabled={isGenerating || isLoading}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-[#6C4CF1] hover:from-indigo-600 hover:to-[#5B3DE0] text-white text-[13px] font-bold rounded-xl shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all disabled:opacity-50 w-full sm:w-auto"
            >
              {isGenerating ? (
                <><Sparkles size={16} className="animate-spin" /> Scanning Profile...</>
              ) : (
                <><Sparkles size={16} /> Run Detector</>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 sm:px-10 mt-8">
        {/* Current Target Bar */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-5 py-3 flex items-center gap-3 mb-8">
          <Target size={18} className="text-indigo-500 shrink-0" />
          <p className="text-[13px] font-medium text-indigo-900">
            Currently tracking against your goal of <span className="font-bold text-indigo-700">{currentTarget}</span>.
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl h-24 animate-pulse"></div>
            ))}
          </div>
        ) : isGenerating ? (
           <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
             <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4 animate-bounce">
               <Compass size={28} className="text-indigo-600" />
             </div>
             <h3 className="text-xl font-black text-slate-900 mb-2">Analyzing your digital footprint...</h3>
             <p className="text-[14px] text-slate-500 font-medium max-w-md mx-auto">
               We're correlating your resume, GitHub commits, and readiness scores against thousands of career trajectories. This takes about 10-15 seconds.
             </p>
           </div>
        ) : report?.detectedCareers?.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-[15px] font-black text-slate-900 mb-4">Detected Alternative Careers</h2>
            {report.detectedCareers.map((career, i) => (
              <PotentialCareerCard key={i} career={career} index={i} />
            ))}
            <p className="text-[11px] font-bold text-slate-400 text-center uppercase tracking-wider mt-8">
              Last scanned: {report.generatedAt?.toDate ? report.generatedAt.toDate().toLocaleDateString() : 'Recently'}
            </p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <Compass size={28} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Discover new paths</h3>
            <p className="text-[14px] text-slate-500 font-medium max-w-sm mx-auto mb-6">
              Run the AI detector to uncover tech careers you might be surprisingly well-suited for.
            </p>
            <button
              onClick={generateReport}
              className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[13px] font-bold hover:bg-slate-800 transition-colors"
            >
              Run Detector
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
