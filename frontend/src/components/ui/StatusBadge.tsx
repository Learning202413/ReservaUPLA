import React from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

export type StatusIntent = 'success' | 'danger' | 'warning' | 'neutral' | 'info';

export interface StatusBadgeProps {
  status: boolean | string;
  intent?: StatusIntent;
  variant?: string;
  icon?: LucideIcon;
  label?: string;
  className?: string;
  activeLabel?: string;
  inactiveLabel?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  intent,
  icon: CustomIcon,
  label: customLabel,
  className = '',
  activeLabel = 'Activo',
  inactiveLabel = 'Inactivo',
}) => {
  const isBoolean = typeof status === 'boolean';
  const rawText = isBoolean ? (status ? activeLabel : inactiveLabel) : String(status);
  const displayLabel = customLabel || rawText;
  const normalized = rawText.trim().toLowerCase();

  let resolvedIntent: StatusIntent = intent || 'neutral';
  let DefaultIcon: LucideIcon = Clock;

  if (!intent) {
    if (['aprobada', 'disponible', 'activo', 'activa', 'completado'].includes(normalized)) {
      resolvedIntent = 'success';
      DefaultIcon = CheckCircle2;
    } else if (['rechazada', 'inactivo', 'inactiva', 'cancelado', 'cancelada'].includes(normalized)) {
      resolvedIntent = 'danger';
      DefaultIcon = normalized.includes('cancel') ? Ban : XCircle;
    } else if (['pendiente', 'mantenimiento', 'en espera'].includes(normalized)) {
      resolvedIntent = 'warning';
      DefaultIcon = normalized === 'mantenimiento' ? Wrench : Clock;
    } else {
      resolvedIntent = 'info';
    }
  }

  const intentStyles: Record<StatusIntent, string> = {
    success: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/80',
    warning: 'bg-amber-50 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800/80',
    danger: 'bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800/80',
    neutral: 'bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    info: 'bg-sky-50 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800/80',
  };

  const IconToRender = CustomIcon || DefaultIcon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-2xs font-bold rounded-full border shadow-2xs whitespace-nowrap transition-colors ${intentStyles[resolvedIntent]} ${className}`}
    >
      <IconToRender className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{displayLabel}</span>
    </span>
  );
};

export default StatusBadge;
