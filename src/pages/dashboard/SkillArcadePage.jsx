import { useState, useEffect } from 'react';
import { 
  Gamepad2, Play, Clock, HelpCircle, 
  Puzzle, Keyboard, Brain, Target, ChevronRight, MoreVertical, Zap
} from 'lucide-react';
import { useSkillArcade } from '../../contexts/SkillArcadeContext';
import SkillSprintGame from '../../features/skillArcade/components/SkillSprintGame';
import TechMatchGame from '../../features/skillArcade/components/TechMatchGame';
import CodeRushGame from '../../features/skillArcade/components/CodeRushGame';
import CareerQuizGame from '../../features/skillArcade/components/CareerQuizGame';

function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
}

export default function SkillArcadePage() {
  const { stats, isInitializing } = useSkillArcade();
  const [activeGame, setActiveGame] = useState(null);
  const [dailyCountdown, setDailyCountdown] = useState('');

  // Daily Challenge countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      const diffMs = endOfDay.getTime() - now.getTime();
      
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      setDailyCountdown(`${hours}h ${mins}m left`);
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // update every minute
    return () => clearInterval(interval);
  }, []);

  if (isInitializing) {
    return <div className="flex items-center justify-center h-full">Loading Arcade...</div>;
  }

  // If a game is active, show the game view overlaid
  if (activeGame === 'Skill Sprint') return <SkillSprintGame onClose={() => setActiveGame(null)} />;
  if (activeGame === 'Tech Match') return <TechMatchGame onClose={() => setActiveGame(null)} />;
  if (activeGame === 'Code Rush') return <CodeRushGame onClose={() => setActiveGame(null)} />;
  if (activeGame === 'Career Quiz') return <CareerQuizGame onClose={() => setActiveGame(null)} />;

  const dailyProgress = stats.dailyChallenge?.progress || 0;
  const isDailyCompleted = stats.dailyChallenge?.completed || false;
  
  const handleDailyClick = () => {
    if (!isDailyCompleted) {
      setActiveGame('Career Quiz');
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-8 h-full overflow-y-auto scrollbar-hide">
      
      {/* 1. MAIN PAGE HEADER */}
      <div className="mb-10">
        <h1 className="text-[28px] font-bold text-slate-900 mb-1.5 flex items-center gap-2 tracking-tight">
          Skill Arcade <span className="text-[#6C4CF1]"><Gamepad2 size={26} /></span>
        </h1>
        <p className="text-[14px] text-slate-500 font-medium">
          Learn. Play. Improve. Short challenges to test and sharpen your skills.
        </p>
      </div>

      {/* 2. FEATURED CHALLENGE */}
      <h2 className="text-[16px] font-bold text-slate-900 mb-4">Featured Challenge</h2>
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-12 flex flex-col md:flex-row items-center gap-6 md:gap-8 relative overflow-hidden">
        <div className="w-28 h-28 shrink-0 bg-[#EBE8FF] rounded-[20px] flex items-center justify-center relative border border-[#6C4CF1]/20">
          <Clock size={56} className="text-[#6C4CF1]" strokeWidth={1.5} />
          <div className="absolute inset-0 flex items-center justify-center mt-2">
            <Zap size={28} className="text-[#6C4CF1] fill-[#6C4CF1]" />
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="text-[22px] font-bold text-slate-900 mb-1.5 tracking-tight">Skill Sprint</h3>
          <p className="text-[14px] font-medium text-slate-500 mb-4 max-w-md leading-relaxed">
            60-second challenge with career, coding<br className="hidden md:block" /> and technology questions.
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-md text-[12px] font-bold text-slate-600">
              <Clock size={13} className="text-slate-400" /> 60 sec
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-md text-[12px] font-bold text-slate-600">
              <HelpCircle size={13} className="text-slate-400" /> 10+ Questions
            </div>
          </div>
        </div>
        <div className="shrink-0 md:pr-4">
          <button onClick={() => setActiveGame('Skill Sprint')} className="flex items-center gap-2 bg-gradient-to-r from-[#6C4CF1] to-[#5538EE] hover:from-[#5A3EE0] hover:to-[#4529CF] text-white px-8 py-3 rounded-xl font-bold text-[14px] transition-colors shadow-md shadow-[#6C4CF1]/30">
            <Play size={16} className="fill-white" /> Play Now
          </button>
        </div>
      </div>

      {/* 3. OTHER CHALLENGES & DAILY CHALLENGE */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-4">
        <div className="col-span-3">
          <h2 className="text-[16px] font-bold text-slate-900">Other Challenges</h2>
        </div>
        <div className="col-span-1 flex justify-between items-center">
          <h2 className="text-[16px] font-bold text-slate-900">Daily Challenge</h2>
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-sm">
            <Clock size={12} className="text-slate-400" /> {dailyCountdown}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
        {/* Tech Match */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-full hover:shadow-md hover:border-slate-300 transition-all">
          <div className="flex items-start gap-4 mb-3">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
              <Puzzle size={24} className="text-green-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-0.5 tracking-tight">Tech Match</h4>
              <p className="text-[13px] font-medium text-slate-500 leading-relaxed">
                Match technologies<br/>with their correct<br/>categories.
              </p>
            </div>
          </div>
          <div className="mt-auto pt-5 flex items-center justify-between border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-400">
              <Clock size={14} /> 5 min
            </div>
            <button onClick={() => setActiveGame('Tech Match')} className="text-green-700 font-bold text-[12px] px-5 py-1.5 rounded-lg border-2 border-green-200 hover:bg-green-50 transition-colors">
              Play
            </button>
          </div>
        </div>

        {/* Code Rush */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-full hover:shadow-md hover:border-slate-300 transition-all">
          <div className="flex items-start gap-4 mb-3">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
              <Keyboard size={24} className="text-orange-500" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-0.5 tracking-tight">Code Rush</h4>
              <p className="text-[13px] font-medium text-slate-500 leading-relaxed">
                Test your typing<br/>speed with coding<br/>snippets.
              </p>
            </div>
          </div>
          <div className="mt-auto pt-5 flex items-center justify-between border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-400">
              <Clock size={14} /> 30 sec
            </div>
            <button onClick={() => setActiveGame('Code Rush')} className="text-orange-600 font-bold text-[12px] px-5 py-1.5 rounded-lg border-2 border-orange-200 hover:bg-orange-50 transition-colors">
              Play
            </button>
          </div>
        </div>

        {/* Career Quiz */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-full hover:shadow-md hover:border-slate-300 transition-all">
          <div className="flex items-start gap-4 mb-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <Brain size={24} className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-0.5 tracking-tight">Career Quiz</h4>
              <p className="text-[13px] font-medium text-slate-500 leading-relaxed">
                Test your knowledge<br/>about roles and<br/>career paths.
              </p>
            </div>
          </div>
          <div className="mt-auto pt-5 flex items-center justify-between border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-400">
              <Clock size={14} /> 5 min
            </div>
            <button onClick={() => setActiveGame('Career Quiz')} className="text-blue-600 font-bold text-[12px] px-5 py-1.5 rounded-lg border-2 border-blue-200 hover:bg-blue-50 transition-colors">
              Play
            </button>
          </div>
        </div>

        {/* Daily Challenge */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-full hover:shadow-md hover:border-slate-300 transition-all">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-[#EBE8FF] flex items-center justify-center shrink-0 border border-[#6C4CF1]/20">
              <Target size={28} className="text-[#6C4CF1]" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-0.5 text-[14px]">Answer 5 Career Questions</h4>
              <p className="text-[12px] font-medium text-slate-500">
                Reward: <span className="font-bold text-[#6C4CF1]">+100 XP</span>
              </p>
            </div>
          </div>
          <div className="mt-auto pt-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-2 bg-[#EBE8FF] rounded-full overflow-hidden flex">
                <div className="h-full bg-[#6C4CF1] rounded-full transition-all duration-500" style={{ width: `${(dailyProgress / 5) * 100}%` }}></div>
              </div>
              <div className="text-[12px] font-bold text-slate-500 shrink-0 tabular-nums">
                <span className="text-[#6C4CF1]">{dailyProgress}</span> / 5
              </div>
            </div>
            <button 
              onClick={handleDailyClick}
              disabled={isDailyCompleted}
              className={`w-full py-2.5 rounded-xl border-2 font-bold text-[13px] transition-colors ${
                isDailyCompleted 
                  ? 'border-green-200 bg-green-50 text-green-600'
                  : 'border-[#6C4CF1]/20 bg-[#6C4CF1]/5 text-[#6C4CF1] hover:bg-[#6C4CF1]/10'
              }`}
            >
              {isDailyCompleted ? 'Completed' : 'Start Challenge'}
            </button>
          </div>
        </div>
      </div>

      {/* 4. RECENT ACTIVITY */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[16px] font-bold text-slate-900">Recent Activity</h2>
        <button className="text-[13px] font-bold text-[#6C4CF1] hover:text-[#5138ED] flex items-center gap-1 transition-colors">
          View History <ChevronRight size={14} />
        </button>
      </div>
      
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-12">
        <div className="overflow-x-auto">
          {stats.recentActivity && stats.recentActivity.length > 0 ? (
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Game</th>
                  <th className="text-left py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Score</th>
                  <th className="text-left py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Accuracy</th>
                  <th className="text-left py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Played On</th>
                  <th className="py-3 px-6"></th>
                </tr>
              </thead>
              <tbody>
                {stats.recentActivity.map((activity) => (
                  <tr key={activity.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#EBE8FF] flex items-center justify-center border border-[#6C4CF1]/10">
                          {activity.game === 'Skill Sprint' && <Clock size={16} className="text-[#6C4CF1]" />}
                          {activity.game === 'Tech Match' && <Puzzle size={16} className="text-green-600" />}
                          {activity.game === 'Code Rush' && <Keyboard size={16} className="text-orange-500" />}
                          {activity.game === 'Career Quiz' && <Brain size={16} className="text-blue-600" />}
                        </div>
                        <span className="font-bold text-slate-900 text-[14px]">{activity.game}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-[#6C4CF1] text-[14px]">{activity.score}</td>
                    <td className="py-4 px-6 font-bold text-green-500 text-[14px]">{activity.accuracy}</td>
                    <td className="py-4 px-6 text-[13px] font-medium text-slate-500">
                      {formatTimeAgo(activity.playedOn)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button aria-label="More options" className="text-slate-300 hover:text-slate-500 transition-colors opacity-0 group-hover:opacity-100 focus:outline-none focus:opacity-100 focus-visible:ring-2 focus-visible:ring-indigo-500 rounded">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-slate-500 text-[14px] font-medium">
              No recent activity yet. Play a game to see your stats here!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
