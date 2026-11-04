import React from 'react';
import { ModalWrapper } from '../ui/ModalWrapper';
import { BookOpen, Clock, ShieldCheck, Users, AlertCircle } from 'lucide-react';

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
            alt="UPLA"
            className="h-8 w-auto object-contain"
          />
          <span className="text-3xs font-extrabold uppercase tracking-widest text-primary dark:text-sky-400 bg-sky-50 dark:bg-sky-950/80 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-800">
            Normativa Oficial
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-primary dark:text-sky-400 shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed">
            Este reglamento ayuda a que todos los docentes y facultades compartan los ambientes de forma justa, sin cruces ni malos entendidos.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-canvas border border-line">
            <Clock className="w-5 h-5 text-primary dark:text-sky-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-ink">Horarios de Reserva</p>
              <p className="text-2xs text-ink-muted mt-0.5">
                Puedes pedir ambientes entre las <strong>07:00 y las 22:00 horas</strong>, en turnos de 30 minutos o 1 hora.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-canvas border border-line">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-ink">Sin Cruces de Horario</p>
              <p className="text-2xs text-ink-muted mt-0.5">
                Si un salón ya está reservado en esa hora, el sistema no permitirá pedirlo para asegurar que el espacio sea solo para tu clase o evento.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-canvas border border-line">
            <Users className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-ink">Capacidad y Aforo</p>
              <p className="text-2xs text-ink-muted mt-0.5">
                Verifica que la cantidad de alumnos no supere los asientos disponibles del salón o laboratorio elegido.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-line text-2xs text-ink-faint flex items-center justify-between">
          <span>Universidad Peruana Los Andes</span>
          <span>Vicerrectorado Académico</span>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ReglamentoModal;
