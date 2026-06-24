import React from 'react';
import { Target, FileText, Code, ChevronRight, Briefcase, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCareer } from '../../contexts/CareerContext';
import { useResumeInsights } from '../../hooks/useResumeInsights';

export default function AIInsightsSummary() {
  const { careerContext } = useCareer();
  const { atsScore, missingSkills: resumeMissingSkills, nextAction: resumeNextAction } = useResumeInsights();
  const navigate = useNavigate();

  // Consolidate missing skills from both contexts
  const skillsToImprove = [...new Set([...(careerContext?.missingSkills || []), ...(resumeMissingSkills || [])])].slice(0, 4);

  // Data-driven Status Logic
  const getStatusInfo = () => {
    const hasStrongResume = atsScore > 75;
    const hasWeakGithub = careerContext?.githubScore < 50;
    
    if (hasStrongResume && hasWeakGithub) {
      return {
        status: "Strong resume, but missing practical project evidence.",
        action: "Build and deploy 2 target projects to GitHub."
      };
    } else if (!hasStrongResume && careerContext?.githubScore > 70) {
      return {
        status: "Great coding activity, but resume is poorly optimized for ATS.",
        action: "Update your resume to fix keyword gaps."
      };
    } else if (skillsToImprove.length > 2) {
      return {
        status: `Missing foundational skills for ${careerContext?.targetRole || 'Software Engineering'} roles.`,
        action: `Complete learning paths for ${skillsToImprove[0]} and ${skillsToImprove[1]}.`
      };
    }
    
    return {
      status: "Steady progress towards target role readiness.",
      action: resumeNextAction || "Complete a mock interview session."
    };
  };

  const { status, action } = getStatusInfo();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:col-span-3 flex flex-col gap-6"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <Target size={20} className="text-blue-500" />
          <h2 className="text-lg font-bold text-slate-900">Career Insights</h2>
        </div>
        <button onClick={() => navigate('/dashboard')} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
          Action Plan <ChevronRight size={14} />
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col items-center text-center">
          <FileText size={16} className="text-slate-400 mb-2" />
          <p className="text-xl font-black text-slate-800">{atsScore || 0}%</p>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Resume Score</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col items-center text-center">
          <Code size={16} className="text-slate-400 mb-2" />
          <p className="text-xl font-black text-slate-800">{careerContext?.githubScore || 0}/100</p>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">GitHub Status</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col items-center text-center">
          <TrendingUp size={16} className="text-slate-400 mb-2" />
          <p className="text-xl font-black text-slate-800">{careerContext?.alignmentScore || 0}%</p>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Skill Coverage</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col items-center text-center">
          <Briefcase size={16} className="text-slate-400 mb-2" />
          <p className="text-sm font-black text-slate-800 truncate w-full px-2" title={careerContext?.targetRole || 'Not Set'}>
            {careerContext?.targetRole || 'Not Set'}
          </p>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Recommended Role</p>
        </div>
      </div>

      {/* Text Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Current Status</h3>
          <p className="text-sm font-medium text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
            {status}
          </p>
        </div>
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recommended Next Step</h3>
          <p className="text-sm font-bold text-blue-700 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
            {action}
          </p>
        </div>
      </div>

      {/* Skills */}
      {skillsToImprove.length > 0 && (
        <div className="pt-2 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Top Skills to Improve</h3>
          <div className="flex flex-wrap gap-2">
            {skillsToImprove.map((skill, i) => (
              <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-md border border-slate-200">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
