import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export interface ThemeToggleProps {
  inMobileMenu?: boolean;
  onAction?: () => void;
  className?: string;
  showText?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  inMobileMenu = false,
  onAction,
  className = '',
  showText = true,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const label = isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
  const textLabel = isDark ? 'Modo claro' : 'Modo oscuro';

  const handleClick = () => {
    toggleTheme();
    onAction?.();
  };

  if (inMobileMenu) {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={label}
        title={label}
        className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-ink-muted hover:text-ink hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 min-h-[44px] cursor-pointer transition-colors"
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 shrink-0" />
        ) : (
          <Moon className="w-4 h-4 text-sky-600 shrink-0" />
        )}
        <span>{textLabel}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      title={label}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-ink-muted hover:text-ink border border-line bg-surface hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer select-none min-h-[38px] ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 shrink-0" />
      ) : (
        <Moon className="w-4 h-4 text-sky-600 shrink-0" />
      )}
      {showText && <span className="hidden sm:inline">{textLabel}</span>}
    </button>
  );
};

export default ThemeToggle;
