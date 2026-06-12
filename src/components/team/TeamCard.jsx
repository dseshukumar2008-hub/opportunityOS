import { useState } from 'react';
import { Users, ShieldCheck, Bot, Trophy, Rocket, Code2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTeam } from '../../contexts/TeamContext';
import toast from 'react-hot-toast';

export default function TeamCard({ team, mode }) {
  const { joinTeam, getMyPendingRequests } = useTeam();
  const navigate = useNavigate();
  const [isJoining, setIsJoining] = useState(false);
  
  const pendingRequests = getMyPendingRequests();
  const hasRequested = pendingRequests.some(r => r.teamId === team.id);


  const handleJoin = async () => {
    try {
      setIsJoining(true);
      await joinTeam(team.id);
      // Removed duplicate toast.success since TeamContext already triggers it
    } catch (err) {
      // Removed duplicate toast.error since TeamContext already triggers it
    } finally {
      setIsJoining(false);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Hackathon': return 'bg-purple-100 text-[#6C4CF1] border-purple-200';
      case 'Startup': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Project': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Competition': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Open Source': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getTeamIcon = (name) => {
    if (name.includes('AI')) return <Bot size={24} className="text-[#6C4CF1]" />;
    if (name.includes('Hackathon')) return <Trophy size={24} className="text-amber-500" />;
    if (name.includes('Startup')) return <Rocket size={24} className="text-emerald-500" />;
    if (name.includes('Open Source')) return <Code2 size={24} className="text-blue-600" />;
    return <Users size={24} className="text-[#6C4CF1]" />;
  };
  
  const getTeamIconBg = (name) => {
    if (name.includes('AI')) return 'bg-purple-50';
    if (name.includes('Hackathon')) return 'bg-amber-50';
    if (name.includes('Startup')) return 'bg-emerald-50';
    if (name.includes('Open Source')) return 'bg-blue-50';
    return 'bg-purple-50';
  };

  return (
    <div className="card-standard card-hover p-6 flex flex-col h-full transition-all">
      
      {/* Header Row */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${getTeamIconBg(team.name)}`}>
          {getTeamIcon(team.name)}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className="card-title">{team.name}</h3>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getCategoryColor(team.category)}`}>
              {team.category}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 text-[12px] font-medium">
            <ShieldCheck size={14} className="text-[#6C4CF1]" />
            <span>Leader: {team.leaderName}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-[14px] text-slate-600 leading-relaxed mb-6">
        {team.description}
      </p>

      {/* Required Skills */}
      <div className="mb-6">
        <p className="text-[12px] font-medium text-slate-500 mb-2">Required Skills</p>
        <div className="flex flex-wrap gap-2">
          {team.requiredSkills.map(skill => (
            <span key={skill} className="bg-slate-100 text-slate-700 text-[11px] font-bold px-3 py-1.5 rounded-lg">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer (Members & Action) */}
      <div className="mt-auto flex items-center justify-between pt-4">
        <div className="flex items-center gap-2 text-slate-500 text-[13px]">
          <Users size={16} />
          <span><span className="text-[#6C4CF1] font-bold">{team.members?.length || 0} / {team.maxMembers}</span> <span className="font-medium text-slate-500">members</span></span>
        </div>
        
        {mode === 'discover' && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate(`/team/${team.id}`)}
              className="btn-secondary h-10 px-4 text-[13px]"
            >
              View
            </button>
            <button 
              onClick={handleJoin}
              disabled={isJoining || (team.members?.length || 0) >= team.maxMembers || hasRequested}
              className="btn-primary h-10 px-6 text-[13px]"
            >
              {isJoining ? 'Joining...' : hasRequested ? 'Requested' : 'Join Team'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
