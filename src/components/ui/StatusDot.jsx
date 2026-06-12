
/**
 * Reusable status indicator dot.
 *
 * Props:
 *  status   – 'online' | 'away' | 'offline'
 *  size     – 'sm' (default) | 'md' | 'lg'
 *  withText – show label text alongside dot (default false)
 *  className – extra tailwind classes
 */
export default function StatusDot({ status = 'offline', size = 'sm', withText = false, className = '' }) {
  const dotSize = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  }[size] ?? 'w-2 h-2';

  const ring = {
    sm: 'ring-[1.5px]',
    md: 'ring-2',
    lg: 'ring-2',
  }[size];

  const colorMap = {
    online:  { bg: 'bg-emerald-500', ring: 'ring-white', text: 'text-emerald-600', label: 'Online' },
    away:    { bg: 'bg-amber-400',   ring: 'ring-white', text: 'text-amber-600',   label: 'Away'   },
    offline: { bg: 'bg-slate-300',   ring: 'ring-white', text: 'text-slate-400',   label: 'Offline' },
  };

  const colors = colorMap[status] ?? colorMap.offline;

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className={`${dotSize} rounded-full shrink-0 ${colors.bg} ${ring} ${colors.ring}`} />
      {withText && (
        <span className={`text-[12px] font-semibold ${colors.text}`}>{colors.label}</span>
      )}
    </span>
  );
}
