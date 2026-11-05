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

  // Manejo de Escape, Focus Trap y bloqueo de scroll en el body
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Enfocar el modal al abrir
    modalRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Confinamiento de foco (Focus Trap básico)
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
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
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`bg-surface rounded-2xl w-full border border-line-strong shadow-2xl overflow-hidden flex flex-col outline-none ${maxWidthClasses[maxWidth]} ${className}`}
      >
        {(title || showCloseButton) && (
          <div className="px-5 py-4 sm:px-6 sm:py-4.5 border-b border-line flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              {Icon && (
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconClassName}`}>
                  <Icon className="w-5 h-5" aria-hidden="true" />
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
                className="w-9 h-9 flex items-center justify-center text-ink-muted hover:text-ink hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-xl transition-colors cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-primary/20"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" aria-hidden="true" />
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
