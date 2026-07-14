import { useState } from 'react';
import { Copy, Check, Sparkles, BookOpen, Award, Briefcase, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResumeContentSuggestions({ results }) {
  const [copiedStates, setCopiedStates] = useState({});

  if (!results) return null;

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [id]: true }));
    toast.success('Copied to clipboard');
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const {
    contentSuggestions,
    missingKeywords,
    recommendedSkills,
    recommendedCertifications,
    recommendedProjects
  } = results;

  // Render a "Perfect" state if there are no AI suggestions (fallback)
  if (!contentSuggestions && (!missingKeywords || missingKeywords.length === 0)) {
    return (
      <div className="mt-8 bg-indigo-50 border border-indigo-100 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600">
          <Sparkles size={24} />
        </div>
        <h3 className="text-lg font-bold text-indigo-800 mb-2">AI Analysis Pending</h3>
        <p className="text-sm font-medium text-indigo-600/80 max-w-sm">
          Please run a new analysis to generate personalized content rewrite suggestions and career recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-10 w-full max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
            <Sparkles size={18} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">AI Resume Consultant</h2>
        </div>
        <p className="text-sm font-medium text-slate-500">
          Tailored content rewrites and strategic career recommendations based on your profile.
        </p>
      </div>

      {/* 1. Summary Rewrite */}
      {contentSuggestions?.summary?.improved && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <FileText size={18} className="text-slate-700" />
            <h3 className="text-lg font-bold text-slate-800">Professional Summary</h3>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              <div className="p-5 bg-slate-50/50">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Current</span>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {contentSuggestions.summary.current || "No summary provided."}
                </p>
              </div>
              <div className="p-5 relative group">
                <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider mb-2 block flex items-center gap-1">
                  <Sparkles size={12} /> AI Improved
                </span>
                <p className="text-sm text-slate-800 font-medium leading-relaxed mb-6">
                  {contentSuggestions.summary.improved}
                </p>
                <button 
                  onClick={() => handleCopy(contentSuggestions.summary.improved, 'summary')}
                  className="absolute bottom-4 right-4 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 text-slate-600 px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  {copiedStates['summary'] ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  {copiedStates['summary'] ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Project Rewrites */}
      {contentSuggestions?.projects && contentSuggestions.projects.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Briefcase size={18} className="text-slate-700" />
            <h3 className="text-lg font-bold text-slate-800">Project Enhancements</h3>
          </div>
          <div className="space-y-4">
            {contentSuggestions.projects.map((proj, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-100">
                  <span className="font-semibold text-slate-700">{proj.title}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                  <div className="p-5 bg-slate-50/30">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Current Bullet Points</span>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {proj.current}
                    </p>
                  </div>
                  <div className="p-5 relative group">
                    <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider mb-2 block flex items-center gap-1">
                      <Sparkles size={12} /> Impact-Driven Rewrite
                    </span>
                    <p className="text-sm text-slate-800 font-medium leading-relaxed mb-6 whitespace-pre-wrap">
                      {proj.improved}
                    </p>
                    <button 
                      onClick={() => handleCopy(proj.improved, `proj-${idx}`)}
                      className="absolute bottom-4 right-4 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 text-slate-600 px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      {copiedStates[`proj-${idx}`] ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      {copiedStates[`proj-${idx}`] ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Missing ATS Keywords */}
      {missingKeywords && missingKeywords.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={18} className="text-amber-500" />
            <h3 className="text-lg font-bold text-slate-800">Critical ATS Keywords Missing</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {missingKeywords.map((kw, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col hover:border-amber-300 transition-colors">
                <span className="font-bold text-slate-800 text-sm mb-1">{kw.keyword}</span>
                <span className="text-xs text-slate-500 leading-snug">{kw.reason}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Career Recommendations Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        
        {/* Skills */}
        {recommendedSkills && recommendedSkills.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <h4 className="font-bold text-slate-800">Target Skills</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {recommendedSkills.map((skill, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md text-xs font-semibold">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {recommendedCertifications && recommendedCertifications.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Award size={16} className="text-blue-500" />
              <h4 className="font-bold text-slate-800">Recommended Certs</h4>
            </div>
            <ul className="space-y-2">
              {recommendedCertifications.map((cert, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span className="leading-snug">{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Projects */}
        {recommendedProjects && recommendedProjects.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={16} className="text-purple-500" />
              <h4 className="font-bold text-slate-800">Portfolio Ideas</h4>
            </div>
            <ul className="space-y-2">
              {recommendedProjects.map((proj, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span className="leading-snug">{proj}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

    </div>
  );
}
