import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConnections } from '../../contexts/ConnectionContext';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  Users, Search, MessageSquare, UserMinus, GraduationCap,
  Link2, ChevronRight, Sparkles, X
} from 'lucide-react';
import EmptyState from '../../components/ui/EmptyState';

function Avatar({ seed, size = 'md', className = '' }) {
  const sizes = { sm: 'w-10 h-10', md: 'w-12 h-12', lg: 'w-16 h-16' };
  return (
    <img
      src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=e2e8f0`}
      alt={seed}
      className={`${sizes[size]} rounded-2xl object-cover bg-slate-100 border border-slate-100 shrink-0 ${className}`}
    />
  );
}



// Confirmation dialog
function ConfirmDialog({ name, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full animate-in fade-in zoom-in-95 duration-150">
        <button onClick={onCancel} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X size={18} />
        </button>
        <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
          <UserMinus size={20} className="text-red-500" />
        </div>
        <h3 className="text-[16px] font-bold text-slate-900 mb-1">Remove Connection</h3>
        <p className="text-[13px] text-slate-500 mb-6">
          Are you sure you want to remove <strong>{name}</strong> from your connections?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="btn-secondary flex-1 h-10 text-[13px]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-10 rounded-xl bg-red-500 text-white text-[13px] font-bold hover:bg-red-600 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ConnectionsPage() {
  const navigate = useNavigate();
  const { getMyConnections, getMutualCount, removeConnection } = useConnections();
  const { addNotification } = useNotifications();

  const [search, setSearch] = useState('');
  const [confirmRemove, setConfirmRemove] = useState(null); // { connectionId, name }

  const myConnections = getMyConnections();

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return myConnections;
    return myConnections.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.headline || '').toLowerCase().includes(q) ||
      (c.college || '').toLowerCase().includes(q)
    );
  }, [myConnections, search]);

  const handleRemove = () => {
    if (!confirmRemove) return;
    removeConnection(confirmRemove.connectionId);
    addNotification({
      category: 'Connections',
      title: 'Connection Removed',
      message: `You removed ${confirmRemove.name} from your connections.`,
    });
    setConfirmRemove(null);
  };

  const handleMessage = () => {
    navigate('/messages');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-[#F4F2FF] flex items-center justify-center">
              <Link2 size={18} className="text-[#6C4CF1]" />
            </div>
            <h1 className="page-header">My Connections</h1>
          </div>
          <p className="page-subheader mt-0 ml-12">
            {myConnections.length} connection{myConnections.length !== 1 ? 's' : ''}
          </p>
        </div>

        <button
          onClick={() => navigate('/network/requests')}
          className="btn-primary px-5 h-10 text-[13px] flex items-center gap-2 shadow-[0_2px_10px_rgba(108,76,241,0.2)]"
        >
          <Users size={15} />
          View Requests
        </button>
      </div>

      {/* Search */}
      {myConnections.length > 0 && (
        <div className="relative mb-6">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search connections..."
            className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-700 placeholder-slate-400 outline-none focus:border-[#6C4CF1] transition-colors"
          />
        </div>
      )}

      {/* Connection Grid */}
      {myConnections.length === 0 ? (
        <div className="card-standard p-0 overflow-hidden">
          <EmptyState
            icon={Users}
            title="No Connections Yet"
            description="Start connecting with students and professionals to build your network."
          />
          <div className="pb-8 text-center">
            <button
              onClick={() => navigate('/opportunities')}
              className="btn-primary inline-flex items-center gap-2 px-6 h-10 text-[13px] shadow-[0_2px_10px_rgba(108,76,241,0.2)]"
            >
              <Sparkles size={14} />
              Discover People
            </button>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-standard p-0 overflow-hidden">
          <EmptyState
            icon={Search}
            title="No results"
            description={`No connections matching "${search}".`}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(conn => {
            const mutual = getMutualCount(conn.id);
            return (
              <div
                key={conn.connectionId}
                className="card-standard card-hover p-5 group"
              >
                <div className="flex items-start gap-4">
                  <Avatar seed={conn.avatarSeed || conn.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => navigate(`/user/${conn.id}`)}
                      className="card-title hover:text-[#6C4CF1] transition-colors truncate block text-left w-full"
                    >
                      {conn.name}
                    </button>
                    <p className="text-[12px] text-slate-500 font-medium mt-0.5 line-clamp-1">
                      {conn.headline}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <GraduationCap size={11} className="text-[#6C4CF1] shrink-0" />
                      <p className="text-[11px] text-slate-400 font-medium truncate">{conn.college}</p>
                    </div>
                    {mutual > 0 && (
                      <p className="text-[11px] text-slate-400 font-semibold mt-1">
                        {mutual} mutual connection{mutual !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>

                {/* Skills */}
                {conn.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {conn.skills.slice(0, 3).map(skill => (
                      <span key={skill} className="px-2 py-0.5 bg-[#F4F2FF] text-[#6C4CF1] text-[10px] font-bold rounded-md">
                        {skill}
                      </span>
                    ))}
                    {conn.skills.length > 3 && (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-md">
                        +{conn.skills.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50">
                  <button
                    onClick={() => handleMessage(conn)}
                    className="flex-1 flex items-center justify-center gap-1.5 h-9 bg-[#F4F2FF] text-[#6C4CF1] text-[12px] font-bold rounded-xl hover:bg-indigo-100 transition-colors"
                  >
                    <MessageSquare size={13} />
                    Message
                  </button>
                  <button
                    onClick={() => navigate(`/user/${conn.id}`)}
                    className="btn-secondary flex items-center justify-center h-9 px-3 text-[12px]"
                  >
                    <ChevronRight size={14} />
                  </button>
                  <button
                    onClick={() => setConfirmRemove({ connectionId: conn.connectionId, name: conn.name })}
                    className="btn-secondary flex items-center justify-center h-9 px-3 border-transparent hover:border-red-100 hover:bg-red-50 hover:text-red-500"
                    title="Remove connection"
                  >
                    <UserMinus size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmRemove && (
        <ConfirmDialog
          name={confirmRemove.name}
          onConfirm={handleRemove}
          onCancel={() => setConfirmRemove(null)}
        />
      )}
    </div>
  );
}
