import React, { useEffect, useState } from 'react';
import { Button, FormMessage, InputField } from '../components/ui';
import { api } from '../services/api';
import { Ambiente, Usuario } from '../types';
import { ShieldCheck, CheckCircle2, AlertTriangle, Users, MapPin, Clock } from 'lucide-react';

interface NuevaReservaPageProps {
  onSuccess: () => void;
}

export const NuevaReservaPage: React.FC<NuevaReservaPageProps> = ({ onSuccess }) => {
  const [ambientes, setAmbientes] = useState<Ambiente[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | 'warning' | 'info' | ''>('');

  const today = new Date().toISOString().split('T')[0];
  const [ambienteId, setAmbienteId] = useState<string>('');
  const [usuarioId, setUsuarioId] = useState<string>('');
  const [fecha, setFecha] = useState<string>(today);
  const [horaInicio, setHoraInicio] = useState<string>('08:00');
  const [horaFin, setHoraFin] = useState<string>('10:00');
  const [motivo, setMotivo] = useState<string>('');

  // Verificación algorítmica preventiva de disponibilidad (RF-04 / RN-01)
  const [disponibilidad, setDisponibilidad] = useState<{
    verificado: boolean;
    disponible: boolean;
    mensaje: string;
  }>({
    verificado: false,
    disponible: false,
    mensaje: '',
  });

  useEffect(() => {
    async function cargar() {
      const [ambData, usuData] = await Promise.all([api.getAmbientes(), api.getUsuarios()]);
      setAmbientes(ambData);
      setUsuarios(usuData);
      if (ambData.length > 0) setAmbienteId(ambData[0].id);
      if (usuData.length > 0) setUsuarioId(usuData[0].id);
    }
    cargar();
  }, []);

  const handleComprobarDisponibilidad = async () => {
    if (!ambienteId || !fecha || !horaInicio || !horaFin) return;

    if (horaFin <= horaInicio) {
      setDisponibilidad({
        verificado: true,
        disponible: false,
        mensaje: 'RN-03: La hora de fin debe ser estrictamente posterior a la de inicio.',
      });
      return;
    }

    if (horaInicio < '07:00' || horaFin > '22:00') {
      setDisponibilidad({
        verificado: true,
        disponible: false,
        mensaje: 'RN-04: El horario oficial permitido es de 07:00 a 22:00 horas.',
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

    // RN-02: Campos obligatorios y motivo detallado
    if (!ambienteId || !usuarioId || !fecha || !horaInicio || !horaFin || !motivo.trim()) {
      setMessage('RN-02: Todos los campos del formulario son estrictamente obligatorios.');
      setMessageType('error');
      return;
    }

    if (motivo.trim().length < 10) {
      setMessage('RN-02: El motivo debe ser explícito y detallar al menos 10 caracteres.');
      setMessageType('error');
      return;
    }

    // RN-03: HoraFin > HoraInicio
    if (horaFin <= horaInicio) {
      setMessage('RN-03: La hora de finalización debe ser mayor a la de inicio.');
      setMessageType('error');
      return;
    }

    // RN-04: 07:00 a 22:00
    if (horaInicio < '07:00' || horaFin > '22:00') {
      setMessage('RN-04: Las reservas solo pueden realizarse en el rango de 07:00 a 22:00 horas.');
      setMessageType('error');
      return;
    }

    setLoading(true);
    try {
      await api.crearReserva({
        ambienteId,
        usuarioId,
        fecha,
        horaInicio,
        horaFin,
        motivo: motivo.trim(),
      });

      setMessage('¡Solicitud de reserva registrada con éxito! Estado: Pendiente de dictamen administrativo.');
      setMessageType('success');

      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (err: any) {
      setMessage(err.message || 'Error al procesar el registro de la reserva.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const ambienteSeleccionado = ambientes.find((a) => a.id === ambienteId);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-ink tracking-tight">
          Nueva Solicitud de Reserva (RF-03)
        </h2>
        <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
          Verificación algorítmica previa de disponibilidad horaria (RF-04, RN-01 a RN-04).
        </p>
      </div>

      {message && (
        <FormMessage
          type={messageType}
          message={message}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario Principal */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-surface border border-line-strong rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label-standard">
                Ambiente Universitario (RF-02) <span className="text-red-500">*</span>
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
                Docente / Solicitante (RF-01) <span className="text-red-500">*</span>
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              value={horaFin}
              onChange={(e) => {
                setHoraFin(e.target.value);
                setDisponibilidad((prev) => ({ ...prev, verificado: false }));
              }}
              required
            />
          </div>

          {/* Comprobación Preventiva de Disponibilidad */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-line rounded-xl">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-ink">
                Comprobación de Disponibilidad:
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
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-rose-50 border-rose-300 text-rose-800'
              }`}
            >
              {disponibilidad.disponible ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
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

        {/* Ficha Técnica Lateral del Ambiente */}
        <div>
          {ambienteSeleccionado ? (
            <div className="bg-surface border border-line-strong rounded-2xl p-5 shadow-2xs space-y-3.5">
              <span className="text-3xs font-extrabold uppercase tracking-widest text-ink-muted">
                Ficha Técnica del Ambiente
              </span>
              <div>
                <h4 className="text-base font-black text-ink">
                  {ambienteSeleccionado.nombre}
                </h4>
                <span className="inline-block mt-1 text-2xs font-bold px-2 py-0.5 rounded-full bg-sky-50 text-primary border border-sky-200">
                  {ambienteSeleccionado.tipo}
                </span>
              </div>

              <div className="space-y-2 text-xs text-ink-muted">
                <p className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>Aforo máximo: <strong className="text-ink">{ambienteSeleccionado.capacidad} personas</strong></span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>Ubicación: <strong className="text-ink">{ambienteSeleccionado.ubicacion}</strong></span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Horario permitido: <strong className="text-ink">07:00 a 22:00</strong></span>
                </p>
              </div>

              <div className="pt-3 border-t border-line text-2xs text-ink-muted leading-relaxed">
                Toda solicitud entrará en estado <em>Pendiente</em> para la evaluación y aprobación del Administrador (RN-05).
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-line rounded-2xl p-5 text-center text-xs text-slate-400">
              Seleccione un ambiente para consultar su ficha técnica.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NuevaReservaPage;
