import React from 'react';
import { AlertTriangle, Trash2, CheckCircle2 } from 'lucide-react';
import { ModalWrapper } from './ModalWrapper';
import { Button } from './Button';

export interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => Promise<void> | void;
  onClose: () => void;
  loading?: boolean;
  title?: string;
  subtitle?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'primary' | 'success';
  icon?: React.ReactNode;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onClose,
  loading = false,
  title = '¿Está seguro de continuar?',
  subtitle,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmVariant = 'primary',
  icon,
}) => {
  const iconByVariant: Record<string, React.ReactNode> = {
    danger: <Trash2 className="w-6 h-6 text-rose-600" />,
    primary: <AlertTriangle className="w-6 h-6 text-primary" />,
    success: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
  };

  const bgByVariant: Record<string, string> = {
    danger: 'bg-rose-50 border-rose-200',
    primary: 'bg-sky-50 border-sky-200',
    success: 'bg-emerald-50 border-emerald-200',
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      showCloseButton={!loading}
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            size="sm"
            onClick={onConfirm}
            isSubmitting={loading}
            submittingText="Procesando..."
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${bgByVariant[confirmVariant]}`}>
          {icon || iconByVariant[confirmVariant]}
        </div>
        <div className="flex-1">
          <h4 className="text-base font-bold font-sans text-ink">
            {title}
          </h4>
          {subtitle && (
            <p className="mt-1.5 text-xs text-ink-muted leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ConfirmModal;
