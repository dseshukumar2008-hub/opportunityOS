import { useState, useMemo } from 'react';
import { Clock, AlertCircle, CheckCircle2, Calendar, Filter, ChevronDown } from 'lucide-react';
import { useApplications } from '../../contexts/ApplicationContext';
import EmptyState from '../../components/ui/EmptyState';

const URGENCY_LEVELS = {
  overdue: { label: 'Overdue', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-500' },
  today: { label: 'Due Today', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', dot: 'bg-orange-500' },
  thisWeek: { label: 'This Week', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-400' },
  upcoming: { label: 'Upcoming', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-400' },
  later: { label: 'Later', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', dot: 'bg-slate-300' },
};

function getUrgency(deadlineStr) {
  if (!deadlineStr) return 'later';
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const dl = new Date(deadlineStr);
  dl.setHours(0, 0, 0, 0);
  const diffDays = Math.round((dl - now) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'overdue';
  if (diffDays === 0) return 'today';
  if (diffDays <= 7) return 'thisWeek';
  if (diffDays <= 30) return 'upcoming';
  return 'later';
}

function formatDeadline(deadlineStr) {
  if (!deadlineStr) return 'No deadline';
  const dl = new Date(deadlineStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  dl.setHours(0, 0, 0, 0);
  const diffDays = Math.round((dl - now) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} overdue`;
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  if (diffDays <= 7) return `In ${diffDays} days`;
  return dl.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const FILTERS = ['All', 'Overdue', 'This Week', 'Upcoming'];

export default function DeadlinesPage() {
  const { applications } = useApplications();
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('urgency');

  const deadlineItems = useMemo(() => {
    return applications
      .filter(app => app.deadline)
      .map(app => ({
        ...app,
        urgency: getUrgency(app.deadline),
        formatted: formatDeadline(app.deadline),
      }));
  }, [applications]);

  const filtered = useMemo(() => {
    let items = deadlineItems;
    if (filter === 'Overdue') items = items.filter(i => i.urgency === 'overdue');
    else if (filter === 'This Week') items = items.filter(i => ['today', 'thisWeek'].includes(i.urgency));
    else if (filter === 'Upcoming') items = items.filter(i => ['upcoming', 'later'].includes(i.urgency));

    const urgencyOrder = ['overdue', 'today', 'thisWeek', 'upcoming', 'later'];
    if (sortBy === 'urgency') {
      return [...items].sort((a, b) => urgencyOrder.indexOf(a.urgency) - urgencyOrder.indexOf(b.urgency));
    }
    return [...items].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  }, [deadlineItems, filter, sortBy]);

  const stats = useMemo(() => ({
    overdue: deadlineItems.filter(i => i.urgency === 'overdue').length,
    today: deadlineItems.filter(i => i.urgency === 'today').length,
    thisWeek: deadlineItems.filter(i => i.urgency === 'thisWeek').length,
    upcoming: deadlineItems.filter(i => ['upcoming', 'later'].includes(i.urgency)).length,
  }), [deadlineItems]);

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-6 pb-16">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
            <Clock size={18} className="text-amber-600" />
          </div>
          <h1 className="text-[26px] font-extrabold text-slate-900 tracking-tight">Deadlines</h1>
        </div>
        <p className="text-[14px] text-slate-500 font-medium ml-12">Track all your application and opportunity deadlines in one place.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Overdue', count: stats.overdue, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
          { label: 'Due Today', count: stats.today, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
          { label: 'This Week', count: stats.thisWeek, icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
          { label: 'Upcoming', count: stats.upcoming, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.bg} border ${stat.border} rounded-2xl p-4 flex flex-col gap-2`}>
            <stat.icon size={18} className={stat.color} />
            <p className="text-[26px] font-black text-slate-900 leading-none">{stat.count}</p>
            <p className="text-[12px] font-semibold text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-slate-400 shrink-0" />
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
                filter === f
                  ? 'bg-[#6C4CF1] text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-[#6C4CF1] hover:text-[#6C4CF1]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-[13px] font-semibold text-slate-600 outline-none cursor-pointer hover:border-[#6C4CF1] transition-colors"
          >
            <option value="urgency">Sort: Urgency</option>
            <option value="date">Sort: Date</option>
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Deadline Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
          <EmptyState
            icon={CheckCircle2}
            title="All clear!"
            description={filter === 'All'
              ? 'No applications with deadlines yet. Apply to opportunities to track deadlines here.'
              : `No ${filter.toLowerCase()} deadlines.`}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => {
            const urgency = URGENCY_LEVELS[item.urgency];
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 hover:shadow-md hover:border-slate-200 transition-all group"
              >
                {/* Urgency dot */}
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${urgency.dot}`} />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[15px] font-bold text-slate-900 truncate group-hover:text-[#6C4CF1] transition-colors">
                        {item.role || item.title || 'Untitled Application'}
                      </p>
                      <p className="text-[13px] text-slate-500 font-medium truncate">
                        {item.company} {item.type && `· ${item.type}`}
                      </p>
                    </div>
                    <span className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${urgency.bg} ${urgency.color} ${urgency.border}`}>
                      {urgency.label}
                    </span>
                  </div>
                </div>

                {/* Deadline info */}
                <div className="text-right shrink-0 hidden sm:block">
                  <p className={`text-[13px] font-bold ${urgency.color}`}>{item.formatted}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {item.deadline ? new Date(item.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state for no applications at all */}
      {(applications || []).length === 0 && (
        <div className="mt-8 bg-gradient-to-br from-[#F3F0FF] to-[#EEF2FF] rounded-2xl p-8 text-center border border-[#E5E0FF]">
          <p className="text-[14px] font-semibold text-[#6C4CF1] mb-1">No applications tracked yet</p>
          <p className="text-[13px] text-slate-500">Start applying to opportunities to see your deadlines here.</p>
        </div>
      )}
    </div>
  );
}
