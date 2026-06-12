import { useEffect, useRef, useState } from 'react';
import { Briefcase, Send, Users, UserPlus, MessageSquare, FileText, Target, CheckCircle, TrendingUp } from 'lucide-react';

// ── Inline count-up hook ──────────────────────────────────────────
function useCountUp(end, duration = 1800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(start + (end - start) * eased);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration]);
  return value;
}

// ── Format number for display ─────────────────────────────────────
function fmt(raw, decimals = 0) {
  if (raw >= 1000) return (raw / 1000).toFixed(1) + 'k';
  return raw.toFixed(decimals);
}

const METRICS = [
  {
    label: 'Opportunities Listed',
    numericValue: 485,
    display: (v) => fmt(v),
    suffix: '',
    icon: Briefcase,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    trend: '+12% this month',
    trendUp: true,
  },
  {
    label: 'Applications Submitted',
    numericValue: 1243,
    display: (v) => fmt(v),
    suffix: '',
    icon: Send,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    trend: '+8% this month',
    trendUp: true,
  },
  {
    label: 'Teams Created',
    numericValue: 156,
    display: (v) => Math.floor(v).toString(),
    suffix: '',
    icon: Users,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    trend: '+23 new teams',
    trendUp: true,
  },
  {
    label: 'Connections Made',
    numericValue: 8924,
    display: (v) => fmt(v),
    suffix: '',
    icon: UserPlus,
    color: 'text-teal-500',
    bg: 'bg-teal-50',
    border: 'border-teal-100',
    trend: '+18% this month',
    trendUp: true,
  },
  {
    label: 'Messages Exchanged',
    numericValue: 24500,
    display: (v) => fmt(v),
    suffix: '',
    icon: MessageSquare,
    color: 'text-pink-500',
    bg: 'bg-pink-50',
    border: 'border-pink-100',
    trend: 'Avg 3.2/day',
    trendUp: true,
  },
  {
    label: 'Average ATS Score',
    numericValue: 84,
    display: (v) => Math.floor(v).toString(),
    suffix: '/100',
    icon: FileText,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    trend: '+14 pts improved',
    trendUp: true,
  },
  {
    label: 'Avg Career Readiness',
    numericValue: 76,
    display: (v) => Math.floor(v).toString(),
    suffix: '/100',
    icon: Target,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    trend: '+18% since onboarding',
    trendUp: true,
  },
  {
    label: 'Goals Completed',
    numericValue: 3402,
    display: (v) => fmt(v),
    suffix: '',
    icon: CheckCircle,
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    trend: '76% completion rate',
    trendUp: true,
  },
];

function MetricCard({ metric, index }) {
  const raw = useCountUp(metric.numericValue, 1600 + index * 80);
  const Icon = metric.icon;

  return (
    <div
      className={`bg-white rounded-2xl p-6 border ${metric.border} shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-300 flex flex-col group`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Icon row */}
      <div className="flex items-center justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${metric.bg}`}>
          <Icon size={22} className={metric.color} />
        </div>
        <div className={`flex items-center gap-1 text-[11px] font-bold ${metric.trendUp ? 'text-emerald-600' : 'text-red-500'} bg-emerald-50 px-2 py-1 rounded-full`}>
          <TrendingUp size={10} />
          {metric.trend}
        </div>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-[36px] font-black text-slate-900 leading-none tabular-nums">
          {metric.display(raw)}
        </span>
        {metric.suffix && (
          <span className="text-[16px] font-bold text-slate-400">{metric.suffix}</span>
        )}
      </div>

      {/* Label */}
      <span className="text-[13px] font-semibold text-slate-500">{metric.label}</span>
    </div>
  );
}

export default function HeroMetrics() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {METRICS.map((metric, idx) => (
        <MetricCard key={idx} metric={metric} index={idx} />
      ))}
    </div>
  );
}
