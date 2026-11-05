import React from 'react';
import { Trash2, CheckCircle2, AlertTriangle, type LucideIcon } from 'lucide-react';
import { ModalWrapper } from './ModalWrapper';
import { Button } from './Button';

export interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => Promise<void> | void;
  onClose: () => void;
  loading?: boolean;
  title?: string;
  subtitle?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'primary' | 'success';
  icon?: LucideIcon;
  iconClassName?: string;
  children?: React.ReactNode;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onClose,
  loading = false,
  title = '¿Está seguro de continuar?',
  subtitle,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmVariant = 'primary',
  icon,
  iconClassName,
  children,
}) => {
  const defaultIconByVariant: Record<string, LucideIcon> = {
    danger: Trash2,
    primary: CheckCircle2,
    success: CheckCircle2,
  };

  const defaultIconClassByVariant: Record<string, string> = {
    danger:
      'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800',
    primary:
      'text-primary dark:text-sky-300 bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800',
    success:
      'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800',
  };

  const ResolvedIcon = icon || defaultIconByVariant[confirmVariant] || AlertTriangle;
  const resolvedIconClass =
    iconClassName || defaultIconClassByVariant[confirmVariant];

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle || description}
      icon={ResolvedIcon}
      iconClassName={resolvedIconClass}
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
      {children}
    </ModalWrapper>
  );
};

export default ConfirmModal;
