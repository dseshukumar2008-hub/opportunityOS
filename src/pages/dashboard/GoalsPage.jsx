import { useState } from 'react';
import { Target, Plus, Flag, CheckCircle2, CircleDashed } from 'lucide-react';
import { useGoals } from '../../contexts/GoalContext';
import CreateGoalModal from '../../components/goals/CreateGoalModal';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';

export default function GoalsPage() {
  const { goals } = useGoals();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const completedGoals = goals.filter(g => g.status === 'Completed').length;
  const inProgressGoals = goals.filter(g => g.status === 'In Progress').length;
  const completionRate = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-[28px] font-extrabold text-slate-900 tracking-tight mb-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[#6C4CF1]/10 flex items-center justify-center">
              <Target size={20} className="text-[#6C4CF1]" />
            </div>
            Career Goals
          </h1>
          <p className="text-[15px] text-slate-500 font-medium">
            Track your progress and stay focused on your career journey.
          </p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#6C4CF1] hover:bg-[#5b3fda] text-white px-5 py-2.5 rounded-xl font-bold text-[14px] transition-all shadow-sm hover:shadow shrink-0"
        >
          <Plus size={18} />
          Create Goal
        </button>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Goals', value: goals.length, icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Completed', value: completedGoals, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'In Progress', value: inProgressGoals, icon: CircleDashed, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Completion Rate', value: `${completionRate}%`, icon: Flag, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
                <Icon size={24} className={stat.color} />
              </div>
              <div>
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-[24px] font-black text-slate-900 leading-none mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No goals created yet"
          description="Set career milestones — like landing an internship, learning a new skill, or growing your network. OpportunityOS tracks your progress automatically."
          actionText="Create First Goal"
          onAction={() => setIsModalOpen(true)}
          secondaryText="Explore Career Roadmap"
          secondaryLink="/career-roadmap"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map(goal => {
            const progress = (goal.currentValue / goal.targetValue) * 100;
            const cappedProgress = Math.min(progress, 100);
            
            let statusColor = 'text-amber-500 bg-amber-50';
            if (goal.status === 'Completed') statusColor = 'text-emerald-600 bg-emerald-50';
            else if (goal.status === 'Not Started') statusColor = 'text-slate-500 bg-slate-100';

            return (
              <div key={goal.id} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                {goal.status === 'Completed' && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                )}
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wide ${statusColor}`}>
                    {goal.status}
                  </span>
                  <span className="text-[12px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                    {goal.category}
                  </span>
                </div>
                
                <h3 className="text-[16px] font-extrabold text-slate-900 mb-6 group-hover:text-[#6C4CF1] transition-colors">{goal.title}</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-[12px] font-bold">
                    <span className="text-slate-500">Progress</span>
                    <span className="text-slate-900">{goal.currentValue} / {goal.targetValue}</span>
                  </div>
                  <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${goal.status === 'Completed' ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
                      style={{ width: `${cappedProgress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-[12px] font-bold text-slate-400">
                  <span>Due: {new Date(goal.targetDate).toLocaleDateString()}</span>
                  <span>{Math.round(cappedProgress)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CreateGoalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
