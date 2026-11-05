import React, { useState } from 'react';
import { ModalWrapper } from '../ui/ModalWrapper';
import { Button } from '../ui/Button';
import { XCircle, AlertTriangle } from 'lucide-react';
import type { Reserva } from '../../types';

interface RechazarReservaModalProps {
  isOpen: boolean;
  reserva?: Reserva | null;
  ambienteNombre?: string;
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
  reserva,
  ambienteNombre,
  loading = false,
  onClose,
  onConfirm,
}) => {
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState<string | null>(null);

  const nombreEspacio = reserva?.ambienteNombre || ambienteNombre || 'Ambiente';

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
      subtitle={`Ambiente: ${nombreEspacio}`}
      icon={XCircle}
      iconClassName="text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left font-sans">
        {reserva && (
          <div className="p-3 rounded-xl bg-canvas/70 border border-line text-xs space-y-1.5">
            <div className="flex items-center justify-between text-2xs">
              <span className="font-semibold text-ink-muted">Docente / Solicitante:</span>
              <span className="font-bold text-ink truncate">{reserva.solicitanteNombre}</span>
            </div>
            <div className="flex items-center justify-between text-2xs">
              <span className="font-semibold text-ink-muted">Horario Requerido:</span>
              <span className="font-medium text-ink">{reserva.fecha} ({reserva.horaInicio} - {reserva.horaFin})</span>
            </div>
          </div>
        )}

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
                className="text-3xs font-medium px-2.5 py-1 rounded-lg border border-line bg-surface hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-ink text-left cursor-pointer"
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="motivoRechazo"
            className="block text-xs font-bold text-ink mb-1"
          >
            Motivo Oficial del Dictamen <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="motivoRechazo"
            rows={3}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Especifique las razones pedagógicas, técnicas o de aforo por las cuales se deniega la solicitud..."
            className="w-full px-3 py-2 text-xs rounded-xl border border-line bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none"
            required
          />
          {error && (
            <p className="text-3xs text-rose-600 dark:text-rose-400 font-semibold mt-1">
              {error}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-line">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            size="sm"
            type="submit"
            isSubmitting={loading}
            submittingText="Denegando..."
          >
            Confirmar Rechazo
          </Button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default RechazarReservaModal;
