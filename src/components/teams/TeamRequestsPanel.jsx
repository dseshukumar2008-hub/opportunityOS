import { Check, X, Inbox } from 'lucide-react';
import { useTeam } from '../../contexts/TeamContext';

export default function TeamRequestsPanel() {
  const { getRequestsForMyTeams, acceptRequest, rejectRequest, teams } = useTeam();
  
  const pendingRequests = getRequestsForMyTeams();

  if (!pendingRequests || pendingRequests.length === 0) {
    return (
      <div className="card-standard p-8 flex flex-col items-center justify-center text-center bg-slate-50 border border-slate-100">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-slate-300">
          <Inbox size={24} />
        </div>
        <h3 className="text-[15px] font-bold text-slate-700 mb-1">No Pending Requests</h3>
        <p className="text-[13px] text-slate-500 max-w-[80%] mx-auto">
          When students request to join teams you lead, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pendingRequests.map(req => {
        const team = teams.find(t => t.id === req.teamId);
        return (
          <div key={req.id} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-indigo-200 transition-colors">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-[14px] font-bold text-slate-900">{req.userName}</h4>
                <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  wants to join
                </span>
                <span className="text-[12px] font-bold text-indigo-600">{team?.name}</span>
              </div>
              <p className="text-[13px] text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-100 mt-2">
                "{req.message}"
              </p>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={() => rejectRequest(req.id)}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                title="Reject"
              >
                <X size={16} strokeWidth={3} />
              </button>
              <button 
                onClick={() => acceptRequest(req.id, req.teamId, req.userId)}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[13px] font-bold px-4 py-2 rounded-full transition-colors shadow-sm"
              >
                <Check size={16} strokeWidth={3} /> Accept
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
