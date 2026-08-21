import { motion } from 'framer-motion';
import { 
  RefreshCw, Star, GitFork, CheckCircle, AlertTriangle, Rocket, Monitor, ArrowRight,
  Users, UserPlus, Calendar, Folder
} from 'lucide-react';

export default function GithubResults({ results, onReset }) {
  if (!results) return null;

  const {
    username,
    targetRole,
    githubScore = 0,
    alignmentScore = 0,
    basicStats = {},
    careerMatch = {},
    languageStats = [],
    heatmap = [],
    totalContributions = 0,
    strengths = [],
    weaknesses = [],
    recommendations = [],
    repos = [],
    analysisSummary = [],
    overallAssessment = ""
  } = results;

  // Render a simple SVG doughnut chart
  const renderDoughnut = () => {
    let currentOffset = 0;
    const colors = ['#3B82F6', '#F59E0B', '#10B981', '#8B5CF6', '#9CA3AF'];
    const radius = 40;
    const circumference = 2 * Math.PI * radius;

    return (
      <svg viewBox="0 0 100 100" className="w-[120px] h-[120px] transform -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#F1F5F9" strokeWidth="18" />
        {languageStats.slice(0, 5).map((lang, idx) => {
          if (lang.percentage === 0) return null;
          const gap = 1.5;
          const strokeLength = Math.max(0, ((lang.percentage / 100) * circumference) - gap);
          const strokeDasharray = `${strokeLength} ${circumference}`;
          const strokeDashoffset = -currentOffset;
          currentOffset += (lang.percentage / 100) * circumference;

          return (
            <circle
              key={lang.name}
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke={colors[idx % colors.length]}
              strokeWidth="18"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          );
        })}
      </svg>
    );
  };

  const renderHeatmap = () => {
    const intensityColors = [
      'bg-slate-100', // 0
      'bg-indigo-200', // 1
      'bg-indigo-400', // 2
      'bg-indigo-600', // 3
      'bg-[#6C4CF1]'  // 4
    ];

    if (!heatmap || heatmap.length === 0) {
      return (
        <div className="w-full h-[100px] bg-slate-50 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-sm font-medium text-slate-400">
          Activity data not available
        </div>
      );
    }

    return (
      <div className="flex gap-[3px] overflow-x-auto pb-2 scrollbar-hide">
        {heatmap.map((week, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-[3px]">
            {(week.days || []).map((intensity, dIdx) => (
              <div 
                key={`${wIdx}-${dIdx}`} 
                className={`w-[11px] h-[11px] rounded-[2px] ${intensityColors[intensity] || intensityColors[0]}`}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  const parseInsight = (text) => {
    if (text.includes(':')) {
      const parts = text.split(':');
      return { title: parts[0].trim(), desc: parts.slice(1).join(':').trim() };
    }
    const match = text.match(/^([*#]*.*?[.!?])\s+(.*)$/);
    if (match) {
      return { title: match[1].replace(/[*#]/g, '').trim(), desc: match[2].trim() };
    }
    return { title: text.replace(/[*#]/g, '').trim(), desc: "" };
  };

  const colors = ['bg-blue-500', 'bg-amber-500', 'bg-emerald-500', 'bg-purple-500', 'bg-slate-400'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto px-4 py-8 space-y-6"
    >
      {/* 1. REPORT HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
            GitHub Analysis <span className="text-[#6C4CF1]">@{username}</span>
          </h2>
          <div className="flex items-center gap-3 mt-1.5 text-sm font-medium text-slate-500">
            <span>Target Role: <strong className="text-slate-700">{targetRole}</strong></span>
            <span className="text-slate-300">•</span>
            <span>Analyzed: Just now</span>
          </div>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
        >
          <RefreshCw size={15} strokeWidth={2.5} /> Analyze Another Profile   
        </button>
      </div>

      {/* 2. OVERVIEW METRICS (Second Tier) */}
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-2 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          {[
            { label: 'Public Repos', val: basicStats.publicRepos, icon: Folder },
            { label: 'Followers', val: basicStats.followers, icon: Users },
            { label: 'Following', val: basicStats.following, icon: UserPlus },
            { label: 'Total Stars', val: basicStats.totalStars, icon: Star },
            { label: 'Active Since', val: `${basicStats.activeSince}+ yrs`, icon: Calendar }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex flex-col p-6 lg:p-8 items-start lg:items-center text-left lg:text-center hover:bg-slate-50 transition-colors">
                <div className="text-[#6C4CF1] bg-[#F4F2FF] w-10 h-10 rounded-[10px] flex items-center justify-center mb-4">
                  <Icon size={18} strokeWidth={2.5} />
                </div>
                <span className="text-3xl font-black text-slate-900 tracking-tight mb-1.5">{stat.val}</span>
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. OVERVIEW METRICS (Top Tier - 2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Overall Assessment */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex flex-col items-center shrink-0">
            <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-4">GitHub Score</h3>
            <div className="relative w-[120px] h-[120px] flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F1F5F9" strokeWidth="12" />
                <circle
                  cx="50" cy="50" r="40" fill="transparent" stroke="#6C4CF1" strokeWidth="12"
                  strokeDasharray={`${(githubScore / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="text-center mt-1">
                <span className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">{githubScore}</span>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-2">Overall Assessment</h3>
            <p className="text-sm text-slate-700 leading-relaxed font-medium mb-4">
              {overallAssessment || "Strong developer foundation with active repositories."}
            </p>
            <ul className="text-sm text-slate-600 space-y-2 list-none">
              {analysisSummary && analysisSummary.length > 0 && analysisSummary.slice(0, 4).map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0 mt-1.5" />
                  <span className="font-medium text-slate-600">{pt.replace(/[*#]/g, '')}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Career Alignment */}
        <div className="bg-white rounded-2xl py-6 px-6 md:px-8 shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-8 items-center h-fit">
           <div className="flex flex-col items-center shrink-0">
             <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-3">Career Match</h3>
             <div className="w-[100px] h-[100px] bg-slate-50 rounded-[16px] border border-slate-100 flex flex-col items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
               <div className="text-4xl font-extrabold text-[#6C4CF1] tracking-tight leading-none">
                 {alignmentScore}<span className="text-xl text-[#6C4CF1] ml-0.5">%</span>
               </div>
             </div>
           </div>
           <div className="flex-1 w-full flex flex-col justify-center space-y-4">
             {[
               { label: 'Frontend', pct: careerMatch?.frontend || 0, color: 'bg-[#10B981]' },
               { label: 'Backend', pct: careerMatch?.backend || 0, color: 'bg-[#F59E0B]' },
               { label: 'AI / Tools', pct: careerMatch?.aiTools || 0, color: 'bg-[#3B82F6]' },
               { label: 'Cloud / DevOps', pct: careerMatch?.cloudDevOps || 0, color: 'bg-[#8B5CF6]' }
             ].map((skill, idx) => (
               <div key={idx}>
                 <div className="flex justify-between text-xs font-bold mb-1.5">
                   <span className="text-slate-600">{skill.label}</span>
                   <span className="text-slate-900">{skill.pct}%</span>
                 </div>
                 <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                   <div className={`h-full ${skill.color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${skill.pct}%` }}></div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* 4. TOP REPOSITORIES */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Top Repositories</h3>
          <span className="text-[12px] font-semibold text-slate-500">Showing top 5</span>
        </div>
        <div className="divide-y divide-slate-100">
          {Array.from({ length: 5 }).map((_, idx) => {
            const repo = repos[idx];
            if (!repo) return null;
            return (
              <div key={idx} className="p-4 sm:px-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                 <div className="flex-1 min-w-0">
                   <div className="flex items-center gap-2 mb-1">
                     <Monitor size={15} className="text-slate-400 shrink-0" strokeWidth={2} />
                     <h4 className="font-bold text-[#3B82F6] truncate text-sm" title={repo.name}>{repo.name}</h4>
                     {repo.language && (
                       <span className="inline-flex items-center gap-1.5 ml-2 px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[11px] font-bold">
                         <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                         {repo.language}
                       </span>
                     )}
                   </div>
                   <p className="text-xs text-slate-500 truncate font-medium">
                     {repo.description || "No description provided."}
                   </p>
                 </div>
                 <div className="flex items-center gap-5 shrink-0">
                   <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                     <span className="flex items-center gap-1"><Star size={14} /> {repo.stargazers_count}</span>
                     <span className="flex items-center gap-1"><GitFork size={14} /> {repo.forks_count}</span>
                   </div>
                   <div className="w-24 text-right text-[11px] font-medium text-slate-400">
                     {new Date(repo.updated_at).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                   </div>
                 </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. TECH STACK */}
      <div className="grid grid-cols-1 gap-6">
        {/* Language Analysis */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-5">Top Languages</h3>
          <div className="flex items-center gap-8">
            {renderDoughnut()}
            <div className="flex-1 space-y-3">
              {languageStats.slice(0, 5).map((lang, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2.5 h-2.5 rounded-[3px] ${colors[idx % colors.length]}`}></div>
                    <span className="text-sm font-semibold text-slate-700">{lang.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-500">{lang.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 6. INSIGHTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-5">Strengths</h3>
          <ul className="space-y-4">
            {strengths.map((item, idx) => {
              const { title, desc } = parseInsight(item);
              return (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-[#10B981] shrink-0 mt-0.5" strokeWidth={2.5} />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{title}</h4>
                    {desc && <p className="text-[13px] text-slate-500 font-medium mt-0.5">{desc}</p>}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-5">Focus Areas</h3>
          <ul className="space-y-4">
            {weaknesses.map((item, idx) => {
              const { title, desc } = parseInsight(item);
              return (
                <li key={idx} className="flex items-start gap-3">
                  <AlertTriangle size={18} className="text-[#F59E0B] shrink-0 mt-0.5" strokeWidth={2.5} />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{title}</h4>
                    {desc && <p className="text-[13px] text-slate-500 font-medium mt-0.5">{desc}</p>}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* 7. PERSONALIZED RECOMMENDATIONS (Next Best Actions) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
           <Rocket size={16} className="text-[#6C4CF1]" strokeWidth={2.5} />
           <h3 className="text-sm font-bold text-slate-900 tracking-tight">Next Best Actions</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {recommendations && recommendations.length > 0 ? (
            recommendations.map((rec, idx) => (
            <div key={idx} className="p-5 sm:px-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center gap-4">
               <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-extrabold text-xs shrink-0">
                 {idx + 1}
               </div>
               <div className="flex-1">
                 <h4 className="text-sm font-bold text-slate-900">{rec.title}</h4>
                 <p className="text-[13px] text-slate-500 font-medium mt-0.5">{rec.desc}</p>
               </div>
               <div className="shrink-0 flex items-center gap-3">
                  {rec.priority && (
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-md uppercase tracking-wider ${
                      rec.priority.toLowerCase() === 'high' ? 'bg-red-50 text-red-600' :
                      rec.priority.toLowerCase() === 'medium' ? 'bg-amber-50 text-amber-600' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {rec.priority} Impact
                    </span>
                  )}
                  <button className="text-slate-400 hover:text-[#6C4CF1] transition-colors p-1">
                    <ArrowRight size={16} strokeWidth={2} />
                  </button>
               </div>
            </div>
          ))
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm font-medium text-slate-500">No specific actions were identified for your profile.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
