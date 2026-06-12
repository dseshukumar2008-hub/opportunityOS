import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Users, CheckCircle, TrendingUp, Eye, BarChart3, Activity } from 'lucide-react';
import { useEmployer } from '../../contexts/EmployerContext';

function PipelineBar({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold text-slate-600">{label}</span>
        <span className="text-xs font-bold text-slate-900">{count} <span className="text-slate-400 font-normal">({pct}%)</span></span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

export default function EmployerDashboard() {
  const { companyProfile, employerOpportunities, applicants, shortlists, employerReviews } = useEmployer();

  const activeCount   = employerOpportunities.filter(o => o.status === 'Active').length;
  const closedCount   = employerOpportunities.filter(o => o.status === 'Closed').length;
  const shortlisted   = employerReviews?.filter(r => r.status === 'Shortlisted').length ?? shortlists?.length ?? 0;
  const rejected      = employerReviews?.filter(r => r.status === 'Rejected').length ?? 0;
  const pending       = applicants.length - shortlisted - rejected;

  // Estimated reach: each active posting seen by ~120 candidates on average
  const estimatedViews = useMemo(() => {
    const raw = activeCount * 120 + closedCount * 80;
    return raw >= 1000 ? `${(raw / 1000).toFixed(1)}k` : raw.toString();
  }, [activeCount, closedCount]);

  const stats = [
    { label: 'Active Postings',   value: activeCount,        icon: Briefcase,   color: 'text-blue-600',    bg: 'bg-blue-50' },
    { label: 'Total Applicants',  value: applicants.length,  icon: Users,       color: 'text-indigo-600',  bg: 'bg-indigo-50' },
    { label: 'Shortlisted',       value: shortlisted,        icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Est. Reach',        value: estimatedViews,     icon: Eye,         color: 'text-amber-600',   bg: 'bg-amber-50' },
  ];

  if (!companyProfile) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <h2 className="text-xl font-bold text-amber-800 mb-2">Welcome to OpportunityOS Employer!</h2>
          <p className="text-amber-700 mb-4">Before you can post opportunities and view applicants, please complete your company profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of your recruitment pipeline at <span className="font-semibold text-slate-700">{companyProfile.company_name}</span>.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 leading-tight">{stat.label}</p>
                <h3 className="text-2xl font-black text-slate-900 leading-tight">{stat.value}</h3>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Opportunities */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp size={16} className="text-indigo-500" />
              Recent Opportunities
            </h2>
            <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
              {employerOpportunities.length} total
            </span>
          </div>
          {employerOpportunities.length > 0 ? (
            <div className="space-y-3">
              {employerOpportunities.slice(0, 4).map((opp, i) => (
                <motion.div
                  key={opp.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  className="p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:shadow-sm transition-all flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{opp.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{opp.location || 'Remote'} · {opp.type}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg ${opp.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {opp.status}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center">
              <Briefcase size={32} className="mx-auto text-slate-300 mb-3" />
              <p className="text-sm text-slate-500">No opportunities posted yet.</p>
            </div>
          )}
        </div>

        {/* Right column: Pipeline + Recent Applicants */}
        <div className="flex flex-col gap-6">

          {/* Pipeline Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-[15px] font-bold text-slate-900 flex items-center gap-2 mb-5">
              <BarChart3 size={16} className="text-purple-500" />
              Pipeline Breakdown
            </h2>
            {applicants.length > 0 ? (
              <div className="space-y-4">
                <PipelineBar label="Pending Review" count={Math.max(0, pending)} total={applicants.length} color="bg-amber-400" />
                <PipelineBar label="Shortlisted"    count={shortlisted}          total={applicants.length} color="bg-emerald-500" />
                <PipelineBar label="Rejected"       count={rejected}             total={applicants.length} color="bg-red-400" />
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <Activity size={12} className="text-slate-400" />
                  <p className="text-[11px] font-medium text-slate-400">
                    Conversion: <span className="text-slate-700 font-bold">
                      {applicants.length > 0 ? `${Math.round((shortlisted / applicants.length) * 100)}%` : 'N/A'}
                    </span> shortlist rate
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">No applicant data yet.</p>
            )}
          </div>

          {/* Recent Applicants */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-[15px] font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Users size={16} className="text-indigo-500" />
              Recent Applicants
            </h2>
            {applicants.length > 0 ? (
              <div className="space-y-3">
                {applicants.slice(0, 4).map((app) => (
                  <div key={app.id} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-sm font-bold overflow-hidden shrink-0">
                      {app.profiles?.avatar_url ? (
                        <img src={app.profiles.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        app.profiles?.full_name?.charAt(0) || 'U'
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{app.profiles?.full_name || 'Unknown User'}</p>
                      <p className="text-xs text-slate-500 truncate">{employerOpportunities.find(o => o.id === app.opportunity_id)?.title || 'Unknown role'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">No applicants yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
