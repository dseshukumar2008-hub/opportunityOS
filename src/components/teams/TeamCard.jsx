import { Users, Code, Info, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useTeam } from '../../contexts/TeamContext';

export default function TeamCard({ team, mode = 'discover' }) {
  const { joinTeam } = useTeam();
  const [isJoining, setIsJoining] = useState(false);
  
  const { matchData } = team;

  const handleJoin = async () => {
    setIsJoining(true);
    await joinTeam(team.id);
    setIsJoining(false);
  };

  return (
    <div className="card-standard p-6 border border-slate-100 hover:border-indigo-100 transition-colors flex flex-col h-full bg-white relative overflow-hidden group">
      
      {/* Top Header */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div>
          <h3 className="text-[18px] font-black text-slate-900 leading-tight mb-1">{team.name}</h3>
          <p className="text-[13px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md inline-block">
            {team.projectIdea || 'General Project'}
          </p>
        </div>
        
        {mode === 'discover' && matchData && (
          <div className="bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl text-center">
            <span className="block text-[14px] font-black text-emerald-600">{matchData.score}%</span>
            <span className="block text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Match</span>
          </div>
        )}
      </div>

      <p className="text-[13px] text-slate-500 mb-6 line-clamp-2 flex-grow">
        {team.description || 'No description provided.'}
      </p>

      {/* Match Reasons */}
      {mode === 'discover' && matchData?.reasons?.length > 0 && (
        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 mb-6 relative z-10">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Why it's a match</p>
          <div className="space-y-1">
            {matchData.reasons.map((reason, idx) => (
              <p key={idx} className="text-[12px] font-medium text-slate-700">{reason}</p>
            ))}
          </div>
        </div>
      )}

      {/* Details Footer */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50 relative z-10">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 flex items-center gap-1">
              <Users size={12} /> Members
            </span>
            <span className="text-[13px] font-bold text-slate-700">
              {team.members?.length || 1} / {team.maxMembers}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 flex items-center gap-1">
              <Code size={12} /> Skills
            </span>
            <span className="text-[13px] font-bold text-slate-700 truncate max-w-[100px]">
              {team.requiredSkills?.length > 0 ? team.requiredSkills[0] : 'Any'} {team.requiredSkills?.length > 1 ? `+${team.requiredSkills.length - 1}` : ''}
            </span>
          </div>
        </div>

        {mode === 'discover' && (
          <button 
            onClick={handleJoin}
            disabled={isJoining || team.members?.length >= team.maxMembers}
            className="bg-slate-900 hover:bg-indigo-600 text-white text-[12px] font-bold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {isJoining ? 'Sending...' : team.members?.length >= team.maxMembers ? 'Full' : 'Join'}
          </button>
        )}
        {mode === 'my-team' && (
          <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[12px] font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1">
            Manage <ChevronRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
