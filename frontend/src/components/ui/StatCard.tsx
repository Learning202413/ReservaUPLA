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
  iconBg = 'bg-sky-50 text-[#006699]',
  iconColor,
  children,
}) => {
  const badgeColors = {
    positive: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    negative: 'bg-rose-50 text-rose-700 border-rose-200',
    neutral: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  const isClickable = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      className={`bg-surface p-5 rounded-2xl border border-neutral-200/80 shadow-2xs transition-all duration-200 ${
        isClickable
          ? 'cursor-pointer hover:shadow-md hover:border-[#006699]/30 active:scale-[0.99]'
          : ''
      } ${className}`}
    >
      <div className={`flex ${layout === 'horizontal' ? 'flex-row items-center justify-between' : 'flex-col'} gap-3`}>
        <div className="flex items-center justify-between w-full">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {title}
          </span>
          {Icon && (
            <div className={`p-2.5 rounded-xl ${iconBg} ${iconColor || ''}`}>
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>

        <div className="flex items-baseline justify-between gap-2 mt-1">
          <p className="text-2xl font-black text-slate-900 tracking-tight">
            {value}
          </p>
          {badge && (
            <span className={`text-3xs font-bold px-2 py-0.5 rounded-full border ${badgeColors[badge.variant || 'neutral']}`}>
              {badge.text}
            </span>
          )}
        </div>

        {subtitle && (
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            {subtitle}
          </p>
        )}

        {children}
      </div>
    </div>
  );
};

export default StatCard;
