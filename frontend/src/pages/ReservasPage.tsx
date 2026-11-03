import React, { useEffect, useState } from 'react';
import { FilterBar, StatusBadge, ConfirmModal, ModalWrapper, Button, EmptyState, FormMessage } from '../components/ui';
import { api } from '../services/api';
import { Reserva } from '../types';
import { Eye, Check, X, Ban, Calendar, MapPin, Clock } from 'lucide-react';

interface ReservasPageProps {
  rolActual: string;
}

export const ReservasPage: React.FC<ReservasPageProps> = ({ rolActual }) => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [notificacion, setNotificacion] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Estados de Modales
  const [reservaDetalle, setReservaDetalle] = useState<Reserva | null>(null);
  const [modalConfirm, setModalConfirm] = useState<{
    isOpen: boolean;
    reservaId: string;
    nuevoEstado: string;
    title: string;
    subtitle: string;
    variant: 'primary' | 'danger' | 'success';
  }>({
    isOpen: false,
    reservaId: '',
    nuevoEstado: '',
    title: '',
    subtitle: '',
    variant: 'primary',
  });
  const [procesandoAccion, setProcesandoAccion] = useState(false);

  const cargarReservas = async () => {
    setLoading(true);
    try {
      const data = await api.getReservas();
      setReservas(data);
    } catch {
      setNotificacion({ type: 'error', message: 'No se pudo conectar con el servicio de reservas.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  const handleAbrirAccion = (reserva: Reserva, accion: 'Aprobar' | 'Rechazar' | 'Cancelar') => {
    // RN-06: Inmutabilidad de reservas rechazadas
    if (reserva.estado === 'Rechazada') {
      setNotificacion({
        type: 'error',
        message: 'RN-06: Esta reserva ya fue Rechazada y el reglamento estipula que es inmutable.',
      });
      return;
    }

    // RN-05: Solo el administrador puede aprobar o rechazar
    if ((accion === 'Aprobar' || accion === 'Rechazar') && rolActual !== 'Administrador') {
      setNotificacion({
        type: 'error',
        message: `RN-05: Su rol actual es '${rolActual}'. Solo el Administrador tiene autorización para aprobar o rechazar solicitudes.`,
      });
      return;
    }

    setModalConfirm({
      isOpen: true,
      reservaId: reserva.id,
      nuevoEstado: accion === 'Aprobar' ? 'Aprobada' : accion === 'Rechazar' ? 'Rechazada' : 'Cancelada',
      title: `${accion} Solicitud de Reserva`,
      subtitle: `¿Confirma cambiar el estado de la reserva para el ambiente "${reserva.ambienteNombre}" el ${reserva.fecha} (${reserva.horaInicio} a ${reserva.horaFin})?`,
      variant: accion === 'Aprobar' ? 'success' : accion === 'Rechazar' ? 'danger' : 'primary',
    });
  };

  const handleConfirmarAccion = async () => {
    setProcesandoAccion(true);
    try {
      await api.cambiarEstadoReserva(modalConfirm.reservaId, modalConfirm.nuevoEstado, rolActual);
      setNotificacion({
        type: 'success',
        message: `La reserva fue actualizada al estado '${modalConfirm.nuevoEstado}' correctamente.`,
      });
      setModalConfirm((prev) => ({ ...prev, isOpen: false }));
      await cargarReservas();
    } catch (err: any) {
      setNotificacion({
        type: 'error',
        message: err.message || 'Error al procesar la actualización de estado.',
      });
      setModalConfirm((prev) => ({ ...prev, isOpen: false }));
    } finally {
      setProcesandoAccion(false);
    }
  };

  const reservasFiltradas = reservas.filter((r) => {
    const coincideEstado = filtroEstado === 'todos' || r.estado === filtroEstado;
    const coincideBusqueda =
      busqueda.trim() === '' ||
      r.ambienteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.solicitanteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.motivo.toLowerCase().includes(busqueda.toLowerCase());
    return coincideEstado && coincideBusqueda;
  });

  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-ink tracking-tight">
          Control y Gestión de Reservas (RF-05, RF-06, RF-07)
        </h2>
        <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
          Listado integral, auditoría de motivos y máquina de estados con permisos institucionales.
        </p>
      </div>

      {notificacion && (
        <FormMessage
          type={notificacion.type}
          message={notificacion.message}
        />
      )}

      {/* Barra de Búsqueda y Filtros Reutilizable (FilterBar) */}
      <FilterBar
        searchValue={busqueda}
        onSearchChange={setBusqueda}
        searchPlaceholder="Buscar por ambiente, docente o motivo..."
      >
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['todos', 'Pendiente', 'Aprobada', 'Rechazada', 'Cancelada'].map((estado) => (
            <button
              key={estado}
              type="button"
              onClick={() => setFiltroEstado(estado)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0 ${
                filtroEstado === estado
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-slate-100 text-ink-muted hover:bg-slate-200'
              }`}
            >
              {estado === 'todos' ? 'Todos' : estado}
            </button>
          ))}
        </div>
      </FilterBar>

      {/* Tabla de Datos / Listado */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 bg-surface rounded-2xl border border-line">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mb-3" />
          <p className="text-sm font-semibold text-ink">Cargando registros de reservas...</p>
        </div>
      ) : reservasFiltradas.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No se encontraron reservas"
          description="No existen solicitudes registradas que coincidan con los criterios de búsqueda o filtro seleccionados."
        />
      ) : (
        <div className="w-full overflow-hidden border border-line rounded-2xl bg-surface shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans">
              <thead>
                <tr className="bg-slate-50 border-b border-line text-xs font-bold text-ink-muted uppercase tracking-wider">
                  <th className="py-3.5 px-4">Ambiente UPLA</th>
                  <th className="py-3.5 px-4">Fecha y Horario</th>
                  <th className="py-3.5 px-4">Solicitante</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-sm">
                {reservasFiltradas.map((r, idx) => (
                  <tr
                    key={r.id}
                    className={`hover:bg-sky-50/40 transition-colors ${
                      idx % 2 === 0 ? 'bg-surface' : 'bg-slate-50/30'
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-ink">{r.ambienteNombre}</p>
                      <p className="text-2xs text-ink-muted flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{r.ambienteUbicacion}</span>
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-ink">{r.fecha}</p>
                      <p className="text-xs text-primary font-bold flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{r.horaInicio} - {r.horaFin}</span>
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-ink text-xs">{r.solicitanteNombre}</p>
                      <p className="text-2xs text-ink-muted">{r.solicitanteCorreo}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={r.estado} />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setReservaDetalle(r)}
                          className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Consultar detalle (RF-06)"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {r.estado === 'Pendiente' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleAbrirAccion(r, 'Aprobar')}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              title="Aprobar reserva (RN-05)"
                            >
                              <Check className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleAbrirAccion(r, 'Rechazar')}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Rechazar reserva (RN-05)"
                            >
                              <X className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleAbrirAccion(r, 'Cancelar')}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="Cancelar mi solicitud"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Detalle usando ModalWrapper de GirasolesRes */}
      {reservaDetalle && (
        <ModalWrapper
          isOpen={Boolean(reservaDetalle)}
          onClose={() => setReservaDetalle(null)}
          title="Ficha Detallada de la Reserva"
          subtitle={`Código de trámite: ${reservaDetalle.id.substring(0, 8)}`}
          maxWidth="lg"
          footer={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReservaDetalle(null)}
            >
              Cerrar Ficha
            </Button>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-line">
                <span className="text-ink-muted font-semibold block">Ambiente:</span>
                <span className="font-bold text-ink mt-0.5 block">{reservaDetalle.ambienteNombre}</span>
                <span className="text-3xs text-ink-muted">{reservaDetalle.ambienteUbicacion}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-line">
                <span className="text-ink-muted font-semibold block">Fecha y Horario:</span>
                <span className="font-bold text-primary mt-0.5 block">{reservaDetalle.fecha}</span>
                <span className="text-2xs font-semibold text-ink">{reservaDetalle.horaInicio} a {reservaDetalle.horaFin}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-line">
                <span className="text-ink-muted font-semibold block">Docente Solicitante:</span>
                <span className="font-bold text-ink mt-0.5 block">{reservaDetalle.solicitanteNombre}</span>
                <span className="text-3xs text-ink-muted">{reservaDetalle.solicitanteCorreo}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-line">
                <span className="text-ink-muted font-semibold block">Estado Actual:</span>
                <div className="mt-1">
                  <StatusBadge status={reservaDetalle.estado} />
                </div>
              </div>
            </div>

            <div className="p-4 bg-sky-50/70 border border-sky-100 rounded-xl">
              <span className="text-xs font-bold text-primary block">
                Motivo Académico / Institucional Registrado:
              </span>
              <p className="text-xs text-ink mt-1.5 leading-relaxed">
                {reservaDetalle.motivo}
              </p>
            </div>
          </div>
        </ModalWrapper>
      )}

      {/* Modal de Confirmación usando ConfirmModal de GirasolesRes */}
      <ConfirmModal
        isOpen={modalConfirm.isOpen}
        onClose={() => setModalConfirm((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmarAccion}
        loading={procesandoAccion}
        title={modalConfirm.title}
        subtitle={modalConfirm.subtitle}
        confirmVariant={modalConfirm.variant}
        confirmText="Confirmar Acción"
      />
    </div>
  );
};

export default ReservasPage;
