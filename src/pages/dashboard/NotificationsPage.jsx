import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, CheckCircle, Trash2, Briefcase, 
  Users, AlertCircle, CalendarClock, ChevronRight
} from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';

const TABS = ['All', 'Applications', 'Teams', 'Opportunities', 'System'];

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Applications': return <Briefcase size={20} className="text-blue-500" />;
    case 'Teams': return <Users size={20} className="text-emerald-500" />;
    case 'Opportunities': return <CalendarClock size={20} className="text-[#6C4CF1]" />;
    case 'System': return <AlertCircle size={20} className="text-amber-500" />;
    default: return <Bell size={20} className="text-slate-400" />;
  }
};

const getCategoryBadgeStyle = (category) => {
  switch (category) {
    case 'Applications': return 'bg-blue-50 text-blue-600 border-blue-100';
    case 'Teams': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    case 'Opportunities': return 'bg-indigo-50 text-[#6C4CF1] border-indigo-100';
    case 'System': return 'bg-amber-50 text-amber-600 border-amber-100';
    default: return 'bg-slate-50 text-slate-600 border-slate-100';
  }
};

const formatTime = (isoString) => {
  const date = new Date(isoString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
};

export default function NotificationsPage() {
  const { 
    notifications, 
    markAsRead, 
    deleteNotification, 
    markAllAsRead, 
    clearAllNotifications 
  } = useNotifications();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('All');

  const filteredNotifications = notifications.filter(
    (n) => activeTab === 'All' || n.type === activeTab
  );

  return (
    <div className="bg-[#F8FAFC] font-sans pb-20 p-4 lg:p-6">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-[28px] md:text-[32px] font-extrabold text-slate-900 tracking-tight mb-2">
              Notifications
            </h1>
            <p className="text-[15px] text-slate-500 font-medium">
              Stay updated with applications, teams, and opportunities.
            </p>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={markAllAsRead}
              disabled={notifications.every(n => n.read)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:text-[#6C4CF1] hover:border-indigo-100 hover:bg-indigo-50 rounded-xl text-[13px] font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
            >
              <CheckCircle size={16} /> Mark All Read
            </button>
            <button 
              onClick={clearAllNotifications}
              disabled={notifications.length === 0}
              className="px-4 py-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-100 rounded-xl text-[13px] font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
            >
              <Trash2 size={16} /> Clear All
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6 pb-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-[14px] font-bold whitespace-nowrap transition-all ${
                activeTab === tab 
                  ? 'bg-[#6C4CF1] text-white shadow-[0_4px_12px_rgba(108,76,241,0.25)]' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="py-16 px-6 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                <Bell size={28} />
              </div>
              <h3 className="text-[18px] font-bold text-slate-900 mb-2">No notifications yet</h3>
              <p className="text-[14px] text-slate-500 font-medium">
                Stay active to receive updates on your applications and teams.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              <AnimatePresence initial={false}>
                {filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    onClick={() => {
                      if (!notification.read) markAsRead(notification.id);
                      if (notification.targetUrl) navigate(notification.targetUrl);
                    }}
                    className={`group relative p-5 sm:p-6 flex gap-4 transition-colors ${notification.targetUrl ? 'cursor-pointer' : ''} hover:bg-slate-50 ${
                      !notification.read ? 'bg-[#7C3AED]/[0.02]' : 'bg-white'
                    }`}
                  >
                    {/* Unread Indicator */}
                    {!notification.read && (
                      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-1 h-12 bg-[#6C4CF1] rounded-r-full" />
                    )}

                    {/* Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm relative">
                      {getCategoryIcon(notification.type)}
                      {!notification.read && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#6C4CF1] border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase border ${getCategoryBadgeStyle(notification.type)}`}>
                            {notification.type}
                          </span>
                          <span className="text-[12px] font-bold text-slate-400">
                            {formatTime(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                      
                      <h4 className={`text-[15px] mb-1 leading-tight ${!notification.read ? 'font-extrabold text-slate-900' : 'font-bold text-slate-700'}`}>
                        {notification.title}
                      </h4>
                      <p className={`text-[14px] leading-relaxed ${!notification.read ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
                        {notification.message}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      {!notification.read && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                          className="w-8 h-8 rounded-full bg-white border border-slate-200 text-[#6C4CF1] flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-100 transition-colors shadow-sm"
                          title="Mark as Read"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                        className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors shadow-sm"
                        title="Delete Notification"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Mobile Arrow */}
                    <div className="sm:hidden self-center text-slate-300">
                      <ChevronRight size={20} />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
