import React from 'react';
import { Search, X } from 'lucide-react';

export interface FilterBarProps {
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  searchMaxLength?: number;
  searchAriaLabel?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  searchMaxLength = 50,
  searchAriaLabel = 'Buscar',
  children,
  actions,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-3.5 sm:p-4 rounded-2xl border border-line shadow-2xs ${className}`}>
      {onSearchChange !== undefined && (
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchValue ?? ''}
            maxLength={searchMaxLength}
            aria-label={searchAriaLabel}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-line bg-canvas focus:bg-surface text-ink placeholder:text-ink-faint focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink p-1 rounded-lg cursor-pointer transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {children && (
        <div className="flex items-center gap-2 overflow-x-auto py-0.5">
          {children}
        </div>
      )}

      {actions && (
        <div className="flex items-center gap-2 sm:ml-auto">
          {actions}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
