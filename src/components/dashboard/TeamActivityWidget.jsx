import { useState } from 'react';
import { Users2, MessageSquare, Clock, UserPlus, ChevronRight } from 'lucide-react';
import { useTeam } from '../../contexts/TeamContext';
import { useConnections } from '../../contexts/ConnectionContext';
import { Link } from 'react-router-dom';

export default function TeamActivityWidget() {
  const [activeTab, setActiveTab] = useState('teams'); // 'teams' | 'pending'
  const { getMyTeams, getMyPendingRequests: getPendingTeamRequests } = useTeam();
  const { getIncomingRequests, getSentRequests } = useConnections();
  
  const myTeams = getMyTeams().slice(0, 3);
  
  const pendingTeamRequests = getPendingTeamRequests();
  const incomingConnections = getIncomingRequests();
  const sentConnections = getSentRequests();
  
  const allPending = [
    ...pendingTeamRequests.map(r => ({ ...r, type: 'team' })),
    ...incomingConnections.map(r => ({ ...r, type: 'incoming_connection' })),
    ...sentConnections.map(r => ({ ...r, type: 'sent_connection' }))
  ].sort((a, b) => new Date(b.createdAt || b.sentAt || 0) - new Date(a.createdAt || a.sentAt || 0)).slice(0, 3);

  return (
    <div className="card-standard p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
          <Users2 size={14} className="text-indigo-600" />
        </div>
        <h3 className="text-[16px] font-black text-slate-900">Team Activity</h3>
        <Link to="/team-finder" className="ml-auto text-[12px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5">
          View teams <ChevronRight size={14} />
        </Link>
      </div>
      
      <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg mb-4 shrink-0">
        <button
          onClick={() => setActiveTab('teams')}
          className={`flex-1 text-[11px] font-bold py-1.5 rounded-md transition-colors ${activeTab === 'teams' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
        >
          My Teams
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 flex items-center justify-center gap-1.5 text-[11px] font-bold py-1.5 rounded-md transition-colors ${activeTab === 'pending' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Pending {allPending.length > 0 && <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[9px]">{allPending.length}</span>}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        {activeTab === 'teams' && (
          myTeams.length > 0 ? (
            <div className="flex flex-col gap-2">
              {myTeams.map(team => (
                <div key={team.id} className="p-3 rounded-xl border border-slate-100 bg-white flex items-center gap-3 hover:border-indigo-100 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
                    <span className="text-[12px] font-black text-indigo-600">{team.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-bold text-slate-900 truncate">{team.name}</h4>
                    <p className="text-[11px] font-medium text-slate-500 truncate">{team.category || 'General'}</p>
                  </div>
                  <Link to={`/team-finder?teamId=${team.id}`} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-400 hover:text-indigo-600 shrink-0">
                    <MessageSquare size={14} />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center items-center text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
              <Users2 className="text-slate-300 mb-2" size={24} />
              <p className="text-[12px] font-bold text-slate-600">No active teams</p>
            </div>
          )
        )}
        
        {activeTab === 'pending' && (
          allPending.length > 0 ? (
            <div className="flex flex-col gap-2">
              {allPending.map(item => (
                <div key={item.id} className="p-3 rounded-xl border border-slate-100 bg-white flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    {item.type === 'team' ? <Users2 size={12} className="text-slate-500" /> : <UserPlus size={12} className="text-slate-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[12px] font-bold text-slate-900 truncate">
                      {item.type === 'team' ? 'Team Request' : item.type === 'incoming_connection' ? `${item.fromUser?.name} wants to connect` : `Request sent to ${item.toUser?.name}`}
                    </h4>
                    <p className="text-[10px] font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                      <Clock size={10} /> Pending
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center items-center text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
              <Clock className="text-slate-300 mb-2" size={24} />
              <p className="text-[12px] font-bold text-slate-600">No pending requests</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
