import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTeam } from '../../contexts/TeamContext';
import { Shield, Users, Clock, CheckCircle, XCircle, ArrowLeft, Crown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TeamManagementPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { teams, joinRequests, acceptRequest, rejectRequest, currentUserId, loading, error } = useTeam();

  const team = teams.find(t => t.id === teamId);
  
  // Support both ownerId (Firestore) and leaderId (legacy local migration)
  const teamOwnerId = team?.ownerId || team?.leaderId;

  // Security check: only leader can manage
  useEffect(() => {
    if (team && teamOwnerId !== currentUserId) {
      toast.error('Access Denied: You must be the team leader to manage this team.');
      navigate('/team-finder');
    }
  }, [team, teamOwnerId, currentUserId, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6C4CF1]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-bold text-red-500">Failed to load team data</h2>
        <p className="text-slate-500 mt-2">{error}</p>
        <button onClick={() => navigate('/team-finder')} className="mt-4 text-[#6C4CF1] font-bold hover:underline">
          Return to Team Finder
        </button>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-bold text-slate-900">Team Not Found</h2>
        <button onClick={() => navigate('/team-finder')} className="mt-4 text-[#6C4CF1] font-bold hover:underline">
          Return to Team Finder
        </button>
      </div>
    );
  }

  // Prevent rendering if not leader (avoids flash of content before redirect)
  if (teamOwnerId !== currentUserId) {
    return null;
  }

  const teamRequests = joinRequests.filter(r => r.teamId === teamId && r.status === 'pending');
  const isTeamFull = (team.members?.length || 0) >= team.maxMembers;

  const handleAccept = async (requestId) => {
    try {
      acceptRequest(requestId);
      toast.success('Request accepted! Member added to team.');
    } catch (err) {
      toast.error(err.message || 'Failed to accept request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      rejectRequest(requestId);
      toast.success('Request rejected.');
    } catch (err) {
      toast.error(err.message || 'Failed to reject request');
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Hackathon': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Startup': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Project': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Competition': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Open Source': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-slate-50 font-sans pb-20 p-4 lg:p-6">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation / Header */}
        <button 
          onClick={() => navigate('/team-finder')}
          className="flex items-center gap-2 text-[13px] font-bold text-slate-500 hover:text-slate-900 transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back to Teams
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="flex items-start gap-4">
            {team.logo ? (
              <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-slate-200 shadow-sm bg-white">
                <img src={team.logo} alt="Team Logo" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl shrink-0 border border-slate-200 bg-white flex items-center justify-center shadow-sm">
                <Shield size={28} className="text-[#6C4CF1]" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{team.name}</h1>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider border ${getCategoryColor(team.category)}`}>
                  {team.category}
                </span>
                {team.visibility === 'Private' && (
                  <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Private</span>
                )}
              </div>
              <p className="text-[14px] font-medium text-slate-500 max-w-2xl">
                {team.description}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Pending Requests Section */}
            <div className="bg-white rounded-[20px] border border-slate-200 p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-amber-500" />
                  <h2 className="text-[16px] font-bold text-slate-900">Pending Requests</h2>
                  <span className="bg-amber-100 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{teamRequests.length}</span>
                </div>
              </div>

              {teamRequests.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {teamRequests.map(req => (
                    <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <img 
                          src={`https://api.dicebear.com/7.x/notionists/svg?seed=${req.userName}&backgroundColor=e2e8f0`} 
                          alt="Applicant" 
                          className="w-10 h-10 rounded-full bg-slate-200 border border-white shadow-sm"
                        />
                        <div>
                          <p className="text-[14px] font-bold text-slate-900">{req.userName}</p>
                          <p className="text-[12px] font-medium text-slate-500 mt-0.5">"{req.message}"</p>
                          <p className="text-[10px] font-semibold text-slate-400 mt-1">
                            Requested {new Date(req.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button 
                          onClick={() => handleReject(req.id)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
                          title="Reject Request"
                        >
                          <XCircle size={18} />
                        </button>
                        <button 
                          onClick={() => handleAccept(req.id)}
                          disabled={isTeamFull}
                          className="px-4 h-9 flex items-center gap-2 rounded-lg bg-[#6C4CF1] text-white text-[13px] font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <CheckCircle size={16} />
                          Accept
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {isTeamFull && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[12px] font-bold flex items-center gap-2">
                      <XCircle size={14} /> Team is full. You cannot accept new members until someone leaves.
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-10 text-center flex flex-col items-center">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                    <Clock size={20} className="text-slate-400" />
                  </div>
                  <p className="text-[14px] font-bold text-slate-900">No pending requests</p>
                  <p className="text-[12px] font-medium text-slate-500 mt-1">When users apply to join, their requests will appear here.</p>
                </div>
              )}
            </div>

          </div>

          {/* Sidebar Column */}
          <div className="flex flex-col gap-6">
            
            {/* Team Roster Section */}
            <div className="bg-white rounded-[20px] border border-slate-200 p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-[#6C4CF1]" />
                  <h2 className="text-[16px] font-bold text-slate-900">Current Members</h2>
                </div>
                <span className="text-[12px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                  {team.members?.length || 0} / {team.maxMembers}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full mb-6 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${isTeamFull ? 'bg-red-500' : 'bg-[#6C4CF1]'}`}
                  style={{ width: `${((team.members?.length || 0) / team.maxMembers) * 100}%` }}
                ></div>
              </div>

              <div className="flex flex-col gap-4">
                {(team.members || []).map(memberId => {
                  const isLeader = memberId === teamOwnerId;
                  // Use leaderName if available (legacy), else fall back gracefully
                  const memberName = isLeader
                    ? (team.leaderName || 'Team Leader')
                    : `Team Member (${memberId.substring(0, 6)})`;
                  
                  return (
                    <div key={memberId} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img 
                            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${memberName}&backgroundColor=e2e8f0`} 
                            alt="Member" 
                            className="w-10 h-10 rounded-full bg-slate-200 border border-white shadow-sm"
                          />
                          {isLeader && (
                            <div className="absolute -bottom-1 -right-1 bg-amber-400 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center" title="Team Leader">
                              <Crown size={8} className="text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-slate-900 line-clamp-1">{memberName}</p>
                          <p className="text-[11px] font-medium text-slate-500">{isLeader ? 'Team Leader' : 'Member'}</p>
                        </div>
                      </div>
                      {!isLeader && (
                        <button className="text-[11px] font-bold text-slate-400 hover:text-red-500 transition-colors">
                          Remove
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
