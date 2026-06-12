import { Link } from 'react-router-dom';

/**
 * Professional Empty State Component
 * 
 * Props:
 * - icon: Lucide icon component
 * - illustration: optional SVG string or emoji decoration
 * - title: main heading
 * - description: supporting text
 * - actionText: CTA button label
 * - onAction: CTA click handler
 * - actionLink: if provided, renders a Link instead of button
 * - secondaryText: secondary CTA label
 * - onSecondary: secondary CTA handler
 * - secondaryLink: secondary Link href
 * - variant: 'default' | 'compact' | 'minimal'
 * - className: extra wrapper classes
 */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  actionLink,
  secondaryText,
  onSecondary,
  secondaryLink,
  variant = 'default',
  className = '',
}) {
  if (variant === 'minimal') {
    return (
      <div className={`flex flex-col items-center justify-center py-8 text-center ${className}`}>
        {Icon && (
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
            <Icon size={22} strokeWidth={1.5} className="text-slate-400" />
          </div>
        )}
        <p className="text-[14px] font-semibold text-slate-600">{title}</p>
        {description && <p className="text-[13px] text-slate-400 mt-1">{description}</p>}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-slate-100 bg-white ${className}`}>
        {Icon && (
          <div className="w-14 h-14 bg-[#F4F2FF] rounded-2xl flex items-center justify-center mb-4">
            <Icon size={26} strokeWidth={1.5} className="text-[#6C4CF1]" />
          </div>
        )}
        <h3 className="text-[16px] font-bold text-slate-900 mb-1">{title}</h3>
        {description && <p className="text-[13px] text-slate-500 max-w-xs leading-relaxed mb-5">{description}</p>}
        {(actionText && (onAction || actionLink)) && (
          actionLink ? (
            <Link to={actionLink} className="btn-primary px-5 py-2 text-[13px]">
              {actionText}
            </Link>
          ) : (
            <button onClick={onAction} className="btn-primary px-5 py-2 text-[13px]">
              {actionText}
            </button>
          )
        )}
      </div>
    );
  }

  // Default full variant
  return (
    <div className={`w-full flex flex-col items-center justify-center py-16 px-8 bg-white rounded-2xl border border-slate-100 shadow-sm text-center ${className}`}>
      {/* Decorative rings */}
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-[#6C4CF1]/5 animate-pulse" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-[#6C4CF1]/8" />
        </div>
        <div className="relative w-20 h-20 bg-gradient-to-br from-[#6C4CF1]/15 to-[#6C4CF1]/5 rounded-full flex items-center justify-center border border-[#6C4CF1]/10">
          {Icon && <Icon size={34} strokeWidth={1.5} className="text-[#6C4CF1]" />}
        </div>
      </div>

      <h3 className="text-[20px] font-extrabold text-slate-900 mb-2 tracking-tight">{title}</h3>
      {description && (
        <p className="text-[14px] text-slate-500 max-w-sm leading-relaxed mb-8">
          {description}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionText && (onAction || actionLink) && (
          actionLink ? (
            <Link
              to={actionLink}
              className="btn-primary px-6 py-2.5 text-[14px] inline-flex items-center gap-2"
            >
              {actionText}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="btn-primary px-6 py-2.5 text-[14px] inline-flex items-center gap-2"
            >
              {actionText}
            </button>
          )
        )}

        {secondaryText && (onSecondary || secondaryLink) && (
          secondaryLink ? (
            <Link
              to={secondaryLink}
              className="btn-secondary px-6 py-2.5 text-[14px] inline-flex items-center gap-2"
            >
              {secondaryText}
            </Link>
          ) : (
            <button
              onClick={onSecondary}
              className="btn-secondary px-6 py-2.5 text-[14px] inline-flex items-center gap-2"
            >
              {secondaryText}
            </button>
          )
        )}
      </div>
    </div>
  );
}
