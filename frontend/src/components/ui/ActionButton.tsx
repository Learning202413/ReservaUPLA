import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  icon: Icon,
  variant = 'secondary',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-lg min-h-[36px] sm:min-h-[38px] gap-1.5',
    md: 'px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl min-h-[38px] gap-2',
    lg: 'px-4 py-2.5 text-sm sm:text-base font-bold rounded-xl min-h-[44px] gap-2.5',
  };

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-hover border-transparent shadow-xs',
    secondary: 'bg-surface hover:bg-slate-100 dark:hover:bg-slate-800 text-ink border-line border shadow-2xs',
    danger: 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900 border-rose-200 dark:border-rose-800 border',
    ghost: 'bg-transparent text-ink-muted hover:text-ink hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent',
    outline: 'bg-transparent text-primary dark:text-sky-400 border-primary dark:border-sky-500 border hover:bg-sky-50/50 dark:hover:bg-sky-950/40',
  };

  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center transition-all cursor-pointer select-none active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon className={`w-4 h-4 shrink-0 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />}
      {children}
    </button>
  );
};

export default ActionButton;
