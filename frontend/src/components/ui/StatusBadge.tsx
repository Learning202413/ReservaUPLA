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
      resolvedIntent = normalized === 'mantenimiento' ? 'warning' : 'warning';
      DefaultIcon = normalized === 'mantenimiento' ? Wrench : Clock;
    } else {
      resolvedIntent = 'info';
    }
  }

  const intentStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    neutral: 'bg-slate-100 text-slate-600 border-slate-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
  };

  const IconToRender = CustomIcon || DefaultIcon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-2xs font-bold rounded-full border ${intentStyles[resolvedIntent]} ${className}`}
    >
      <IconToRender className="w-3.5 h-3.5 shrink-0" />
      <span>{displayLabel}</span>
    </span>
  );
};

export default StatusBadge;
