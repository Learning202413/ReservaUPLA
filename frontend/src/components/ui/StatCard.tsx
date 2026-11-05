import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  badge?: {
    text: string;
    variant?: 'positive' | 'warning' | 'negative' | 'neutral';
  };
  onClick?: () => void;
  className?: string;
  layout?: 'vertical' | 'horizontal';
  iconBg?: string;
  iconColor?: string;
  children?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  onClick,
  className = '',
  layout = 'vertical',
  iconBg = 'bg-sky-50 dark:bg-sky-950/70 text-[#006699] dark:text-sky-300',
  iconColor,
  children,
}) => {
  const badgeColors = {
    positive: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    warning: 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    negative: 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    neutral: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  };

  const isClickable = Boolean(onClick);
  const isLongText = typeof value === 'string' && value.length > 5;

  return (
    <div
      onClick={onClick}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      className={`bg-surface p-5 rounded-2xl border border-line shadow-2xs transition-all duration-200 flex flex-col justify-between h-full ${
        isClickable
          ? 'cursor-pointer hover:shadow-md hover:border-primary/40 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
          : ''
      } ${className}`}
    >
      <div className={`flex ${layout === 'horizontal' ? 'flex-row items-center justify-between' : 'flex-col justify-between h-full'} gap-3 flex-1`}>
        <div className="flex items-center justify-between w-full">
          <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
            {title}
          </span>
          {Icon && (
            <div className={`p-2.5 rounded-xl border border-line-soft ${iconBg} ${iconColor || ''}`}>
              <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2">
            <span
              className={`font-black text-ink tracking-tight ${
                isLongText
                  ? 'text-base sm:text-lg leading-snug line-clamp-2'
                  : 'text-2xl sm:text-3xl tabular-nums'
              }`}
              title={typeof value === 'string' ? value : undefined}
            >
              {value}
            </span>
            {badge && (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-3xs font-extrabold border shrink-0 ${
                  badgeColors[badge.variant || 'neutral']
                }`}
              >
                {badge.text}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-ink-muted mt-1 leading-snug">
              {subtitle}
            </p>
          )}
        </div>

        {children}
      </div>
    </div>
  );
};

export default StatCard;
