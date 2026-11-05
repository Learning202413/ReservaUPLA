import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  iconContainerClassName?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
  iconContainerClassName = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 bg-surface/70 rounded-3xl border border-dashed border-line my-auto transition-colors ${className}`}
    >
      <div
        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-sky-50 dark:bg-sky-950/70 text-primary dark:text-sky-300 flex items-center justify-center mb-4 shadow-xs border border-sky-200 dark:border-sky-800/80 ${iconContainerClassName}`}
      >
        <Icon className="w-8 h-8 sm:w-10 sm:h-10" aria-hidden="true" />
      </div>

      <h3 className="text-lg sm:text-xl font-bold font-sans text-ink mb-1">
        {title}
      </h3>

      {description && (
        <p className="text-xs sm:text-sm text-ink-muted max-w-md mb-4 leading-relaxed font-normal">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
