import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTeam } from '../../contexts/TeamContext';
import { useOnlineStatus } from '../../contexts/OnlineStatusContext';
import StatusDot from '../../components/ui/StatusDot';
import { Shield, Users, CheckCircle, XCircle, ArrowLeft, Crown, MessageSquare, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TeamDetailsPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { teams, joinRequests, teamMessages, teamLastRead, acceptRequest, rejectRequest, currentUserId, sendTeamMessage, markTeamAsRead, loading, error } = useTeam();
  const { getUserStatus } = useOnlineStatus();
  const [activeTab, setActiveTab] = useState('overview');
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);

  const team = teams.find(t => t.id === teamId);

  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      markTeamAsRead(teamId); // Mark as read when opening or receiving while open
    }
  }, [activeTab, teamMessages, teamId, markTeamAsRead]);

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

  // Support both ownerId (Firestore) and leaderId (legacy local migration)
  const teamOwnerId = team.ownerId || team.leaderId;
  const isLeader = teamOwnerId === currentUserId;
  const isMember = (team.members || []).includes(currentUserId);
  const teamRequests = joinRequests.filter(r => r.teamId === teamId && r.status === 'pending');
  const currentTeamMessages = teamMessages.filter(m => m.teamId === teamId);
  const isTeamFull = (team.members?.length || 0) >= team.maxMembers;
  
  // Calculate unread chat messages
  const lastReadStr = teamLastRead[teamId];
  const lastReadTime = lastReadStr ? new Date(lastReadStr).getTime() : 0;
  const unreadChatCount = currentTeamMessages.filter(m => 
    m.senderId !== currentUserId && 
    new Date(m.timestamp).getTime() > lastReadTime
  ).length;

  const handleAccept = (requestId) => {
    try {
      acceptRequest(requestId);
      toast.success('Request accepted! Member added to team.');
    } catch (err) {
      toast.error(err.message || 'Failed to accept request');
    }
  };

  const handleReject = (requestId) => {
    try {
      rejectRequest(requestId);
      toast.success('Request rejected.');
    } catch (err) {
      toast.error(err.message || 'Failed to reject request');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    try {
      sendTeamMessage(teamId, messageInput.trim());
      setMessageInput('');
    } catch (err) {
      toast.error(err.message || 'Failed to send message');
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

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'members', label: 'Members' }
  ];

  if (isLeader) {
    tabs.push({ id: 'requests', label: 'Requests' });
  }
  tabs.push({ id: 'chat', label: 'Chat', badge: unreadChatCount });

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

        <div className="card-standard p-6 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex items-start gap-4">
            {team.logo ? (
              <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-slate-200 shadow-sm bg-white">
                <img src={team.logo} alt="Team Logo" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl shrink-0 border border-slate-200 bg-[#F4F2FF] flex items-center justify-center shadow-sm">
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
              <p className="page-subheader mt-0 max-w-2xl">
                {team.description}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-6 overflow-x-auto hide-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-bold transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id 
                  ? 'border-[#6C4CF1] text-[#6C4CF1]' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label} 
              {tab.id === 'requests' && teamRequests.length > 0 && `(${teamRequests.length})`}
              {tab.badge > 0 && activeTab !== 'chat' && (
                <span className="flex items-center justify-center w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                  {tab.badge > 9 ? '9+' : tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="card-standard p-6 min-h-[400px]">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-6">
              <h2 className="section-header mb-2">Team Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[12px] font-bold text-slate-400 mb-1">Leader</p>
                    <p className="text-[14px] font-semibold text-slate-900 flex items-center gap-2">
                    <Crown size={14} className="text-amber-500" /> {team.leaderName || 'Team Leader'}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[12px] font-bold text-slate-400 mb-1">Capacity</p>
                  <p className="text-[14px] font-semibold text-slate-900">
                    {team.members?.length || 0} / {team.maxMembers} Members
                  </p>
                </div>
              </div>
              
              <h2 className="section-header mt-4 mb-2">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {team.requiredSkills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[13px] font-medium border border-slate-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* MEMBERS TAB */}
          {activeTab === 'members' && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="section-header">Current Members</h2>
                <span className="text-[12px] font-bold text-[#6C4CF1] bg-[#F4F2FF] px-2 py-1 rounded-lg">
                  {team.members?.length || 0} / {team.maxMembers} Total
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {(team.members || []).map(memberId => {
                  const isTeamLeader = memberId === teamOwnerId;
                  const memberName = isTeamLeader
                    ? (team.leaderName || 'Team Leader')
                    : `Team Member (${memberId.substring(0, 6)})`;
                  const { status: memberStatus } = getUserStatus(memberName);
                  return (
                    <div key={memberId} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50">
                      <div className="relative">
                        <img 
                          src={`https://api.dicebear.com/7.x/notionists/svg?seed=${memberName}&backgroundColor=e2e8f0`} 
                          alt="Member" 
                          className="w-10 h-10 rounded-full border border-slate-200"
                        />
                        {isTeamLeader && (
                          <div className="absolute -bottom-1 -right-1 bg-amber-400 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
                            <Crown size={8} className="text-white" />
                          </div>
                        )}
                        {!isTeamLeader && (
                          <span className="absolute -bottom-0.5 -right-0.5 ring-2 ring-white rounded-full">
                            <StatusDot status={memberStatus} size="sm" />
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-slate-900 line-clamp-1">{memberName}</p>
                        <p className="text-[11px] font-medium text-slate-500">{isTeamLeader ? 'Team Leader' : 'Member'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* REQUESTS TAB */}
          {activeTab === 'requests' && isLeader && (
            <div className="flex flex-col gap-6">
              <h2 className="section-header mb-2">Pending Requests</h2>
              {teamRequests.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {teamRequests.map(req => (
                    <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                      <div className="flex items-center gap-3">
                        <img 
                          src={`https://api.dicebear.com/7.x/notionists/svg?seed=${req.userName}&backgroundColor=e2e8f0`} 
                          alt="Applicant" 
                          className="w-10 h-10 rounded-full bg-slate-200 border border-white"
                        />
                        <div>
                          <p className="text-[14px] font-bold text-slate-900">{req.userName}</p>
                          <p className="text-[12px] font-medium text-slate-500 mt-0.5">"{req.message}"</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button 
                          onClick={() => handleReject(req.id)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <XCircle size={18} />
                        </button>
                        <button 
                          onClick={() => handleAccept(req.id)}
                          disabled={isTeamFull}
                          className="btn-primary px-4 h-9 text-[13px] flex items-center gap-2"
                        >
                          <CheckCircle size={16} /> Accept
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
                <div className="py-10 text-center text-slate-500">
                  <p className="text-sm font-medium">No pending requests at the moment.</p>
                </div>
              )}
            </div>
          )}

          {/* CHAT TAB */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-[500px] -m-6 rounded-b-2xl overflow-hidden bg-slate-50 relative">
              {!isMember ? (
                <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-[#F4F2FF] rounded-full flex items-center justify-center mb-4">
                    <MessageSquare size={28} className="text-[#6C4CF1]" />
                  </div>
                  <h3 className="section-header mb-2">Private Team Chat</h3>
                  <p className="text-sm font-medium text-slate-500">Join this team to participate in team discussions.</p>
                </div>
              ) : null}

              {/* Chat Header */}
              <div className="px-6 py-4 bg-white border-b border-slate-200 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F4F2FF] flex items-center justify-center">
                    <Users size={18} className="text-[#6C4CF1]" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900">{team.name}</h3>
                    {(() => {
                      const onlineCount = (team.members || []).filter(mid => {
                        const name = mid === teamOwnerId ? (team.leaderName || 'Team Leader') : `Team Member (${mid.substring(0, 6)})`;
                        const { status } = getUserStatus(name);
                        return status === 'online';
                      }).length + 1; // +1 for current user who is always online
                      return (
                        <p className="text-[12px] font-medium text-emerald-500 flex items-center gap-1.5 mt-0.5">
                          <StatusDot status="online" size="sm" />
                          {onlineCount} Member{onlineCount !== 1 ? 's' : ''} Online
                        </p>
                      );
                    })()}
                  </div>
                </div>
                <div className="text-[12px] font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg">
                  {team.members?.length || 0} Total Members
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-[#F8FAFC]">
                {currentTeamMessages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                    <MessageSquare size={32} className="mb-2 opacity-50" />
                    <p className="text-sm font-medium">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  currentTeamMessages.map((msg) => {
                    const isMe = msg.senderId === currentUserId;
                    return (
                      <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] sm:max-w-[65%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          {!isMe && (
                            <div className="flex items-center gap-2 mb-1 pl-1">
                              <div className="relative">
                                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${msg.senderName}&backgroundColor=e2e8f0`} alt={msg.senderName} className="w-5 h-5 rounded-full" />
                                <span className="absolute -bottom-px -right-px ring-1 ring-white rounded-full">
                                  <StatusDot status={getUserStatus(msg.senderName).status} size="sm" />
                                </span>
                              </div>
                              <span className="text-[11px] font-bold text-slate-600">{msg.senderName}</span>
                            </div>
                          )}
                          <div 
                            className={`px-4 py-2.5 rounded-2xl shadow-sm text-[14px] leading-relaxed ${
                              isMe 
                                ? 'bg-[#6C4CF1] text-white rounded-br-sm' 
                                : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                            }`}
                          >
                            {msg.content}
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium mt-1 px-1">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-slate-200 shrink-0">
                <form onSubmit={handleSendMessage} className="relative flex items-center">
                  <input
                    type="text"
                    disabled={!isMember}
                    placeholder="Type a team message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-[13px] font-medium placeholder-slate-400 focus:bg-white focus:border-[#6C4CF1] focus:ring-2 focus:ring-[#6C4CF1]/20 transition-all outline-none disabled:opacity-50"
                  />
                  <button 
                    type="submit"
                    disabled={!messageInput.trim() || !isMember}
                    className="absolute right-2 w-8 h-8 flex items-center justify-center bg-[#6C4CF1] text-white rounded-lg hover:bg-[#6C4CF1] disabled:opacity-50 disabled:hover:bg-[#6C4CF1] transition-colors"
                  >
                    <Send size={14} className="ml-0.5" />
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
