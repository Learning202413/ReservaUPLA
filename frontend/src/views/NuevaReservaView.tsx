import React, { useEffect, useState } from 'react';
import { AlertMessage, Button, DateInput, SelectInput, TimeInput } from '../components/ui';
import { api } from '../services/api';
import { Ambiente, Usuario } from '../types';
import { CheckCircle2, AlertTriangle, ShieldCheck, Clock, MapPin, Users } from 'lucide-react';

interface NuevaReservaViewProps {
  onSuccess: () => void;
}

export const NuevaReservaView: React.FC<NuevaReservaViewProps> = ({ onSuccess }) => {
  const [ambientes, setAmbientes] = useState<Ambiente[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [notificacion, setNotificacion] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);

  // Form State
  const today = new Date().toISOString().split('T')[0];
  const [ambienteId, setAmbienteId] = useState<string>('');
  const [usuarioId, setUsuarioId] = useState<string>('');
  const [fecha, setFecha] = useState<string>(today);
  const [horaInicio, setHoraInicio] = useState<string>('08:00');
  const [horaFin, setHoraFin] = useState<string>('10:00');
  const [motivo, setMotivo] = useState<string>('');

  // Estados de Verificación de Disponibilidad (RF-04 / RN-01)
  const [disponibilidadEstado, setDisponibilidadEstado] = useState<{
    verificado: boolean;
    disponible: boolean;
    mensaje: string;
  }>({
    verificado: false,
    disponible: false,
    mensaje: '',
  });

  useEffect(() => {
    async function loadCatalogos() {
      const [ambData, usuData] = await Promise.all([api.getAmbientes(), api.getUsuarios()]);
      setAmbientes(ambData);
      setUsuarios(usuData);
      if (ambData.length > 0) setAmbienteId(ambData[0].id);
      if (usuData.length > 0) setUsuarioId(usuData[0].id);
    }
    loadCatalogos();
  }, []);

  // Verificar disponibilidad reactivamente cuando cambian fecha, hora o ambiente (RF-04)
  const handleVerificarDisponibilidad = async () => {
    if (!ambienteId || !fecha || !horaInicio || !horaFin) return;

    // Validación RN-03
    if (horaFin <= horaInicio) {
      setDisponibilidadEstado({
        verificado: true,
        disponible: false,
        mensaje: 'RN-03: La hora de fin debe ser estrictamente posterior a la hora de inicio.',
      });
      return;
    }

    // Validación RN-04
    if (horaInicio < '07:00' || horaFin > '22:00') {
      setDisponibilidadEstado({
        verificado: true,
        disponible: false,
        mensaje: 'RN-04: El horario institucional permitido es de 07:00 a 22:00 horas.',
      });
      return;
    }

    const res = await api.verificarDisponibilidad(ambienteId, fecha, horaInicio, horaFin);
    setDisponibilidadEstado({
      verificado: true,
      disponible: res.disponible,
      mensaje: res.mensaje,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotificacion(null);

    // RN-02: Campos obligatorios y motivo mínimo
    if (!ambienteId || !usuarioId || !fecha || !horaInicio || !horaFin || !motivo.trim()) {
      setNotificacion({ type: 'error', message: 'RN-02: Todos los campos del formulario son estrictamente obligatorios.' });
      return;
    }

    if (motivo.trim().length < 10) {
      setNotificacion({ type: 'error', message: 'RN-02: El motivo debe ser explícito y contener al menos 10 caracteres.' });
      return;
    }

    // RN-03: HoraFin > HoraInicio
    if (horaFin <= horaInicio) {
      setNotificacion({ type: 'error', message: 'RN-03: La hora de finalización debe ser mayor a la de inicio.' });
      return;
    }

    // RN-04: Horario permitido entre 07:00 y 22:00
    if (horaInicio < '07:00' || horaFin > '22:00') {
      setNotificacion({ type: 'error', message: 'RN-04: Las reservas solo pueden realizarse en el rango de 07:00 a 22:00 horas.' });
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

      setNotificacion({
        type: 'success',
        message: '¡Solicitud de reserva registrada con éxito! Ha quedado en estado Pendiente para revisión administrativa.',
      });

      setTimeout(() => {
        onSuccess();
      }, 1200);
    } catch (err: any) {
      setNotificacion({
        type: 'error',
        message: err.message || 'Error al procesar el registro de la reserva.',
      });
    } finally {
      setLoading(false);
    }
  };

  const ambienteSeleccionado = ambientes.find((a) => a.id === ambienteId);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
          Formulario de Registro de Solicitud de Reserva (RF-03)
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Validación algorítmica previa de disponibilidad horaria (RF-04, RN-01 a RN-04)
        </p>
      </div>

      {notificacion && (
        <AlertMessage
          type={notificacion.type}
          message={notificacion.message}
          onClose={() => setNotificacion(null)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario Principal */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectInput
              label="Ambiente Universitario (RF-02)"
              name="ambienteId"
              value={ambienteId}
              onChange={(e) => {
                setAmbienteId(e.target.value);
                setDisponibilidadEstado((prev) => ({ ...prev, verificado: false }));
              }}
              options={ambientes.map((a) => ({
                value: a.id,
                label: `${a.nombre} (Cap: ${a.capacidad} pers.)`,
              }))}
              required
            />

            <SelectInput
              label="Docente / Solicitante (RF-01)"
              name="usuarioId"
              value={usuarioId}
              onChange={(e) => setUsuarioId(e.target.value)}
              options={usuarios.map((u) => ({
                value: u.id,
                label: `${u.nombreCompleto} (${u.rol})`,
              }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <DateInput
              label="Fecha de Reserva"
              name="fecha"
              value={fecha}
              min={today}
              onChange={(e) => {
                setFecha(e.target.value);
                setDisponibilidadEstado((prev) => ({ ...prev, verificado: false }));
              }}
              required
            />

            <TimeInput
              label="Hora de Inicio (07:00 a 22:00)"
              name="horaInicio"
              value={horaInicio}
              onChange={(e) => {
                setHoraInicio(e.target.value);
                setDisponibilidadEstado((prev) => ({ ...prev, verificado: false }));
              }}
              required
            />

            <TimeInput
              label="Hora de Fin (Mayor a Inicio)"
              name="horaFin"
              value={horaFin}
              onChange={(e) => {
                setHoraFin(e.target.value);
                setDisponibilidadEstado((prev) => ({ ...prev, verificado: false }));
              }}
              required
            />
          </div>

          {/* Botón de Comprobación Preventiva (Heurística de Nielsen 5: Prevención de Errores) */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#006699]" />
              <span className="text-xs font-semibold text-slate-700">
                Verificación algorítmica previa (RF-04):
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleVerificarDisponibilidad}
            >
              Comprobar Disponibilidad
            </Button>
          </div>

          {disponibilidadEstado.verificado && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
                disponibilidadEstado.disponible
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-rose-50 border-rose-300 text-rose-800'
              }`}
            >
              {disponibilidadEstado.disponible ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span className="font-medium">{disponibilidadEstado.mensaje}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Motivo Académico / Institucional <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Describa la asignatura, laboratorio, sesión o evento que justifica la solicitud (mín. 10 caracteres)..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#006699]/20 focus:border-[#006699]"
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button type="submit" isLoading={loading} size="md">
              Registrar Solicitud de Reserva
            </Button>
          </div>
        </form>

        {/* Tarjeta Informativa Resumen del Ambiente (Heurística de Nielsen 6: Reconocimiento antes que Recuerdo) */}
        <div className="space-y-4">
          {ambienteSeleccionado ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">
                Ficha Técnica del Ambiente
              </span>
              <div>
                <h4 className="text-base font-bold text-slate-800">
                  {ambienteSeleccionado.nombre}
                </h4>
                <span className="inline-block mt-1 text-2xs font-bold px-2 py-0.5 rounded-full bg-sky-50 text-[#006699] border border-sky-200">
                  {ambienteSeleccionado.tipo}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>Aforo máximo: <strong>{ambienteSeleccionado.capacidad} personas</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>Ubicación: <strong>{ambienteSeleccionado.ubicacion}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Horario de servicio: <strong>07:00 a 22:00</strong></span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-2xs text-slate-500 leading-relaxed">
                Toda reserva registrada entrará en estado <em>Pendiente</em> hasta que el Administrador valide el requerimiento pedagógico (RN-05).
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center text-xs text-slate-400">
              Seleccione un ambiente para consultar sus detalles técnicos.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
