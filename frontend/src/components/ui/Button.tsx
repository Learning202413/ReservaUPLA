import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
  isSubmitting?: boolean;
  submittingText?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  icon,
  disabled = false,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth,
  isSubmitting = false,
  submittingText,
  className = '',
  ...props
}, ref) => {
  const isExplicitWidth = fullWidth !== undefined
    ? (fullWidth ? 'w-full' : 'w-auto')
    : (className.includes('w-') ? '' : (size === 'icon' ? '' : 'w-full'));

  const sizeStyles = {
    sm: 'min-h-[36px] py-1.5 px-3 text-xs rounded-lg gap-1.5',
    md: 'min-h-[42px] py-2 px-4 text-sm rounded-xl gap-2',
    lg: 'min-h-[48px] py-3 px-5 text-sm sm:text-base rounded-xl font-bold uppercase tracking-wider gap-2.5',
    icon: 'min-h-[40px] min-w-[40px] p-2 rounded-xl aspect-square',
  };

  const variants = {
    primary: 'bg-primary hover:bg-primary-hover active:bg-[#003B5C] text-white focus:ring-accent shadow-md shadow-sky-900/15',
    secondary: 'bg-surface hover:bg-slate-100 dark:hover:bg-slate-800 text-ink border border-line focus:ring-slate-400 shadow-2xs',
    danger: 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white focus:ring-rose-500 shadow-md shadow-rose-900/15',
    success: 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white focus:ring-emerald-500 shadow-md shadow-emerald-900/15',
    outline: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-ink border border-line focus:ring-accent/30',
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-ink focus:ring-slate-300',
  };

  const baseStyles = 'font-semibold transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer';

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isSubmitting}
      className={`${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${isExplicitWidth} ${className}`}
      {...props}
    >
      {isSubmitting ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>{submittingText || 'Procesando...'}</span>
        </>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
