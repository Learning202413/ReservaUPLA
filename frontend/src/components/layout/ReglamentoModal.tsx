import React from 'react';
import { ModalWrapper } from '../ui/ModalWrapper';
import { Button } from '../ui/Button';
import { BookOpen, AlertCircle, Check } from 'lucide-react';

interface ReglamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReglamentoModal: React.FC<ReglamentoModalProps> = ({ isOpen, onClose }) => {
  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Reglamento y Guía de Uso de Ambientes"
      subtitle="Políticas institucionales de reserva para el campus UPLA"
      icon={BookOpen}
      maxWidth="lg"
    >
      <div className="space-y-4 text-left text-xs sm:text-sm text-ink-muted">
        <div className="flex items-center justify-between p-3 rounded-xl bg-canvas border border-line">
          <img
            src="/upla_logo_horizontal.png"
            alt="Logo institucional Universidad Peruana Los Andes"
            className="h-8 w-auto object-contain"
          />
          <span className="text-3xs font-extrabold uppercase tracking-widest text-primary dark:text-sky-400 bg-sky-50 dark:bg-sky-950/80 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-800">
            Normativa Oficial
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-primary dark:text-sky-400 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs leading-relaxed">
            Reglas de negocio mínimas oficiales del sistema ReservaUPLA (Sección 6 del Caso Práctico):
          </p>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-canvas border border-line">
            <span className="px-2 py-0.5 rounded text-3xs font-extrabold bg-sky-100 dark:bg-sky-950 text-primary dark:text-sky-300 shrink-0 mt-0.5 border border-sky-200 dark:border-sky-800">
              RN-01
            </span>
            <div>
              <p className="font-bold text-ink text-xs">Sin duplicidad ni cruce de horarios</p>
              <p className="text-2xs text-ink-muted mt-0.5 leading-relaxed">
                No se debe permitir más de una reserva aprobada para el mismo ambiente, fecha y horario.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-canvas border border-line">
            <span className="px-2 py-0.5 rounded text-3xs font-extrabold bg-sky-100 dark:bg-sky-950 text-primary dark:text-sky-300 shrink-0 mt-0.5 border border-sky-200 dark:border-sky-800">
              RN-02
            </span>
            <div>
              <p className="font-bold text-ink text-xs">Registro obligatorio de datos</p>
              <p className="text-2xs text-ink-muted mt-0.5 leading-relaxed">
                Toda reserva debe registrar fecha, hora de inicio, hora de fin, ambiente, solicitante y motivo.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-canvas border border-line">
            <span className="px-2 py-0.5 rounded text-3xs font-extrabold bg-sky-100 dark:bg-sky-950 text-primary dark:text-sky-300 shrink-0 mt-0.5 border border-sky-200 dark:border-sky-800">
              RN-03
            </span>
            <div>
              <p className="font-bold text-ink text-xs">Coherencia de horario</p>
              <p className="text-2xs text-ink-muted mt-0.5 leading-relaxed">
                La hora de fin debe ser mayor que la hora de inicio.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-canvas border border-line">
            <span className="px-2 py-0.5 rounded text-3xs font-extrabold bg-sky-100 dark:bg-sky-950 text-primary dark:text-sky-300 shrink-0 mt-0.5 border border-sky-200 dark:border-sky-800">
              RN-04
            </span>
            <div>
              <p className="font-bold text-ink text-xs">Horario institucional permitido</p>
              <p className="text-2xs text-ink-muted mt-0.5 leading-relaxed">
                Las reservas solo podrán realizarse entre las 07:00 y 22:00 horas.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-canvas border border-line">
            <span className="px-2 py-0.5 rounded text-3xs font-extrabold bg-sky-100 dark:bg-sky-950 text-primary dark:text-sky-300 shrink-0 mt-0.5 border border-sky-200 dark:border-sky-800">
              RN-05
            </span>
            <div>
              <p className="font-bold text-ink text-xs">Dictamen exclusivo</p>
              <p className="text-2xs text-ink-muted mt-0.5 leading-relaxed">
                Solo el administrador puede aprobar o rechazar una reserva.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-canvas border border-line">
            <span className="px-2 py-0.5 rounded text-3xs font-extrabold bg-sky-100 dark:bg-sky-950 text-primary dark:text-sky-300 shrink-0 mt-0.5 border border-sky-200 dark:border-sky-800">
              RN-06
            </span>
            <div>
              <p className="font-bold text-ink text-xs">Inmutabilidad de estado</p>
              <p className="text-2xs text-ink-muted mt-0.5 leading-relaxed">
                Una reserva rechazada no podrá modificarse.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-line text-2xs text-ink-faint flex items-center justify-between">
          <span>Universidad Peruana Los Andes</span>
          <span>Vicerrectorado Académico</span>
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            type="button"
            variant="primary"
            size="md"
            icon={<Check className="w-4 h-4" />}
            onClick={onClose}
          >
            Entendido y Aceptar
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ReglamentoModal;
