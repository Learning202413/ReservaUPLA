import React, { useEffect, useRef } from 'react';
import { X, type LucideIcon } from 'lucide-react';

export interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  description?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  className?: string;
  bodyClassName?: string;
  showCloseButton?: boolean;
}

export const ModalWrapper: React.FC<ModalWrapperProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  description,
  icon: Icon,
  iconClassName = 'text-primary dark:text-sky-300 bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800/80',
  children,
  footer,
  maxWidth = 'md',
  className = '',
  bodyClassName = 'px-5 py-4 sm:px-6 sm:py-5',
  showCloseButton = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const effectiveSubtitle = subtitle || description;

  // Manejo de Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={modalRef}
        className={`bg-surface rounded-2xl w-full border border-line-strong shadow-2xl overflow-hidden flex flex-col ${maxWidthClasses[maxWidth]} ${className}`}
      >
        {(title || showCloseButton) && (
          <div className="px-5 py-4 sm:px-6 sm:py-4.5 border-b border-line flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              {Icon && (
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconClassName}`}>
                  <Icon className="w-5 h-5" />
                </div>
              )}
              <div className="min-w-0">
                {title && (
                  <h3 id="modal-title" className="text-base sm:text-lg font-bold font-sans text-ink truncate">
                    {title}
                  </h3>
                )}
                {effectiveSubtitle && (
                  <p className="text-xs text-ink-muted truncate mt-0.5">
                    {effectiveSubtitle}
                  </p>
                )}
              </div>
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="text-ink-muted hover:text-ink hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        <div className={`overflow-y-auto flex-1 ${bodyClassName}`}>
          {children}
        </div>

        {footer && (
          <div className="px-5 py-3.5 sm:px-6 sm:py-4 bg-canvas border-t border-line flex items-center justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalWrapper;
