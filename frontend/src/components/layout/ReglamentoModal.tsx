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
      title="Guía y Normativa de Ambientes"
      subtitle="Políticas oficiales de reserva institucional UPLA"
      icon={BookOpen}
      maxWidth="md"
      bodyClassName="p-4 sm:p-5"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-3xs text-ink-faint">UPLA • Vicerrectorado Académico</span>
          <Button
            type="button"
            variant="primary"
            size="sm"
            icon={<Check className="w-4 h-4" />}
            onClick={onClose}
          >
            Entendido
          </Button>
        </div>
      }
    >
      <div className="space-y-3 text-left text-xs text-ink-muted">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-canvas border border-line">
          <img
            src="/upla_logo_horizontal.png"
            alt="Logo institucional Universidad Peruana Los Andes"
            className="h-7 w-auto object-contain"
          />
          <span className="text-3xs font-extrabold uppercase tracking-widest text-primary dark:text-sky-400 bg-sky-50 dark:bg-sky-950/80 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-800">
            Normativa Oficial
          </span>
        </div>

        <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-primary dark:text-sky-400 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-2xs leading-relaxed">
            Para evitar cruces de horarios y garantizar que todos los docentes cuenten con sus espacios a tiempo, las reservas en la Universidad Peruana Los Andes se gestionan bajo las siguientes normas:
          </p>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-canvas border border-line">
            <div className="w-2 h-2 rounded-full bg-sky-500 shrink-0 mt-1.5" />
            <div>
              <p className="font-bold text-ink text-xs">Horario de Atención del Campus</p>
              <p className="text-2xs text-ink-muted mt-0.5 leading-relaxed">
                Los ambientes se pueden solicitar únicamente entre las <strong>07:00 y las 22:00 horas</strong>, asegurando siempre que la hora de fin sea posterior a la de inicio.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-canvas border border-line">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
            <div>
              <p className="font-bold text-ink text-xs">Disponibilidad sin Cruces</p>
              <p className="text-2xs text-ink-muted mt-0.5 leading-relaxed">
                El sistema no permite que dos docentes o facultades tengan una reserva aprobada en el mismo ambiente, fecha y horario.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-canvas border border-line">
            <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
            <div>
              <p className="font-bold text-ink text-xs">Datos Completos de la Solicitud</p>
              <p className="text-2xs text-ink-muted mt-0.5 leading-relaxed">
                Toda reserva debe indicar la fecha, horario, ambiente solicitado, nombre del solicitante y el motivo académico que sustenta el uso del espacio.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-canvas border border-line">
            <div className="w-2 h-2 rounded-full bg-purple-500 shrink-0 mt-1.5" />
            <div>
              <p className="font-bold text-ink text-xs">Revisión y Dictamen Administrativo</p>
              <p className="text-2xs text-ink-muted mt-0.5 leading-relaxed">
                La administración revisa y aprueba o rechaza cada solicitud. Si una reserva es rechazada con su motivo oficial, no puede volver a modificarse.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ReglamentoModal;
