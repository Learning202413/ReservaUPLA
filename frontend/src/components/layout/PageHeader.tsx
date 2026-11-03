import React from 'react';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  count?: number;
  countLabel?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  count,
  countLabel = 'registros',
  badge,
  actions,
  className = '',
}) => {
  return (
    <header className={`shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 ${className}`}>
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-black font-sans text-ink tracking-tight">
            {title}
          </h1>

          {count !== undefined && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-ink-muted border border-line tabular-nums shadow-2xs">
              {count} {countLabel}
            </span>
          )}

          {badge}
        </div>

        {subtitle && (
          <p className="text-xs sm:text-sm text-ink-muted mt-1 font-normal">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap shrink-0">
          {actions}
        </div>
      )}
    </header>
  );
};

export default PageHeader;
