import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface AlertMessageProps {
  type?: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

export const AlertMessage: React.FC<AlertMessageProps> = ({
  type = 'info',
  title,
  message,
  onClose,
  className = '',
}) => {
  const styles = {
    success: 'bg-emerald-50 border-emerald-300 text-emerald-900',
    warning: 'bg-amber-50 border-amber-300 text-amber-900',
    error: 'bg-red-50 border-red-300 text-red-900',
    info: 'bg-sky-50 border-sky-300 text-sky-900',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-600 shrink-0" />,
  };

  return (
    <div className={`flex items-start gap-3 p-4 border rounded-xl shadow-xs transition-all ${styles[type]} ${className}`} role="alert">
      {icons[type]}
      <div className="flex-1 text-sm">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <p className="leading-relaxed opacity-90">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer p-0.5 rounded-md"
          aria-label="Cerrar notificación"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
