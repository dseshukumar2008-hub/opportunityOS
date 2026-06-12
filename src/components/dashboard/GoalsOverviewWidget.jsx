import { Target, Flag, ArrowUpRight } from 'lucide-react';
import { useGoals } from '../../contexts/GoalContext';
import { Link } from 'react-router-dom';

export default function GoalsOverviewWidget() {
  const { goals } = useGoals();
  
  if (!goals || goals.length === 0) return null; // Don't show if no goals

  const activeGoals = goals.filter(g => g.status === 'In Progress' || g.status === 'Not Started');
  const completedGoals = goals.filter(g => g.status === 'Completed');
  const completionRate = goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0;

  // Find the goal closest to completion that isn't completed yet
  const closestGoal = [...activeGoals].sort((a, b) => {
    const aProgress = a.currentValue / a.targetValue;
    const bProgress = b.currentValue / b.targetValue;
    return bProgress - aProgress; // Descending
  })[0];

  return (
    <div className="card-standard p-6 flex flex-col justify-between mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
            <Target size={16} className="text-indigo-600" />
          </div>
          <h3 className="card-title">Career Goals</h3>
        </div>
        <Link to="/goals" className="text-[13px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
          View All <ArrowUpRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Active Goals</p>
          <p className="text-[20px] font-black text-slate-900">{activeGoals.length}</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Completion Rate</p>
          <p className="text-[20px] font-black text-emerald-600">{completionRate}%</p>
        </div>
      </div>

      {closestGoal && (
        <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1">
              <Flag size={12} /> Next Milestone
            </p>
            <span className="text-[11px] font-bold text-indigo-400">{Math.round((closestGoal.currentValue / closestGoal.targetValue) * 100)}%</span>
          </div>
          <p className="text-[13px] font-extrabold text-slate-900 truncate">{closestGoal.title}</p>
          <div className="relative h-1.5 bg-indigo-100 rounded-full overflow-hidden mt-2">
            <div 
              className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full"
              style={{ width: `${(closestGoal.currentValue / closestGoal.targetValue) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
