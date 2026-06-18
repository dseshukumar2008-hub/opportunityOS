import { Target } from 'lucide-react';

export default function OpportunityMatchBadge({ score, size = 'md' }) {
  if (score == null) return null;

  let colorClass;
  let iconColor;

  if (score >= 90) {
    colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-100';
    iconColor = 'text-emerald-500';
  } else if (score >= 70) {
    colorClass = 'bg-orange-50 text-orange-700 border-orange-100';
    iconColor = 'text-orange-500';
  } else {
    colorClass = 'bg-red-50 text-red-700 border-red-100';
    iconColor = 'text-red-500';
  }

  const isSmall = size === 'sm';

  return (
    <div className={`flex items-center gap-1.5 border rounded-full font-bold ${isSmall ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'} ${colorClass}`}>
      <Target size={isSmall ? 10 : 12} className={iconColor} strokeWidth={3} />
      <span>{score}% Match</span>
    </div>
  );
}


