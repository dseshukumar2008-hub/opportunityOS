import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  type = 'button',
  ...props
}, ref) => {
  // Base classes for all buttons
  const baseClasses = 'inline-flex items-center justify-center font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-offset-2';
  
  // Variant classes
  const variants = {
    primary: 'bg-[#6C4CF1] hover:bg-indigo-700 text-white shadow-sm hover:shadow-md focus-visible:ring-[#6C4CF1]',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 focus-visible:ring-slate-400',
    outline: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-400 shadow-sm',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md focus-visible:ring-red-600',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 focus-visible:ring-slate-400',
    gradient: 'bg-gradient-to-r from-[#6C4CF1] to-[#5538EE] hover:from-[#5A3EE0] hover:to-[#4529CF] text-white shadow-md shadow-[#6C4CF1]/30 focus-visible:ring-[#6C4CF1]',
  };

  // Size classes
  const sizes = {
    sm: 'text-[13px] px-4 py-2 rounded-lg gap-1.5',
    md: 'text-[14px] px-5 py-2.5 rounded-xl gap-2',
    lg: 'text-[15px] px-8 py-3 rounded-xl gap-2',
    icon: 'p-2 rounded-lg',
  };

  const currentVariant = variants[variant] || variants.primary;
  const currentSize = sizes[size] || sizes.md;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${currentVariant} ${currentSize} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 size={size === 'sm' ? 16 : 18} className="animate-spin" />
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      
      {children}

      {!isLoading && rightIcon ? (
        <span className="shrink-0">{rightIcon}</span>
      ) : null}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
