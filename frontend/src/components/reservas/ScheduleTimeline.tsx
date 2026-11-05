import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Reserva } from '../../types';
import { Clock, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react';

interface ScheduleTimelineProps {
  ambienteId: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  onSelectSlot?: (inicio: string, fin: string) => void;
}

interface HourSlot {
  horaStr: string;
  horaLabel: string;
  estado: 'libre' | 'aprobada' | 'pendiente' | 'seleccionada';
  reservaInfo?: {
    solicitante: string;
    motivo: string;
    rango: string;
  };
}

export const ScheduleTimeline: React.FC<ScheduleTimelineProps> = ({
  ambienteId,
  fecha,
  horaInicio,
  horaFin,
  onSelectSlot,
}) => {
  const [reservasDia, setReservasDia] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  const [reintento, setReintento] = useState(0);

  useEffect(() => {
    let activo = true;
    async function cargar() {
      if (!ambienteId || !fecha) return;
      setCargando(true);
      setErrorCarga(null);
      try {
        const todas = await api.getReservas();
        if (activo) {
          const filtradas = todas.filter(
            (r) =>
              r.ambienteId === ambienteId &&
              r.fecha === fecha &&
              r.estado !== 'Rechazada' &&
              r.estado !== 'Cancelada'
          );
          setReservasDia(filtradas);
        }
      } catch (err) {
        if (activo) {
          setErrorCarga('No se pudo sincronizar la disponibilidad horaria con el servidor.');
        }
      } finally {
        if (activo) setCargando(false);
      }
    }
    cargar();
    return () => {
      activo = false;
    };
  }, [ambienteId, fecha, reintento]);

  // Generar bloques de 07:00 a 22:00 (15 horas)
  const horas = Array.from({ length: 15 }, (_, i) => {
    const h = i + 7;
    const pad = (n: number) => n.toString().padStart(2, '0');
    const startStr = `${pad(h)}:00`;
    const endStr = `${pad(h + 1)}:00`;

    // Evaluar estado del slot
    let estado: HourSlot['estado'] = 'libre';
    let reservaInfo: HourSlot['reservaInfo'] = undefined;

    // 1. Verificar solapamiento con reservas existentes
    for (const r of reservasDia) {
      if (startStr < r.horaFin && endStr > r.horaInicio) {
        if (r.estado === 'Aprobada') {
          estado = 'aprobada';
          reservaInfo = {
            solicitante: r.solicitanteNombre,
            motivo: r.motivo,
            rango: `${r.horaInicio} - ${r.horaFin}`,
          };
          break;
        } else if (r.estado === 'Pendiente') {
          estado = 'pendiente';
          reservaInfo = {
            solicitante: r.solicitanteNombre,
            motivo: r.motivo,
            rango: `${r.horaInicio} - ${r.horaFin}`,
          };
        }
      }
    }

    // 2. Si no está ocupada, evaluar si está en el rango seleccionado actualmente
    if (estado === 'libre' && horaInicio && horaFin) {
      if (startStr < horaFin && endStr > horaInicio) {
        estado = 'seleccionada';
      }
    }

    return {
      horaStr: startStr,
      horaLabel: `${pad(h)}:00 - ${pad(h + 1)}:00`,
      estado,
      reservaInfo,
    } as HourSlot;
  });

  return (
    <div className="bg-surface border border-line rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary dark:text-sky-400" />
          <h4 className="text-xs sm:text-sm font-bold text-ink">
            Disponibilidad Horaria Visual (07:00 - 22:00)
          </h4>
        </div>
        <div className="flex items-center gap-1.5 text-2xs text-ink-muted">
          <Calendar className="w-3.5 h-3.5 text-ink-faint" />
          <span>{fecha || 'Seleccione fecha'}</span>
        </div>
      </div>

      {/* Leyenda de Signifiers (Norman) */}
      <div className="flex flex-wrap items-center gap-3 text-3xs text-ink-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
          <span>Libre / Disponible</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block ring-2 ring-primary/30" />
          <span>Selección Actual</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" />
          <span>En Dictamen (Pendiente)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" />
          <span>Ocupado (Aprobada)</span>
        </span>
      </div>

      {errorCarga && (
        <div className="p-3 mb-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between">
          <span>{errorCarga}</span>
          <button
            type="button"
            onClick={() => setReintento((r) => r + 1)}
            className="text-xs font-bold text-amber-800 dark:text-amber-300 underline cursor-pointer hover:text-amber-900"
          >
            Reintentar
          </button>
        </div>
      )}

      {cargando ? (
        <div className="py-8 text-center text-xs text-ink-muted animate-pulse">
          Consultando disponibilidad en tiempo real...
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-1">
          {horas.map((slot) => {
            let containerStyle = '';
            let badgeStyle = '';
            let title = '';

            switch (slot.estado) {
              case 'aprobada':
                containerStyle =
                  'bg-rose-50/80 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200 cursor-not-allowed opacity-90';
                badgeStyle =
                  'bg-rose-100 dark:bg-rose-900/80 text-rose-800 dark:text-rose-100 border border-rose-200 dark:border-rose-800 font-bold px-1.5 py-0.5 rounded-md';
                title = `Ocupado por ${slot.reservaInfo?.solicitante}: ${slot.reservaInfo?.motivo}`;
                break;
              case 'pendiente':
                containerStyle =
                  'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 cursor-not-allowed opacity-90';
                badgeStyle =
                  'bg-amber-100 dark:bg-amber-900/80 text-amber-900 dark:text-amber-100 border border-amber-200 dark:border-amber-800 font-bold px-1.5 py-0.5 rounded-md';
                title = `Solicitud pendiente: ${slot.reservaInfo?.motivo}`;
                break;
              case 'seleccionada':
                containerStyle =
                  'bg-sky-50 dark:bg-sky-950/70 border-primary dark:border-sky-400 text-primary dark:text-sky-200 ring-2 ring-primary/25 shadow-xs cursor-pointer';
                badgeStyle = 'bg-primary text-white font-bold shadow-2xs px-1.5 py-0.5 rounded-md';
                title = 'Rango actualmente seleccionado por usted';
                break;
              case 'libre':
              default:
                containerStyle =
                  'bg-white dark:bg-canvas hover:bg-emerald-50/80 dark:hover:bg-emerald-950/40 border-slate-200 dark:border-line hover:border-emerald-400 dark:hover:border-emerald-700 text-ink shadow-2xs hover:shadow-xs cursor-pointer transition-all';
                badgeStyle =
                  'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 font-bold px-1.5 py-0.5 rounded-md';
                title = 'Horario libre. Clic para seleccionar este bloque de 1 hora';
                break;
            }

            const handleClick = () => {
              if (slot.estado === 'libre' && onSelectSlot) {
                const nextHour = (parseInt(slot.horaStr.slice(0, 2), 10) + 1)
                  .toString()
                  .padStart(2, '0');
                onSelectSlot(slot.horaStr, `${nextHour}:00`);
              }
            };

            return (
              <button
                key={slot.horaStr}
                type="button"
                onClick={handleClick}
                disabled={slot.estado === 'aprobada' || slot.estado === 'pendiente'}
                title={title}
                className={`p-2 rounded-xl border text-left flex flex-col justify-between transition-all select-none ${containerStyle}`}
              >
                <div className="flex items-center justify-between text-2xs font-bold">
                  <span>{slot.horaStr}</span>
                  {slot.estado === 'seleccionada' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary dark:text-sky-400" />
                  )}
                  {slot.estado === 'aprobada' && (
                    <AlertTriangle className="w-3 h-3 text-rose-500" />
                  )}
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className={`text-3xs px-1.5 py-0.5 rounded font-semibold ${badgeStyle}`}>
                    {slot.estado === 'libre'
                      ? 'Libre'
                      : slot.estado === 'seleccionada'
                      ? 'Tu selección'
                      : slot.estado === 'aprobada'
                      ? 'Ocupado'
                      : 'Dictamen'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <p className="text-3xs text-ink-faint text-left pt-1 leading-normal">
        * Haz clic en cualquier horario <strong>Libre</strong> para seleccionarlo directamente en el formulario.
      </p>
    </div>
  );
};

export default ScheduleTimeline;
