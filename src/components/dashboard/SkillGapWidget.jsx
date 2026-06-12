import { Link } from 'react-router-dom';
import { Layers, ChevronRight } from 'lucide-react';
import { useDashboardInsights } from '../../hooks/useDashboardInsights';

export default function SkillGapWidget() {
  const { skillGap, isLoading } = useDashboardInsights();

  if (isLoading) {
    return (
      <div className="card-standard p-6 animate-pulse h-full">
        <div className="h-5 w-40 bg-slate-200 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-10 bg-slate-100 rounded-lg"></div>
          <div className="h-10 bg-slate-100 rounded-lg"></div>
          <div className="h-10 bg-slate-100 rounded-lg"></div>
        </div>
      </div>
    );
  }

  // Mocking skills based on reference image
  const skillsToLearn = skillGap?.missing?.length > 0 ? skillGap.missing.slice(0, 3).map((s, i) => ({
    name: s,
    priority: i < 2 ? 'High Priority' : 'Medium Priority'
  })) : [
    { name: 'React.js', priority: 'High Priority' },
    { name: 'System Design', priority: 'High Priority' },
    { name: 'PostgreSQL', priority: 'Medium Priority' }
  ];

  const getPriorityColor = (priority) => {
    if (priority === 'High Priority') return 'text-indigo-600 bg-indigo-50 border-indigo-100';
    if (priority === 'Medium Priority') return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    return 'text-slate-600 bg-slate-50 border-slate-100';
  };

  return (
    <div className="card-standard p-6 h-full flex flex-col bg-white border border-slate-100 rounded-[24px] shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[16px] font-black text-slate-900">Skill Gap Analysis</h3>
        <Link to="/analytics" className="text-[12px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1">
          View full report <ChevronRight size={14} />
        </Link>
      </div>

      <p className="text-[13px] font-medium text-slate-500 mb-5">
        Top skills to learn based on your target roles
      </p>

      <div className="flex flex-col gap-3 flex-1">
        {skillsToLearn.map((skill, idx) => (
          <div key={idx} className="flex items-center justify-between pb-3 border-b border-slate-100 last:border-0 last:pb-0">
            <span className="text-[13px] font-bold text-slate-700 capitalize">{skill.name}</span>
            <div className="flex items-center gap-4 w-[120px] justify-between">
              <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${skill.priority === 'High Priority' ? 'bg-indigo-500' : 'bg-emerald-500'}`} style={{ width: skill.priority === 'High Priority' ? '80%' : '50%' }}></div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 border w-20 text-center ${getPriorityColor(skill.priority)}`}>
                {skill.priority}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button className="px-6 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-[12px] font-bold transition-colors">
          Start Learning
        </button>
      </div>
    </div>
  );
}
