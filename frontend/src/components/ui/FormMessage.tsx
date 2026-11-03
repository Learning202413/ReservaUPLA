import React from 'react';
import { AlertTriangle, CheckCircle2, Info, AlertCircle } from 'lucide-react';

export interface FormMessageProps {
  type?: 'success' | 'error' | 'info' | 'warning' | '';
  message?: string | null;
  className?: string;
}

export const FormMessage: React.FC<FormMessageProps> = ({ type, message, className = 'p-3 mb-3' }) => {
  if (!message) return null;

  let styleClasses = 'bg-alert-error-bg text-alert-error-text border border-alert-error-border font-semibold tracking-wide';
  let icon = <AlertTriangle className="w-4 h-4 text-alert-error-icon shrink-0" />;

  if (type === 'success') {
    styleClasses = 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium';
    icon = <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
  } else if (type === 'info') {
    styleClasses = 'bg-sky-50 text-sky-900 border border-sky-200 font-medium';
    icon = <Info className="w-4 h-4 text-[#006699] shrink-0" />;
  } else if (type === 'warning') {
    styleClasses = 'bg-amber-50 text-amber-800 border border-amber-300 font-medium';
    icon = <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />;
  }

  return (
    <div
      role="alert"
      className={`rounded-xl text-xs flex items-center gap-2.5 transition-all shadow-2xs ${className} ${styleClasses}`}
    >
      {icon}
      <span className="leading-snug">{message}</span>
    </div>
  );
};

export default FormMessage;
