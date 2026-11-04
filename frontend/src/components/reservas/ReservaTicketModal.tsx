import React from 'react';
import { ModalWrapper } from '../ui/ModalWrapper';
import { Button } from '../ui/Button';
import { CheckCircle2, Building, Calendar, Clock, User, ShieldAlert, ArrowRight, PlusCircle } from 'lucide-react';
import { Reserva } from '../../types';

interface ReservaTicketModalProps {
  isOpen: boolean;
  reserva: Reserva | null;
  onGoToReservas: () => void;
  onCrearOtra: () => void;
}

export const ReservaTicketModal: React.FC<ReservaTicketModalProps> = ({
  isOpen,
  reserva,
  onGoToReservas,
  onCrearOtra,
}) => {
  if (!reserva) return null;

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onGoToReservas}
      title="Solicitud Registrada con Éxito"
      subtitle="Comprobante digital institucional de registro de reserva"
      icon={CheckCircle2}
      maxWidth="md"
    >
      <div className="space-y-4 text-left">
        {/* Banner de Éxito y Cierre de Acción (Shneiderman Regla 3) */}
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold">¡Trámite Ingresado al Sistema!</h4>
            <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5 leading-relaxed">
              La solicitud ha sido registrada bajo la política de equidad UPLA y se encuentra en estado <strong>Pendiente de Dictamen</strong>.
            </p>
          </div>
        </div>

        {/* Ficha / Ticket Digital */}
        <div className="bg-canvas p-4 rounded-2xl border border-line space-y-3 font-sans">
          <div className="flex items-center justify-between border-b border-line pb-2.5">
            <div className="flex items-center gap-2.5">
              <img
                src="/upla_icon.png"
                alt="UPLA"
                className="w-7 h-7 object-contain"
              />
              <div>
                <span className="text-3xs uppercase font-extrabold tracking-wider text-ink-muted">
                  Código de Solicitud
                </span>
                <p className="font-mono text-sm font-black text-primary dark:text-sky-400">
                  UPLA-{reserva.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-3xs uppercase font-extrabold tracking-wider text-ink-muted">
                Estado Actual
              </span>
              <p className="inline-block px-2 py-0.5 rounded-full text-2xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                Pendiente
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-ink-muted">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-primary dark:text-sky-400 shrink-0" />
              <span>
                <strong>Ambiente:</strong> <span className="text-ink font-semibold">{reserva.ambienteNombre}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary dark:text-sky-400 shrink-0" />
              <span>
                <strong>Solicitante:</strong> <span className="text-ink font-semibold">{reserva.solicitanteNombre}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-line-soft">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary dark:text-sky-400 shrink-0" />
                <span><strong>Fecha:</strong> {reserva.fecha}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary dark:text-sky-400 shrink-0" />
                <span><strong>Horario:</strong> {reserva.horaInicio} - {reserva.horaFin}</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-surface border border-line text-2xs text-ink-muted flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p>
              El Administrador evaluará la justificación académica en un plazo no mayor a 24 horas. Puede consultar el estado en cualquier momento desde su panel.
            </p>
          </div>
        </div>

        {/* Acciones de Navegación Clara */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            icon={<PlusCircle className="w-4 h-4" />}
            onClick={onCrearOtra}
            className="w-full sm:w-auto"
          >
            Registrar Otra Solicitud
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={onGoToReservas}
            className="w-full sm:w-auto"
          >
            Ir a Mis Reservas
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ReservaTicketModal;
