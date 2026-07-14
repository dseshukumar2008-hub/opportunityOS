import { useState } from 'react';
import { Sparkles, Bot, ShieldCheck, Target, ArrowRight, CheckCircle2, XCircle, ChevronRight, FileText, UploadCloud, Map, ChevronDown, ChevronUp } from 'lucide-react';
import { useOpportunityMatch } from '../../hooks/useOpportunityMatch';
import { useMatchResume } from '../../hooks/useMatchResume';

export default function MatchEnginePage() {
  const { analyzeMatch, isAnalyzing, matchResult, error, profileContext } = useOpportunityMatch();
  const { matchResume, isUploading, uploadNewResume } = useMatchResume();
  
  const [opportunityText, setOpportunityText] = useState('');
  const [evidenceExpanded, setEvidenceExpanded] = useState(false);

  const handleAnalyze = () => {
    if (!opportunityText.trim()) return;
    analyzeMatch(opportunityText, null); // uploadedFile is now null, since upload happens immediately
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await uploadNewResume(e.target.files[0]);
    }
  };

  const getMatchRating = (score) => {
    if (score >= 80) return { label: 'Strong Match', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    if (score >= 60) return { label: 'Good Match', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' };
    return { label: 'Needs Work', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mb-2">
            <Sparkles className="text-[#6C4CF1]" size={28} />
            Match Report
          </h1>
          <p className="text-slate-500 font-medium">
            Analyze your fit for any role or project in seconds.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SECTION 5: INPUT PANEL (Shrinks if matchResult exists) */}
        <div className={`space-y-6 ${matchResult ? 'lg:col-span-4' : 'lg:col-span-6 lg:col-start-4'}`}>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4 text-sm uppercase tracking-wider">
              <FileText size={16} className="text-[#6C4CF1]" /> Resume
            </h3>
            
            {isUploading ? (
              <div className="flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg p-6">
                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-sm font-medium text-slate-600">Uploading and extracting skills...</span>
              </div>
            ) : matchResume ? (
              <div className="flex flex-col gap-3 bg-emerald-50/30 border border-emerald-100 rounded-lg p-4">
                 <div className="flex items-start justify-between">
                   <div className="flex items-start gap-3">
                     <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                     <div>
                       <h4 className="text-sm font-bold text-slate-900 mb-0.5">Resume Found</h4>
                       <span className="text-xs font-medium text-slate-600 flex items-center gap-1.5 truncate max-w-[200px]" title={matchResume.resume_file_name}>
                         <FileText size={12} className="text-slate-400" />
                         {matchResume.resume_file_name}
                       </span>
                     </div>
                   </div>
                 </div>
                 
                 <div className="bg-white rounded border border-emerald-50 p-2.5 flex items-center justify-between mt-1 shadow-sm">
                   <div className="flex flex-col">
                     <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Extracted Skills</span>
                     <span className="text-sm font-black text-slate-800">{matchResume.extracted_skills?.length || 0} Skills</span>
                   </div>
                   <div className="flex flex-col items-end">
                     <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Last Updated</span>
                     <span className="text-xs font-medium text-slate-700">{new Date(matchResume.last_updated).toLocaleDateString()}</span>
                   </div>
                 </div>
                 
                 <label className="mt-2 w-full cursor-pointer bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-md py-2 text-xs font-bold transition-colors flex items-center justify-center">
                   Replace Resume
                   <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
                 </label>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
                <UploadCloud size={28} className="text-slate-400 mb-3" />
                <h4 className="text-sm font-bold text-slate-900 mb-1">No Resume Found</h4>
                <p className="text-xs text-slate-500 mb-4 max-w-[250px]">
                  {profileContext?.skills?.length > 0 
                    ? `Using ${profileContext.skills.length} skills from your profile. Upload a resume for better accuracy.` 
                    : 'Upload your resume or add skills to start matching opportunities.'}
                </p>
                <label className="cursor-pointer bg-[#6C4CF1] hover:bg-[#5a3dd9] text-white rounded-lg px-4 py-2 text-sm font-bold transition-colors">
                  Upload Resume
                  <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
            )}

            <h3 className="font-bold text-slate-900 flex items-center gap-2 mt-6 mb-3 text-sm uppercase tracking-wider">
              <Target size={16} className="text-[#6C4CF1]" /> Role / Project Description
            </h3>
            <textarea
              value={opportunityText}
              onChange={(e) => setOpportunityText(e.target.value)}
              placeholder="Paste job description..."
              className={`w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-400 ${matchResult ? 'h-40' : 'h-64'}`}
            />

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || isUploading || !opportunityText.trim() || (!matchResume && (!profileContext?.skills || profileContext.skills.length === 0))}
              className="w-full mt-4 bg-[#6C4CF1] hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl py-2.5 font-bold transition-colors flex items-center justify-center gap-2 text-[14px] shadow-sm"
            >
              {isAnalyzing ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Sparkles size={16} />
              )}
              {isAnalyzing ? 'Analyzing...' : matchResult ? 'Analyze Again' : 'Analyze Match'}
            </button>
            {error && <p className="text-red-500 text-sm font-medium mt-3 text-center">{error}</p>}
          </div>
        </div>

        {/* RESULTS PANEL */}
        {isAnalyzing ? (
           <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center text-center ${matchResult ? 'lg:col-span-8' : 'lg:col-span-12 hidden'}`}>
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-[#6C4CF1] rounded-full blur-xl opacity-20 animate-pulse"></div>
                <div className="w-16 h-16 bg-white border border-slate-100 shadow-xl rounded-2xl flex items-center justify-center relative">
                  <Bot size={32} className="text-[#6C4CF1] animate-bounce" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Analyzing Match...</h3>
           </div>
        ) : matchResult ? (
          <div className="lg:col-span-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* SECTION 1: HERO MATCH SUMMARY */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row items-center md:justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-transparent rounded-bl-full pointer-events-none -z-10"></div>
              
              <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10 w-full md:w-auto text-center sm:text-left">
                {/* Circular Progress Score */}
                <div className="w-20 h-20 shrink-0 relative flex items-center justify-center">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 absolute top-0 left-0">
                    <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#f1f5f9" strokeWidth="3" />
                    <circle 
                      cx="18" cy="18" r="15.91549430918954" fill="transparent" 
                      stroke={matchResult.currentMatchScore >= 80 ? '#10b981' : matchResult.currentMatchScore >= 60 ? '#6366f1' : '#f59e0b'} 
                      strokeWidth="3" 
                      strokeDasharray={`${matchResult.currentMatchScore || 0} ${100 - (matchResult.currentMatchScore || 0)}`} 
                      strokeDashoffset="0" 
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-[18px] font-black text-slate-900 absolute">{matchResult.currentMatchScore || 0}%</span>
                </div>

                <div>
                  <h2 className="text-[18px] font-extrabold text-slate-900 mb-2">Match Analysis</h2>
                  <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[12px] font-bold shadow-sm ring-1 ring-inset ${getMatchRating(matchResult.currentMatchScore).bg} ${getMatchRating(matchResult.currentMatchScore).color} ${getMatchRating(matchResult.currentMatchScore).border}`}>
                    {getMatchRating(matchResult.currentMatchScore).label}
                  </span>
                </div>
              </div>

              {/* Matched & Missing Stats */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="flex-1 md:flex-none bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex flex-col items-center justify-center min-w-[110px]">
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold mb-1">
                    <CheckCircle2 size={16} />
                    <span className="text-[18px]">{matchResult.strengths?.length || 0}</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Matched</span>
                </div>
                <div className="flex-1 md:flex-none bg-rose-50/50 border border-rose-100 rounded-xl p-4 flex flex-col items-center justify-center min-w-[110px]">
                  <div className="flex items-center gap-1.5 text-rose-600 font-bold mb-1">
                    <XCircle size={16} />
                    <span className="text-[18px]">{matchResult.missingSkills?.length || 0}</span>
                  </div>
                  <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Missing</span>
                </div>
              </div>
            </div>

            {/* SECTION 2: MATCHED VS MISSING SKILLS */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Skill Comparison</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Matched */}
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4 border-b border-slate-100 pb-2">
                    <CheckCircle2 size={16} className="text-emerald-500" /> Matched Skills
                  </h4>
                  {matchResult.strengths?.length > 0 ? (
                    <ul className="space-y-2">
                      {matchResult.strengths.map((skill, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm font-medium text-slate-700">
                          <span className="text-emerald-500 mt-0.5">•</span> {skill.name || skill}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500 italic">No exact matches found.</p>
                  )}
                </div>

                {/* Missing */}
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4 border-b border-slate-100 pb-2">
                    <XCircle size={16} className="text-red-500" /> Missing Requirements
                  </h4>
                  {matchResult.missingSkills?.length > 0 ? (
                    <ul className="space-y-2">
                      {matchResult.missingSkills.map((skill, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm font-medium text-slate-700">
                          <span className="text-red-500 mt-0.5">•</span> {skill.name || skill}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500 italic">No missing requirements!</p>
                  )}
                </div>

              </div>
            </div>

            {/* SECTION 3: IMPROVEMENT ROADMAP */}
            {matchResult.recommendations?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Top Improvements</h3>
                <div className="space-y-4">
                  {matchResult.recommendations.slice(0, 5).map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-800">{rec.recommendedAction}</p>
                        <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1">
                          <Target size={12} /> Expected Impact: {rec.matchImpact}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 4: MATCHING EVIDENCE (Collapsible) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <button 
                onClick={() => setEvidenceExpanded(!evidenceExpanded)}
                className="w-full flex items-center justify-between p-6 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
              >
                <span className="font-bold text-slate-900">View Detailed Matching Evidence</span>
                {evidenceExpanded ? <ChevronUp size={20} className="text-slate-400"/> : <ChevronDown size={20} className="text-slate-400"/>}
              </button>
              
              {evidenceExpanded && (
                <div className="p-6 border-t border-slate-200 space-y-6">
                  {/* Evidence List */}
                  {[...(matchResult.strengths || []).map(s => ({...s, status: 'Matched'})), 
                    ...(matchResult.missingSkills || []).map(s => ({...s, status: 'Missing'}))].map((item, idx) => (
                    <div key={idx} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-bold text-sm text-slate-800">{item.name}</h5>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.status === 'Matched' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs font-medium">
                        <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                          <span className="text-slate-400 uppercase tracking-wider block mb-1">Role/Project</span>
                          <span className="text-slate-700">{item.evidence?.opportunity || 'N/A'}</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                          <span className="text-slate-400 uppercase tracking-wider block mb-1">Resume</span>
                          <span className={item.status === 'Matched' ? 'text-emerald-600' : 'text-red-500'}>{item.evidence?.resume || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        ) : null}

      </div>
    </div>
  );
}
