import { useNavigate } from 'react-router-dom';
import { useRecommendedConnections } from '../../hooks/useRecommendedConnections';
import { useConnections } from '../../contexts/ConnectionContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { Users, UserPlus, GraduationCap, Code, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

function Avatar({ seed, size = 'md', className = '' }) {
  const sizes = { sm: 'w-10 h-10', md: 'w-12 h-12', lg: 'w-16 h-16' };
  return (
    <img
      src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=e2e8f0`}
      alt={seed}
      className={`${sizes[size]} rounded-2xl object-cover bg-slate-100 border border-white shadow-sm shrink-0 ${className}`}
    />
  );
}

export default function RecommendedConnectionsWidget({ limit = 5, className = '' }) {
  const navigate = useNavigate();
  const { recommendations, loading, error } = useRecommendedConnections(limit);
  const { sendConnectionRequest, getMutualCount } = useConnections();
  const { addNotification } = useNotifications();

  const handleConnect = (e, user) => {
    e.stopPropagation();
    sendConnectionRequest(user.id);
    addNotification({
      category: 'Connections',
      title: 'Request Sent',
      message: `Connection request sent to ${user.name}.`,
    });
    toast.success('Connection request sent');
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-2xl border border-slate-100 p-5 shadow-sm ${className}`}>
        <div className="h-4 w-40 bg-slate-100 rounded mb-3 animate-pulse" />
        <div className="h-3 w-56 bg-slate-100 rounded mb-5 animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-2/3 bg-slate-100 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-slate-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-2xl border border-red-100 p-5 shadow-sm ${className}`}>
        <h3 className="text-[15px] font-bold text-slate-900 mb-1">People You May Know</h3>
        <p className="text-[12px] font-medium text-red-500">
          Unable to load connection recommendations right now.
        </p>
      </div>
    );
  }

  if ((recommendations || []).length === 0) {
    return (
      <div className={`bg-white rounded-2xl border border-slate-100 p-5 shadow-sm ${className}`}>
        <h3 className="text-[15px] font-bold text-slate-900 mb-1">People You May Know</h3>
        <p className="text-[12px] font-medium text-slate-500 mb-6">
          Connect with students who share similar interests and goals.
        </p>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
            <Users size={20} className="text-slate-300" />
          </div>
          <p className="text-[13px] font-bold text-slate-700">No recommendations available</p>
          <p className="text-[12px] text-slate-400 mt-1 max-w-[200px]">
            Complete your profile to improve recommendations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
          People You May Know
          <Sparkles size={14} className="text-[#6C4CF1]" />
        </h3>
      </div>
      <p className="text-[12px] font-medium text-slate-500 mb-5">
        Connect with students who share similar interests and goals.
      </p>

      <div className="flex flex-col gap-4">
        {(recommendations || []).map(user => {
          const mutualCount = getMutualCount(user.id);
          
          return (
            <div 
              key={user.id} 
              onClick={() => navigate(`/user/${user.id}`)}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100 group"
            >
              <Avatar seed={user.avatarSeed} size="md" />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-[14px] font-bold text-slate-900 truncate">{user.name}</h4>
                  <span className="text-[10px] font-bold text-[#6C4CF1] bg-[#F4F2FF] px-2 py-0.5 rounded-md whitespace-nowrap">
                    {user.matchScore}% Match
                  </span>
                </div>
                
                <p className="text-[12px] text-slate-500 truncate mb-1.5">{user.headline}</p>
                
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-400">
                  {user.sharedSkillsCount > 0 && (
                    <div className="flex items-center gap-1">
                      <Code size={12} />
                      <span>{user.sharedSkillsCount} shared skill{user.sharedSkillsCount !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {mutualCount > 0 && (
                    <div className="flex items-center gap-1">
                      <Users size={12} />
                      <span>{mutualCount} mutual connection{mutualCount !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {user.sharedSkillsCount === 0 && mutualCount === 0 && (
                    <div className="flex items-center gap-1">
                      <GraduationCap size={12} />
                      <span className="truncate">{user.college}</span>
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={(e) => handleConnect(e, user)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#6C4CF1] hover:border-[#6C4CF1] hover:bg-indigo-50 transition-all shrink-0 opacity-0 group-hover:opacity-100 shadow-sm"
                title="Connect"
              >
                <UserPlus size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
