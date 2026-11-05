import React from 'react';
import { AlertTriangle, CheckCircle2, Info, AlertCircle } from 'lucide-react';

export interface FormMessageProps {
  type?: 'success' | 'error' | 'info' | 'warning' | '';
  message?: string | null;
  className?: string;
}

export const FormMessage: React.FC<FormMessageProps> = ({ type, message, className = 'p-3 mb-3' }) => {
  if (!message) return null;

  let styleClasses =
    'bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900/70 font-semibold tracking-wide';
  let icon = <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />;
  let isAlert = true;

  if (type === 'success') {
    styleClasses =
      'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 font-medium';
    icon = <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />;
    isAlert = false;
  } else if (type === 'info') {
    styleClasses =
      'bg-sky-50 dark:bg-sky-950/60 text-sky-900 dark:text-sky-200 border border-sky-200 dark:border-sky-800 font-medium';
    icon = <Info className="w-4 h-4 text-primary dark:text-sky-400 shrink-0 mt-0.5" aria-hidden="true" />;
    isAlert = false;
  } else if (type === 'warning') {
    styleClasses =
      'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 font-medium';
    icon = <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />;
    isAlert = true;
  }

  return (
    <div
      role={isAlert ? 'alert' : 'status'}
      aria-live={isAlert ? 'assertive' : 'polite'}
      className={`rounded-xl text-xs flex items-start gap-2.5 transition-all shadow-2xs ${className} ${styleClasses}`}
    >
      {icon}
      <span className="leading-snug">{message}</span>
    </div>
  );
};

export default FormMessage;
