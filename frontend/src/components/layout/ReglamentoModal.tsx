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
            Para evitar cruces de horarios y garantizar que todos los docentes cuenten con sus espacios a tiempo, las reservas en la Universidad Peruana Los Andes se gestionan bajo las siguientes normas:
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-canvas border border-line">
            <div className="w-2 h-2 rounded-full bg-sky-500 shrink-0 mt-1.5" />
            <div>
              <p className="font-bold text-ink text-xs">Horario de Atención del Campus</p>
              <p className="text-2xs text-ink-muted mt-0.5 leading-relaxed">
                Los ambientes se pueden solicitar únicamente entre las <strong>07:00 y las 22:00 horas</strong>, asegurando siempre que la hora de fin sea posterior a la de inicio.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-canvas border border-line">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
            <div>
              <p className="font-bold text-ink text-xs">Disponibilidad sin Cruces</p>
              <p className="text-2xs text-ink-muted mt-0.5 leading-relaxed">
                El sistema no permite que dos docentes o facultades tengan una reserva aprobada en el mismo ambiente, fecha y horario.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-canvas border border-line">
            <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
            <div>
              <p className="font-bold text-ink text-xs">Datos Completos de la Solicitud</p>
              <p className="text-2xs text-ink-muted mt-0.5 leading-relaxed">
                Toda reserva debe indicar la fecha, horario, ambiente solicitado, nombre del solicitante y el motivo académico que sustenta el uso del espacio.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-canvas border border-line">
            <div className="w-2 h-2 rounded-full bg-purple-500 shrink-0 mt-1.5" />
            <div>
              <p className="font-bold text-ink text-xs">Revisión y Dictamen Administrativo</p>
              <p className="text-2xs text-ink-muted mt-0.5 leading-relaxed">
                La administración revisa y aprueba o rechaza cada solicitud. Si una reserva es rechazada con su motivo oficial, no puede volver a modificarse.
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
