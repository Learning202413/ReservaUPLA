import React, { useEffect } from 'react';
import { Button } from './Button';
import { AlertTriangle, X } from 'lucide-react';

export interface ModalConfirmacionProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary' | 'warning' | 'success';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ModalConfirmacion: React.FC<ModalConfirmacionProps> = ({
  isOpen,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'primary',
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  // Manejo de tecla ESC para cerrar el modal (Heurística de Nielsen 3: Control y Libertad)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all scale-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${variant === 'danger' ? 'bg-red-100 text-red-600' : 'bg-sky-100 text-[#006699]'}`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 id="modal-title" className="text-lg font-bold text-slate-800">
                {title}
              </h3>
            </div>
            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            {description}
          </p>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button variant="outline" size="sm" onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button variant={variant === 'danger' ? 'danger' : variant === 'success' ? 'success' : 'primary'} size="sm" onClick={onConfirm} isLoading={isLoading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

export interface TableListProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  isLoading?: boolean;
}

export function TableList<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No se encontraron registros.',
  isLoading = false,
}: TableListProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full bg-white border border-slate-200 rounded-xl p-12 text-center shadow-xs">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#006699] border-t-transparent mb-3"></div>
        <p className="text-sm font-medium text-slate-600">Cargando registros...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full bg-white border border-slate-200 rounded-xl p-12 text-center shadow-xs">
        <p className="text-sm font-medium text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden border border-slate-200 rounded-xl bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              {columns.map((col) => (
                <th key={col.key} className={`py-3.5 px-4 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {data.map((item, index) => (
              <tr 
                key={keyExtractor(item)} 
                className={`hover:bg-sky-50/40 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`py-3 px-4 text-slate-700 ${col.className || ''}`}>
                    {col.render ? col.render(item) : (item as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export interface CardIndicadorProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: string;
  variant?: 'blue' | 'emerald' | 'amber' | 'rose' | 'slate';
}

export const CardIndicador: React.FC<CardIndicadorProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  variant = 'blue',
}) => {
  const variantStyles = {
    blue: 'border-l-4 border-l-[#006699] text-[#006699] bg-sky-50/40',
    emerald: 'border-l-4 border-l-emerald-600 text-emerald-600 bg-emerald-50/40',
    amber: 'border-l-4 border-l-amber-500 text-amber-600 bg-amber-50/40',
    rose: 'border-l-4 border-l-rose-600 text-rose-600 bg-rose-50/40',
    slate: 'border-l-4 border-l-slate-600 text-slate-700 bg-slate-50',
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={`p-2.5 rounded-lg ${variantStyles[variant]}`}>
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <h4 className="text-2xl font-black text-slate-800 tracking-tight">
          {value}
        </h4>
        {description && (
          <p className="mt-1 text-xs text-slate-500 font-medium">
            {description}
          </p>
        )}
        {trend && (
          <p className="mt-1 text-xs font-semibold text-emerald-600">
            {trend}
          </p>
        )}
      </div>
    </div>
  );
};
