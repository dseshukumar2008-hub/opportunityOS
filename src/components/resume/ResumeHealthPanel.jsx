import { useState, useEffect } from 'react';
import { 
  Target, 
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  Lightbulb,
  Search,
  Zap,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useResume } from '../../contexts/ResumeContext';

export default function ResumeHealthPanel() {
  const { resumeData, getResumeStrength } = useResume();
  const [targetRole, setTargetRole] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const baseStrength = getResumeStrength();

  useEffect(() => {
    // Simulated live ATS heuristic based on current data
    const analyzeResume = () => {
      const issues = [];
      const suggestions = [];
      let scoreModifier = 0;

      // 1. Profile Strength
      const pi = resumeData.personalInfo || {};
      if (!pi.linkedin || !pi.github) {
        issues.push('Missing professional links (LinkedIn/GitHub).');
        suggestions.push('Add LinkedIn and GitHub to boost profile visibility by 15%.');
        scoreModifier -= 5;
      }

      // 2. Skills Coverage
      const skills = resumeData.skills || [];
      if (skills.length < 5) {
        issues.push('Low skill coverage.');
        suggestions.push('Add at least 5-8 relevant technical skills.');
        scoreModifier -= 10;
      }

      // 3. Project Quality
      const projects = resumeData.projects || [];
      const projectsWithDetails = projects.filter(p => p.description?.length > 50);
      if (projects.length === 0) {
        issues.push('No projects listed.');
      } else if (projectsWithDetails.length === 0) {
        issues.push('Project descriptions are too short.');
        suggestions.push('Expand project descriptions to include technologies used and impact.');
        scoreModifier -= 5;
      }

      // 4. Experience Depth
      const exp = resumeData.experience || [];
      const expWithBullets = exp.filter(e => e.responsibilities?.includes('-'));
      if (exp.length > 0 && expWithBullets.length === 0) {
        issues.push('Experience lacks formatted bullet points.');
        suggestions.push('Use bullet points starting with action verbs for experience.');
        scoreModifier -= 5;
      }

      // 5. Quantified Achievements
      const hasNumbers = /\d+/.test(JSON.stringify(projects) + JSON.stringify(exp));
      if (!hasNumbers) {
        issues.push('Missing quantified achievements.');
        suggestions.push('Add metrics (e.g., "improved by 20%") to demonstrate impact.');
        scoreModifier -= 15;
      }

      // 6. Target Role Matching
      if (targetRole) {
        const targetWords = targetRole.toLowerCase().split(' ');
        const resumeText = JSON.stringify(resumeData).toLowerCase();
        const missingKeywords = targetWords.filter(w => !resumeText.includes(w));
        
        if (missingKeywords.length > 0) {
          issues.push(`Missing role keywords: ${missingKeywords.join(', ')}`);
          suggestions.push(`Include "${missingKeywords[0]}" naturally in your summary or skills.`);
          scoreModifier -= 10;
        } else {
          scoreModifier += 10;
        }
      }

      const checklist = [];
      
      // Professional Summary
      if (pi.summary && pi.summary.length > 20) {
        checklist.push({ text: 'Professional Summary Present', status: 'success' });
      } else {
        checklist.push({ text: 'Professional Summary Missing', status: 'error' });
      }

      // Contact Info
      if (pi.fullName && pi.email && pi.phone) {
        checklist.push({ text: 'Contact Information Complete', status: 'success' });
      } else {
        checklist.push({ text: 'Contact Information Incomplete', status: 'error' });
      }

      // Professional Links
      if (pi.linkedin || pi.github) {
        checklist.push({ text: 'Professional Links Added', status: 'success' });
      } else {
        checklist.push({ text: 'GitHub / LinkedIn Missing', status: 'error' });
      }

      // Experience
      if (exp.length > 0) {
        checklist.push({ text: 'Experience Section Added', status: 'success' });
      } else {
        checklist.push({ text: 'No Experience Added', status: 'error' });
      }

      // Projects
      if (projects.length > 0) {
        checklist.push({ text: 'Projects Section Added', status: 'success' });
      } else {
        checklist.push({ text: 'Projects Section Missing', status: 'warning' });
      }

      // Skills
      if (skills.length >= 5) {
        checklist.push({ text: 'Skills Section Robust', status: 'success' });
      } else if (skills.length > 0) {
        checklist.push({ text: 'Skills Section Incomplete', status: 'warning' });
      } else {
        checklist.push({ text: 'Skills Section Missing', status: 'error' });
      }

      // Certifications
      const certs = resumeData.certifications || [];
      if (certs.length > 0) {
        checklist.push({ text: 'Certifications Added', status: 'success' });
      } else {
        checklist.push({ text: 'Certifications Missing', status: 'warning' });
      }

      const finalScore = Math.max(0, Math.min(100, baseStrength + scoreModifier));

      setAnalysis({
        score: finalScore,
        issues,
        suggestions,
        checklist
      });
    };

    const debounce = setTimeout(analyzeResume, 500);
    return () => clearTimeout(debounce);
  }, [resumeData, baseStrength, targetRole]);

  if (!analysis) return null;

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Activity size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Live ATS Health</h3>
            <p className="text-xs font-medium text-slate-500">Real-time resume optimization</p>
          </div>
        </div>

        {/* Score Display */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">ATS Match Score</span>
          <span className={`text-2xl font-black ${analysis.score >= 80 ? 'text-emerald-500' : analysis.score >= 60 ? 'text-amber-500' : 'text-rose-500'}`}>
            {analysis.score}%
          </span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${analysis.score >= 80 ? 'bg-emerald-500' : analysis.score >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
            style={{ width: `${analysis.score}%` }}
          ></div>
        </div>
      </div>

      <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-6">
        {/* Job Target Optimization */}
        <div>
          <label className="flex items-center gap-2 text-[13px] font-bold text-slate-800 mb-2">
            <Target size={16} className="text-indigo-500" />
            Target Role Optimization
          </label>
          <div className="relative">
            <input 
              type="text" 
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g., Frontend Developer"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-[13px] focus:outline-none focus:border-indigo-500 transition-all bg-slate-50 focus:bg-white"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* Actionable Insights Checklist */}
        <div>
          <h4 className="flex items-center gap-2 text-[13px] font-bold text-slate-800 mb-3">
            <Activity size={16} className="text-emerald-500" />
            Resume Insights
          </h4>
          <ul className="flex flex-col gap-2">
            {analysis.checklist?.map((item, idx) => (
              <li key={idx} className={`flex items-center gap-2 text-[12px] font-medium p-2.5 rounded-xl border ${
                item.status === 'success' ? 'bg-emerald-50/50 text-emerald-700 border-emerald-100/50' :
                item.status === 'warning' ? 'bg-amber-50/50 text-amber-700 border-amber-100/50' :
                'bg-rose-50/50 text-rose-700 border-rose-100/50'
              }`}>
                {item.status === 'success' && <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />}
                {item.status === 'warning' && <AlertTriangle size={14} className="text-amber-500 shrink-0" />}
                {item.status === 'error' && <XCircle size={14} className="text-rose-500 shrink-0" />}
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        {/* Actionable Insights (Priority Fixes) */}
        <div>
          <h4 className="flex items-center gap-2 text-[13px] font-bold text-slate-800 mb-3">
            <Zap size={16} className="text-amber-500" />
            Priority Fixes ({analysis.issues.length})
          </h4>
          {analysis.issues.length === 0 ? (
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
              <CheckCircle2 size={16} /> No critical issues found!
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {analysis.issues.map((issue, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[12px] font-medium text-slate-600 bg-rose-50/50 p-3 rounded-xl border border-rose-100/50">
                  <AlertCircle size={14} className="text-rose-500 shrink-0 mt-0.5" />
                  {issue}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h4 className="flex items-center gap-2 text-[13px] font-bold text-slate-800 mb-3">
            <Lightbulb size={16} className="text-indigo-500" />
            AI Recommendations
          </h4>
          {analysis.suggestions.length === 0 ? (
             <div className="text-xs font-medium text-slate-500 text-center py-4">
               Looking good! Add more content for deeper analysis.
             </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {analysis.suggestions.map((suggestion, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[12px] font-medium text-slate-600 bg-indigo-50/30 p-3 rounded-xl border border-indigo-100/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}
