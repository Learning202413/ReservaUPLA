import React, { useState } from 'react';
import { ModalWrapper } from '../ui/ModalWrapper';
import { Button } from '../ui/Button';
import { XCircle, AlertTriangle } from 'lucide-react';

interface RechazarReservaModalProps {
  isOpen: boolean;
  ambienteNombre: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (motivo: string) => void;
}

const MOTIVOS_FRECUENTES = [
  'Cruce con actividad académica curricular prioritaria',
  'Mantenimiento técnico preventivo programado del laboratorio',
  'Aforo solicitado excede la capacidad reglamentaria',
  'Falta de justificación o documentación requerida',
];

export const RechazarReservaModal: React.FC<RechazarReservaModalProps> = ({
  isOpen,
  ambienteNombre,
  loading = false,
  onClose,
  onConfirm,
}) => {
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Limpieza de estado al cerrar para evitar fugas entre reservas (Norman - Slips)
  React.useEffect(() => {
    if (!isOpen) {
      setMotivo('');
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!motivo.trim() || motivo.trim().length < 5) {
      setError('Por favor detalle un motivo claro de rechazo (mín. 5 caracteres).');
      return;
    }
    setError(null);
    onConfirm(motivo.trim());
  };

  const handleSeleccionarChip = (texto: string) => {
    setMotivo(texto);
    setError(null);
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Dictamen de Rechazo de Solicitud"
      subtitle={`Ambiente: ${ambienteNombre}`}
      icon={XCircle}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left font-sans">
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            El solicitante podrá visualizar este motivo detallado en su panel de reservas para comprender el dictamen institucional (Principio de Cierre y Retroalimentación).
          </p>
        </div>

        <div>
          <label className="text-3xs font-extrabold uppercase tracking-widest text-ink-muted block mb-1.5">
            Motivos Frecuentes Institucionales (clic para autocompletar):
          </label>
          <div className="flex flex-wrap gap-1.5">
            {MOTIVOS_FRECUENTES.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => handleSeleccionarChip(m)}
                className="px-2.5 py-1 rounded-lg text-2xs bg-canvas hover:bg-slate-200 dark:hover:bg-slate-800 text-ink-muted hover:text-ink border border-line transition-colors text-left"
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="form-label-standard">
            Motivo Oficial del Dictamen <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={motivo}
            onChange={(e) => {
              setMotivo(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Especifique las razones pedagógicas, técnicas o de aforo por las cuales se deniega la solicitud..."
            className="form-input-standard"
            required
          />
          {error && <p className="text-rose-600 text-2xs font-bold mt-1">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
          <Button type="button" variant="outline" size="md" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="danger"
            size="md"
            isSubmitting={loading}
            submittingText="Rechazando..."
          >
            Confirmar Rechazo
          </Button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default RechazarReservaModal;
