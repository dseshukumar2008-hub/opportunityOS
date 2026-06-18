import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConnections } from '../../contexts/ConnectionContext';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  UserCheck, UserX, Clock, CheckCircle2, Inbox, SendHorizontal,
  GraduationCap, ChevronRight, ArrowLeft
} from 'lucide-react';
import EmptyState from '../../components/ui/EmptyState';

function Avatar({ seed, size = 'md', className = '' }) {
  const sizes = { sm: 'w-10 h-10', md: 'w-12 h-12', lg: 'w-14 h-14' };
  return (
    <img
      src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=e2e8f0`}
      alt={seed}
      className={`${sizes[size]} rounded-2xl object-cover bg-slate-100 border border-slate-100 shrink-0 ${className}`}
    />
  );
}



export default function ConnectionRequestsPage() {
  const navigate = useNavigate();
  const {
    getIncomingRequests,
    getSentRequests,
    acceptConnectionRequest,
    rejectConnectionRequest,
    withdrawRequest,
  } = useConnections();
  const { addNotification } = useNotifications();

  const [activeTab, setActiveTab] = useState('incoming');
  const [processing, setProcessing] = useState(new Set());

  const incomingRequests = getIncomingRequests();
  const sentRequests = getSentRequests();

  const handleAccept = async (req) => {
    setProcessing(prev => new Set(prev).add(req.id));
    acceptConnectionRequest(req.id);
    addNotification({
      category: 'Connections',
      title: 'Connection Accepted',
      message: `You and ${req.fromUser.name} are now connected.`,
    });
    setTimeout(() => setProcessing(prev => { const s = new Set(prev); s.delete(req.id); return s; }), 400);
  };

  const handleReject = async (req) => {
    setProcessing(prev => new Set(prev).add(req.id));
    rejectConnectionRequest(req.id);
    addNotification({
      category: 'Connections',
      title: 'Connection Request Declined',
      message: `You declined ${req.fromUser.name}'s connection request.`,
    });
    setTimeout(() => setProcessing(prev => { const s = new Set(prev); s.delete(req.id); return s; }), 400);
  };

  const handleWithdraw = (req) => {
    withdrawRequest(req.id);
    addNotification({
      category: 'Connections',
      title: 'Request Withdrawn',
      message: `Connection request to ${req.toUser.name} was withdrawn.`,
    });
  };

  const tabs = [
    { id: 'incoming', label: 'Incoming', count: incomingRequests.length, icon: Inbox },
    { id: 'sent', label: 'Sent', count: sentRequests.length, icon: SendHorizontal },
  ];

  return (
    <div className="max-w-3xl mx-auto p-4 lg:p-6 pb-16">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => navigate('/network/connections')}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-white hover:text-slate-900 transition-colors border border-transparent hover:border-slate-200"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Connection Requests</h1>
          <p className="text-[13px] text-slate-400 font-medium">Manage your pending connection requests</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 mt-6 mb-6 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-[#6C4CF1] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
            {tab.count > 0 && (
              <span className={`text-[10px] font-extrabold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-[#F4F2FF] text-[#6C4CF1]'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ─── INCOMING TAB ─────────────────────────────────────────────── */}
      {activeTab === 'incoming' && (
        <div> 
          {incomingRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100">
              <EmptyState
                icon={CheckCircle2}
                title="You're all caught up!"
                description="No pending connection requests. Keep growing your network."
              />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {incomingRequests.map(req => {
                const user = req.fromUser;
                const isProcessing = processing.has(req.id);
                return (
                  <div
                    key={req.id}
                    className={`bg-white rounded-2xl border border-slate-100 p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md hover:border-slate-200 transition-all ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <Avatar seed={user.avatarSeed || user.name} size="lg" />
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => navigate(`/user/${user.id}`)}
                          className="text-[15px] font-bold text-slate-900 hover:text-[#6C4CF1] transition-colors truncate block text-left"
                        >
                          {user.name}
                        </button>
                        <p className="text-[12px] text-slate-500 font-medium mt-0.5 line-clamp-1">
                          {user.headline}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <GraduationCap size={11} className="text-[#6C4CF1] shrink-0" />
                          <p className="text-[11px] text-slate-400 font-medium">{user.college}</p>
                        </div>
                        <p className="text-[10px] text-slate-300 font-medium mt-1 flex items-center gap-1">
                          <Clock size={9} />
                          {new Date(req.sentAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleAccept(req)}
                        className="flex items-center gap-1.5 px-5 h-10 bg-[#6C4CF1] text-white text-[13px] font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-[0_2px_8px_rgba(108,76,241,0.2)]"
                      >
                        <UserCheck size={14} />
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(req)}
                        className="flex items-center gap-1.5 px-5 h-10 bg-white border border-slate-200 text-slate-600 text-[13px] font-bold rounded-xl hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all"
                      >
                        <UserX size={14} />
                        Reject
                      </button>
                      <button
                        onClick={() => navigate(`/user/${user.id}`)}
                        className="hidden sm:flex w-9 h-9 items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── SENT TAB ─────────────────────────────────────────────────── */}
      {activeTab === 'sent' && (
        <div>
          {sentRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100">
              <EmptyState
                icon={SendHorizontal}
                title="No Sent Requests"
                description="You haven't sent any connection requests yet."
              />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {sentRequests.map(req => {
                const user = req.toUser;
                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md hover:border-slate-200 transition-all"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <Avatar seed={user.avatarSeed || user.name} size="lg" />
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => navigate(`/user/${user.id}`)}
                          className="text-[15px] font-bold text-slate-900 hover:text-[#6C4CF1] transition-colors truncate block text-left"
                        >
                          {user.name}
                        </button>
                        <p className="text-[12px] text-slate-500 font-medium mt-0.5 line-clamp-1">
                          {user.headline}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <GraduationCap size={11} className="text-[#6C4CF1] shrink-0" />
                          <p className="text-[11px] text-slate-400 font-medium">{user.college}</p>
                        </div>
                      </div>
                    </div>

                    {/* Status + Withdraw */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-xl">
                        <Clock size={12} className="text-amber-500" />
                        <span className="text-[12px] font-bold text-amber-600">Pending</span>
                      </div>
                      <button
                        onClick={() => handleWithdraw(req)}
                        className="text-[12px] font-semibold text-slate-400 hover:text-red-500 transition-colors px-2 py-1.5 hover:bg-red-50 rounded-lg"
                      >
                        Withdraw
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
