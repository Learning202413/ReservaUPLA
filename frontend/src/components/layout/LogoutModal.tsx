import React, { useEffect, useRef } from 'react';
import { LogOut, X } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) => {
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        cancelBtnRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-title"
        className="bg-surface rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-line text-center relative"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3.5 top-3.5 w-9 h-9 flex items-center justify-center p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-200 dark:border-rose-800 shadow-xs">
          <LogOut className="w-6 h-6" aria-hidden="true" />
        </div>

        <h3 id="logout-title" className="text-lg font-black text-ink mb-1">
          ¿Cerrar sesión?
        </h3>
        <p className="text-xs sm:text-sm text-ink-muted mb-6 leading-relaxed">
          Se cerrará el acceso actual a ReservaUPLA. Deberá ingresar sus credenciales institucionales nuevamente.
        </p>

        <div className="flex gap-2.5 justify-center">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 px-4 rounded-xl border border-line bg-surface hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-ink transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-rose-500/30"
          >
            {loading ? 'Cerrando...' : 'Cerrar sesión'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
