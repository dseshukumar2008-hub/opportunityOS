import { Trophy, Award, Lock, Star, ShieldCheck, Target, Hexagon, Medal } from 'lucide-react';
import { useAchievements } from '../../contexts/AchievementContext';

export default function AchievementsShowcase() {
  const { allBadges, unlockedBadges, getBadgeProgress } = useAchievements();

  // Map category to an icon
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Applications': return <Target size={20} />;
      case 'Networking': return <Hexagon size={20} />;
      case 'Resume': return <ShieldCheck size={20} />;
      case 'Teams': return <Award size={20} />;
      case 'Learning': return <Star size={20} />;
      case 'Career Growth': return <Trophy size={20} />;
      default: return <Medal size={20} />;
    }
  };

  const getBadgeColor = (category) => {
    switch(category) {
      case 'Applications': return 'from-blue-500 to-indigo-600';
      case 'Networking': return 'from-emerald-500 to-teal-600';
      case 'Resume': return 'from-purple-500 to-pink-600';
      case 'Teams': return 'from-amber-500 to-orange-600';
      case 'Learning': return 'from-rose-500 to-red-600';
      case 'Career Growth': return 'from-yellow-400 to-amber-500';
      default: return 'from-slate-500 to-slate-700';
    }
  };

  const latestBadge = unlockedBadges.length > 0 
    ? unlockedBadges.sort((a,b) => new Date(b.unlockedDate) - new Date(a.unlockedDate))[0] 
    : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-[20px] font-extrabold text-slate-900 mb-2 flex items-center gap-2">
            <Trophy className="text-amber-500" size={24} />
            Achievements & Badges
          </h2>
          <p className="text-[14px] text-slate-500 font-medium">Track your milestones and career growth.</p>
        </div>

        <div className="flex gap-4">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 min-w-[120px]">
            <span className="block text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Badges</span>
            <span className="text-[24px] font-extrabold text-slate-900">{unlockedBadges.length} <span className="text-[14px] text-slate-400">/ {allBadges.length}</span></span>
          </div>
          
          {latestBadge && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 min-w-[160px] flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getBadgeColor(latestBadge.category)} flex items-center justify-center text-white shrink-0 shadow-sm`}>
                {getCategoryIcon(latestBadge.category)}
              </div>
              <div>
                <span className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-0.5">Latest Badge</span>
                <span className="text-[14px] font-extrabold text-indigo-950 truncate max-w-[120px] block">{latestBadge.title}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {allBadges.map(badge => {
          const isUnlocked = unlockedBadges.some(b => b.id === badge.id);
          const progress = getBadgeProgress(badge.id);
          const percent = Math.min(100, (progress.current / progress.target) * 100);

          if (isUnlocked) {
            const unlockedData = unlockedBadges.find(b => b.id === badge.id);
            return (
              <div key={badge.id} className="relative group bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getBadgeColor(badge.category)}`}></div>
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getBadgeColor(badge.category)} flex items-center justify-center text-white shadow-sm mb-4`}>
                    {getCategoryIcon(badge.category)}
                  </div>
                  <h4 className="text-[15px] font-extrabold text-slate-900 mb-1">{badge.title}</h4>
                  <p className="text-[13px] text-slate-500 font-medium mb-4">{badge.description}</p>
                </div>
                <div className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md w-fit mt-auto border border-emerald-100">
                  Unlocked {new Date(unlockedData.unlockedDate).toLocaleDateString()}
                </div>
              </div>
            );
          }
          
          return (
            <div key={badge.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between opacity-70 hover:opacity-100 transition-opacity">
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400 mb-4">
                  <Lock size={20} />
                </div>
                <h4 className="text-[15px] font-extrabold text-slate-700 mb-1">{badge.title}</h4>
                <p className="text-[13px] text-slate-500 font-medium mb-4">{badge.description}</p>
              </div>
              
              <div className="mt-auto">
                <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                  <span>{progress.label}</span>
                  <span>{progress.current} / {progress.target}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-400 rounded-full transition-all" style={{ width: `${percent}%` }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
