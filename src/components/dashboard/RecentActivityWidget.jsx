import React from 'react';
import { useApplications } from '../../contexts/ApplicationContext';
import { Briefcase, Building, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const formatTimeAgo = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays}d ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
  return `${Math.floor(diffInDays / 30)}mo ago`;
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'applied': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    case 'under review': return 'text-blue-600 bg-blue-50 border-blue-100';
    case 'assessment': return 'text-amber-600 bg-amber-50 border-amber-100';
    case 'offer': return 'text-indigo-600 bg-indigo-50 border-indigo-100';
    case 'saved': return 'text-slate-600 bg-slate-50 border-slate-200';
    default: return 'text-slate-600 bg-slate-50 border-slate-200';
  }
};

export default function RecentActivityWidget() {
  const { applications } = useApplications();
  
  const recentApps = [...applications].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)).slice(0, 4);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col h-full shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[16px] font-black text-slate-900">
          Recent Applications
        </h3>
        <Link to="/applications" className="text-[12px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1">
          View all <ChevronRight size={14} />
        </Link>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {recentApps.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-6 text-center">
             <Briefcase size={24} className="text-slate-300 mb-2" />
             <p className="text-[13px] font-bold text-slate-700">No recent applications</p>
          </div>
        ) : (
          recentApps.map((app) => (
            <div key={app.id} className="flex items-center justify-between group">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden bg-white shadow-sm">
                  {app.logo ? (
                    <img src={app.logo} alt={app.company} className="w-full h-full object-contain p-1" />
                  ) : (
                    <Building size={16} className="text-slate-400" />
                  )}
                </div>
                <div className="min-w-0 pr-2">
                  <p className="text-[13px] font-bold text-slate-900 truncate leading-tight mb-0.5">
                    {app.role}
                  </p>
                  <p className="text-[11px] font-medium text-slate-500 truncate">
                    {app.company}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${getStatusColor(app.status)}`}>
                  {app.status || 'Applied'}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 w-10 text-right">
                  {formatTimeAgo(app.updatedAt || app.createdAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
