import React from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { Bell, Briefcase, Users, CalendarClock, AlertCircle, CheckCircle } from 'lucide-react';
import EmptyState from '../ui/EmptyState';
import { useNavigate } from 'react-router-dom';

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Applications': return <Briefcase size={16} className="text-blue-500" />;
    case 'Teams': return <Users size={16} className="text-emerald-500" />;
    case 'Opportunities': return <CalendarClock size={16} className="text-[#6C4CF1]" />;
    case 'System': return <AlertCircle size={16} className="text-amber-500" />;
    case 'Deadline': return <CalendarClock size={16} className="text-rose-500" />;
    default: return <Bell size={16} className="text-slate-400" />;
  }
};

const formatTimeAgo = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
};

export default function NotificationsWidget() {
  const { notifications, loading, markAsRead, getUnreadCount } = useNotifications();
  const navigate = useNavigate();
  const unreadCount = getUnreadCount();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-6 flex items-center justify-center h-[350px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6C4CF1]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 flex flex-col h-[350px] shadow-sm">
      <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Bell className="text-[#6C4CF1]" size={20} />
          Notifications
        </h3>
        {unreadCount > 0 && (
          <span className="bg-indigo-50 text-[#6C4CF1] text-[11px] font-bold px-2 py-0.5 rounded-full">
            {unreadCount} New
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="h-full flex items-center justify-center p-4">
            <EmptyState
              icon={Bell}
              title="You're all caught up!"
              description="No new notifications to show."
            />
          </div>
        ) : (
          <div className="space-y-1">
            {notifications.slice(0, 10).map((notification) => (
              <div
                key={notification.id}
                onClick={() => {
                  if (!notification.isRead) markAsRead(notification.id);
                  if (notification.targetUrl) navigate(notification.targetUrl);
                }}
                className={`flex gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                  !notification.isRead ? 'bg-indigo-50/50 hover:bg-indigo-50' : 'hover:bg-slate-50'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm mt-0.5 relative">
                  {getCategoryIcon(notification.category)}
                  {!notification.isRead && (
                    <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#6C4CF1] border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-[13px] leading-tight mb-1 truncate ${!notification.isRead ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                    {notification.title}
                  </h4>
                  <p className="text-[12px] text-slate-500 truncate mb-1.5">
                    {notification.message}
                  </p>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {formatTimeAgo(notification.timestamp)}
                  </span>
                </div>
                {!notification.isRead && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notification.id);
                    }}
                    className="self-center p-1.5 text-slate-400 hover:text-[#6C4CF1] hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <CheckCircle size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
