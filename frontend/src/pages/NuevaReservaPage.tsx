import React, { useEffect, useState, useRef } from 'react';
import { Button, FormMessage, InputField } from '../components/ui';
import { PageHeader } from '../components/layout/PageHeader';
import { PageContainer } from '../components/layout/PageContainer';
import { ScheduleTimeline } from '../components/reservas/ScheduleTimeline';
import { ReservaTicketModal } from '../components/reservas/ReservaTicketModal';
import { api } from '../services/api';
import { Ambiente, Usuario, Reserva } from '../types';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Users,
  MapPin,
  Clock,
  RotateCcw,
  Info,
} from 'lucide-react';

interface NuevaReservaPageProps {
  onSuccess: () => void;
}

const DRAFT_KEY = 'reservaupla_draft_reserva';

export const NuevaReservaPage: React.FC<NuevaReservaPageProps> = ({ onSuccess }) => {
  const [ambientes, setAmbientes] = useState<Ambiente[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | 'warning' | 'info' | ''>('');
  const [borradorRecuperado, setBorradorRecuperado] = useState<boolean>(false);

  const today = new Date().toISOString().split('T')[0];
  const [ambienteId, setAmbienteId] = useState<string>('');
  const [usuarioId, setUsuarioId] = useState<string>('');
  const [fecha, setFecha] = useState<string>(today);
  const [horaInicio, setHoraInicio] = useState<string>('08:00');
  const [horaFin, setHoraFin] = useState<string>('10:00');
  const [personasEstimadas, setPersonasEstimadas] = useState<number>(25);
  const [motivo, setMotivo] = useState<string>('');

  // Ticket modal de confirmación y cierre cognitivo (Shneiderman Regla 3 / Norman)
  const [reservaCreada, setReservaCreada] = useState<Reserva | null>(null);
  const [modalTicketAbierto, setModalTicketAbierto] = useState<boolean>(false);

  const [disponibilidad, setDisponibilidad] = useState<{
    verificado: boolean;
    disponible: boolean;
    mensaje: string;
  }>({
    verificado: false,
    disponible: false,
    mensaje: '',
  });

  const initialLoadDone = useRef(false);

  useEffect(() => {
    async function cargar() {
      const [ambData, usuData] = await Promise.all([api.getAmbientes(), api.getUsuarios()]);
      setAmbientes(ambData);
      setUsuarios(usuData);

      // Cargar borrador persistido en memoria de sesión (Norman - Reducción de carga cognitiva en STM)
      const rawDraft = sessionStorage.getItem(DRAFT_KEY);
      if (rawDraft) {
        try {
          const draft = JSON.parse(rawDraft);
          if (draft.ambienteId && ambData.some((a) => a.id === draft.ambienteId)) {
            setAmbienteId(draft.ambienteId);
          } else if (ambData.length > 0) {
            setAmbienteId(ambData[0].id);
          }

          if (draft.usuarioId && usuData.some((u) => u.id === draft.usuarioId)) {
            setUsuarioId(draft.usuarioId);
          } else if (usuData.length > 0) {
            setUsuarioId(usuData[0].id);
          }

          if (draft.fecha && draft.fecha >= today) setFecha(draft.fecha);
          if (draft.horaInicio) setHoraInicio(draft.horaInicio);
          if (draft.horaFin) setHoraFin(draft.horaFin);
          if (draft.personasEstimadas) setPersonasEstimadas(draft.personasEstimadas);
          if (draft.motivo) setMotivo(draft.motivo);

          setBorradorRecuperado(true);
        } catch {
          if (ambData.length > 0) setAmbienteId(ambData[0].id);
          if (usuData.length > 0) setUsuarioId(usuData[0].id);
        }
      } else {
        if (ambData.length > 0) setAmbienteId(ambData[0].id);
        if (usuData.length > 0) setUsuarioId(usuData[0].id);
      }

      initialLoadDone.current = true;
    }
    cargar();
  }, [today]);

  // Autosave del borrador ante cualquier cambio
  useEffect(() => {
    if (!initialLoadDone.current) return;
    const draft = {
      ambienteId,
      usuarioId,
      fecha,
      horaInicio,
      horaFin,
      personasEstimadas,
      motivo,
    };
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [ambienteId, usuarioId, fecha, horaInicio, horaFin, personasEstimadas, motivo]);

  const descartarBorrador = () => {
    sessionStorage.removeItem(DRAFT_KEY);
    setMotivo('');
    setHoraInicio('08:00');
    setHoraFin('10:00');
    setFecha(today);
    setPersonasEstimadas(25);
    setBorradorRecuperado(false);
  };

  const handleComprobarDisponibilidad = async () => {
    if (!ambienteId || !fecha || !horaInicio || !horaFin) return;

    if (horaFin <= horaInicio) {
      setDisponibilidad({
        verificado: true,
        disponible: false,
        mensaje: 'La hora de fin debe ser estrictamente posterior a la de inicio.',
      });
      return;
    }

    if (horaInicio < '07:00' || horaFin > '22:00') {
      setDisponibilidad({
        verificado: true,
        disponible: false,
        mensaje: 'El horario oficial permitido es de 07:00 a 22:00 horas.',
      });
      return;
    }

    const res = await api.verificarDisponibilidad(ambienteId, fecha, horaInicio, horaFin);
    setDisponibilidad({
      verificado: true,
      disponible: res.disponible,
      mensaje: res.mensaje,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Prevención de Slips / Errores de ejecución (Norman)
    if (!ambienteId || !usuarioId || !fecha || !horaInicio || !horaFin || !motivo.trim()) {
      setMessage('Todos los campos del formulario son estrictamente obligatorios.');
      setMessageType('error');
      return;
    }

    if (motivo.trim().length < 10) {
      setMessage('El motivo debe ser explícito y detallar al menos 10 caracteres.');
      setMessageType('error');
      return;
    }

    if (horaFin <= horaInicio) {
      setMessage('La hora de finalización debe ser mayor a la de inicio.');
      setMessageType('error');
      return;
    }

    if (horaInicio < '07:00' || horaFin > '22:00') {
      setMessage('Las reservas solo pueden realizarse en el rango oficial de 07:00 a 22:00 horas.');
      setMessageType('error');
      return;
    }

    // Restricción de tiempo real si es el mismo día
    const now = new Date();
    const currentHourStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
    if (fecha === today && horaInicio < currentHourStr) {
      setMessage(
        `No se puede solicitar una reserva en un horario anterior al actual (${currentHourStr}).`
      );
      setMessageType('error');
      return;
    }

    setLoading(true);
    try {
      const nueva = await api.crearReserva({
        ambienteId,
        usuarioId,
        fecha,
        horaInicio,
        horaFin,
        motivo: `${motivo.trim()} [Aforo estimado: ${personasEstimadas} pers.]`,
      });

      // Limpiar borrador tras éxito (Norman - Cierre del ciclo de acción)
      sessionStorage.removeItem(DRAFT_KEY);

      // Desplegar Modal Ticket Institucional (Shneiderman Regla 3: Design Dialogs to Yield Closure)
      setReservaCreada(nueva);
      setModalTicketAbierto(true);
    } catch (err: any) {
      setMessage(err.message || 'Error al procesar el registro de la reserva.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const ambienteSeleccionado = ambientes.find((a) => a.id === ambienteId);
  const aforoExcedido =
    ambienteSeleccionado && personasEstimadas > ambienteSeleccionado.capacidad;

  // Notificación institucional de anticipación 24h
  const esMenor24Horas = fecha === today;

  return (
    <PageContainer>
      <PageHeader
        title="Nueva Reserva"
        subtitle="Verificación visual en tiempo real de disponibilidad horaria, aforo y políticas institucionales."
      />

      {borradorRecuperado && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200 text-xs">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-primary dark:text-sky-400 shrink-0" />
            <span>Se restauraron los datos previos de su borrador de trabajo de forma automática.</span>
          </div>
          <button
            type="button"
            onClick={descartarBorrador}
            className="flex items-center gap-1 font-semibold text-rose-600 hover:text-rose-800 dark:text-rose-400 underline cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Descartar borrador</span>
          </button>
        </div>
      )}

      {message && <FormMessage type={messageType} message={message} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario Principal */}
        <div className="lg:col-span-2 space-y-6">
          <form
            onSubmit={handleSubmit}
            className="bg-surface border border-line rounded-2xl p-6 shadow-2xs space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label-standard">
                  Ambiente Universitario <span className="text-red-500">*</span>
                </label>
                <select
                  value={ambienteId}
                  onChange={(e) => {
                    setAmbienteId(e.target.value);
                    setDisponibilidad((prev) => ({ ...prev, verificado: false }));
                  }}
                  className="form-input-standard"
                  required
                >
                  {ambientes.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nombre} (Cap: {a.capacidad} pers.)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label-standard">
                  Docente / Solicitante <span className="text-red-500">*</span>
                </label>
                <select
                  value={usuarioId}
                  onChange={(e) => setUsuarioId(e.target.value)}
                  className="form-input-standard"
                  required
                >
                  {usuarios.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nombreCompleto} ({u.rol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <InputField
                label="Fecha de Reserva"
                name="fecha"
                type="date"
                value={fecha}
                min={today}
                onChange={(e) => {
                  setFecha(e.target.value);
                  setDisponibilidad((prev) => ({ ...prev, verificado: false }));
                }}
                required
              />

              <InputField
                label="Hora de Inicio"
                name="horaInicio"
                type="time"
                step={1800}
                value={horaInicio}
                onChange={(e) => {
                  setHoraInicio(e.target.value);
                  setDisponibilidad((prev) => ({ ...prev, verificado: false }));
                }}
                required
              />

              <InputField
                label="Hora de Fin"
                name="horaFin"
                type="time"
                step={1800}
                value={horaFin}
                onChange={(e) => {
                  setHoraFin(e.target.value);
                  setDisponibilidad((prev) => ({ ...prev, verificado: false }));
                }}
                required
              />

              <InputField
                label="Aforo Estimado"
                name="personasEstimadas"
                type="number"
                min={1}
                max={500}
                value={personasEstimadas}
                onChange={(e) => setPersonasEstimadas(parseInt(e.target.value, 10) || 1)}
                required
              />
            </div>

            {/* Advertencia de Restricción Física/Lógica de Aforo (Norman - Constraints) */}
            {aforoExcedido && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Advertencia de Capacidad Institucional:</span>
                  <p className="mt-0.5 leading-relaxed">
                    Ha indicado <strong>{personasEstimadas} asistentes</strong>, pero la capacidad máxima aprobada para este ambiente es de <strong>{ambienteSeleccionado.capacidad} personas</strong>. La administración podría rechazar su solicitud por sobreaforo.
                  </p>
                </div>
              </div>
            )}

            {/* Aviso Institucional de Reserva de Última Hora */}
            {esMenor24Horas && (
              <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200 text-xs flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary dark:text-sky-400 shrink-0" />
                <span>
                  <strong>Aviso:</strong> Reservas para hoy requieren validación urgente prioritaria de la coordinación académica.
                </span>
              </div>
            )}

            {/* Comprobación Preventiva de Disponibilidad */}
            <div className="flex items-center justify-between p-3.5 bg-canvas border border-line rounded-xl">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary dark:text-sky-400" />
                <span className="text-xs font-bold text-ink">
                  Comprobación Preventiva de Conflicto:
                </span>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleComprobarDisponibilidad}
              >
                Comprobar Disponibilidad
              </Button>
            </div>

            {disponibilidad.verificado && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
                  disponibilidad.disponible
                    ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                    : 'bg-rose-50 dark:bg-rose-950/70 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                }`}
              >
                {disponibilidad.disponible ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                )}
                <span className="font-semibold">{disponibilidad.mensaje}</span>
              </div>
            )}

            <div>
              <label className="form-label-standard">
                Motivo Académico / Institucional <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Describa la asignatura, laboratorio, sesión o evento que justifica la solicitud (mín. 10 caracteres)..."
                className="form-input-standard"
                required
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isSubmitting={loading}
                submittingText="Registrando solicitud..."
              >
                Registrar Solicitud de Reserva
              </Button>
            </div>
          </form>

          {/* Timeline Visual de Disponibilidad (Donald Norman - Knowledge in the World) */}
          {ambienteId && (
            <ScheduleTimeline
              ambienteId={ambienteId}
              fecha={fecha}
              horaInicio={horaInicio}
              horaFin={horaFin}
              onSelectSlot={(inicio, fin) => {
                setHoraInicio(inicio);
                setHoraFin(fin);
                setDisponibilidad((prev) => ({ ...prev, verificado: false }));
              }}
            />
          )}
        </div>

        {/* Ficha Técnica Lateral del Ambiente */}
        <div>
          {ambienteSeleccionado ? (
            <div className="bg-surface border border-line rounded-2xl p-5 shadow-2xs space-y-3.5 sticky top-20">
              <span className="text-3xs font-extrabold uppercase tracking-widest text-ink-muted">
                Ficha Técnica del Ambiente
              </span>
              <div>
                <h4 className="text-base font-black text-ink">{ambienteSeleccionado.nombre}</h4>
                <span className="inline-block mt-1 text-2xs font-bold px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/70 text-primary dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  {ambienteSeleccionado.tipo}
                </span>
              </div>

              <div className="space-y-2 text-xs text-ink-muted">
                <p className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary dark:text-sky-400" />
                  <span>
                    Aforo máximo:{' '}
                    <strong className="text-ink">{ambienteSeleccionado.capacidad} personas</strong>
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary dark:text-sky-400" />
                  <span>
                    Ubicación: <strong className="text-ink">{ambienteSeleccionado.ubicacion}</strong>
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary dark:text-sky-400" />
                  <span>
                    Horario permitido: <strong className="text-ink">07:00 a 22:00</strong>
                  </span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-canvas border border-line text-2xs text-ink-muted space-y-1.5 leading-relaxed">
                <p className="font-semibold text-ink">Garantías de Usabilidad UPLA:</p>
                <ul className="list-disc list-inside space-y-1 text-ink-muted">
                  <li>Validación algorítmica simétrica de solapamientos (RN-01).</li>
                  <li>Guardado automático de borrador en su navegador.</li>
                  <li>Selección directa de bloques libres desde el cronograma visual.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-canvas border border-line rounded-2xl p-5 text-center text-xs text-ink-muted">
              Seleccione un ambiente para consultar su ficha técnica.
            </div>
          )}
        </div>
      </div>

      {/* Modal de Cierre Cognitivo con Ticket Digital */}
      <ReservaTicketModal
        isOpen={modalTicketAbierto}
        reserva={reservaCreada}
        onGoToReservas={() => {
          setModalTicketAbierto(false);
          onSuccess();
        }}
        onCrearOtra={() => {
          setModalTicketAbierto(false);
          setReservaCreada(null);
          setMotivo('');
          setHoraInicio('08:00');
          setHoraFin('10:00');
          setDisponibilidad({ verificado: false, disponible: false, mensaje: '' });
        }}
      />
    </PageContainer>
  );
};

export default NuevaReservaPage;
