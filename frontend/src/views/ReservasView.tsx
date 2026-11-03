import React, { useEffect, useState } from 'react';
import { AlertMessage, Button, ModalConfirmacion, TableList } from '../components/ui';
import { api } from '../services/api';
import { Reserva } from '../types';
import { Eye, Check, X, Ban, Filter, Search } from 'lucide-react';

interface ReservasViewProps {
  rolActual: string;
}

export const ReservasView: React.FC<ReservasViewProps> = ({ rolActual }) => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [notificacion, setNotificacion] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Estados para Modal de Confirmación
  const [modalAccion, setModalAccion] = useState<{
    isOpen: boolean;
    reservaId: string;
    nuevoEstado: string;
    titulo: string;
    descripcion: string;
    variante: 'danger' | 'primary' | 'success';
  }>({
    isOpen: false,
    reservaId: '',
    nuevoEstado: '',
    titulo: '',
    descripcion: '',
    variante: 'primary',
  });

  // Estado para Modal de Detalle (RF-06)
  const [reservaDetalle, setReservaDetalle] = useState<Reserva | null>(null);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const data = await api.getReservas();
      setReservas(data);
    } catch {
      setNotificacion({ type: 'error', message: 'No se pudo cargar la lista de reservas.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleAbrirAccion = (reserva: Reserva, accion: 'Aprobar' | 'Rechazar' | 'Cancelar') => {
    // Validación RN-06: Una reserva rechazada no podrá modificarse
    if (reserva.estado === 'Rechazada') {
      setNotificacion({
        type: 'error',
        message: 'RN-06: Esta reserva ya se encuentra en estado Rechazada y no puede ser modificada.',
      });
      return;
    }

    // Validación RN-05: Solo el administrador puede aprobar o rechazar
    if ((accion === 'Aprobar' || accion === 'Rechazar') && rolActual !== 'Administrador') {
      setNotificacion({
        type: 'error',
        message: `RN-05: Solo el Administrador puede ${accion.toLowerCase()} solicitudes. Su rol actual es '${rolActual}'.`,
      });
      return;
    }

    setModalAccion({
      isOpen: true,
      reservaId: reserva.id,
      nuevoEstado: accion === 'Aprobar' ? 'Aprobada' : accion === 'Rechazar' ? 'Rechazada' : 'Cancelada',
      titulo: `${accion} Reserva de ${reserva.ambienteNombre}`,
      descripcion: `¿Está seguro de cambiar el estado de esta reserva a '${accion === 'Aprobar' ? 'Aprobada' : accion === 'Rechazar' ? 'Rechazada' : 'Cancelada'}' para el día ${reserva.fecha} (${reserva.horaInicio} a ${reserva.horaFin})?`,
      variante: accion === 'Aprobar' ? 'success' : accion === 'Rechazar' ? 'danger' : 'primary',
    });
  };

  const handleConfirmarAccion = async () => {
    try {
      await api.cambiarEstadoReserva(modalAccion.reservaId, modalAccion.nuevoEstado, rolActual);
      setNotificacion({
        type: 'success',
        message: `La reserva fue actualizada al estado '${modalAccion.nuevoEstado}' con éxito.`,
      });
      setModalAccion((prev) => ({ ...prev, isOpen: false }));
      await cargarDatos();
    } catch (err: any) {
      setNotificacion({
        type: 'error',
        message: err.message || 'Error al procesar el cambio de estado.',
      });
      setModalAccion((prev) => ({ ...prev, isOpen: false }));
    }
  };

  // Filtrado reactivo en memoria
  const reservasFiltradas = reservas.filter((r) => {
    const coincideEstado = filtroEstado === 'todos' || r.estado === filtroEstado;
    const coincideBusqueda =
      busqueda.trim() === '' ||
      r.ambienteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.solicitanteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.motivo.toLowerCase().includes(busqueda.toLowerCase());
    return coincideEstado && coincideBusqueda;
  });

  const columns = [
    {
      key: 'ambiente',
      header: 'Ambiente UPLA',
      render: (r: Reserva) => (
        <div>
          <p className="font-bold text-slate-800">{r.ambienteNombre}</p>
          <p className="text-2xs text-slate-500">{r.ambienteUbicacion}</p>
        </div>
      ),
    },
    {
      key: 'horario',
      header: 'Fecha y Horario',
      render: (r: Reserva) => (
        <div>
          <p className="font-medium text-slate-800">{r.fecha}</p>
          <p className="text-xs text-sky-800 font-semibold">{r.horaInicio} - {r.horaFin}</p>
        </div>
      ),
    },
    {
      key: 'solicitante',
      header: 'Solicitante',
      render: (r: Reserva) => (
        <div>
          <p className="font-medium text-slate-800 text-xs">{r.solicitanteNombre}</p>
          <p className="text-2xs text-slate-400">{r.solicitanteCorreo}</p>
        </div>
      ),
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (r: Reserva) => {
        const badgeColors = {
          Aprobada: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          Pendiente: 'bg-amber-50 text-amber-700 border-amber-200',
          Rechazada: 'bg-rose-50 text-rose-700 border-rose-200',
          Cancelada: 'bg-slate-100 text-slate-600 border-slate-200',
        };
        return (
          <span className={`text-2xs font-bold px-2.5 py-1 rounded-full border ${badgeColors[r.estado]}`}>
            {r.estado}
          </span>
        );
      },
    },
    {
      key: 'acciones',
      header: 'Acciones',
      className: 'text-right',
      render: (r: Reserva) => (
        <div className="flex items-center justify-end gap-1.5">
          {/* Botón Ver Detalle (RF-06) */}
          <button
            onClick={() => setReservaDetalle(r)}
            className="p-1.5 text-slate-600 hover:text-[#006699] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Ver detalle"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Acciones de Administrador (RF-07, RN-05) */}
          {r.estado === 'Pendiente' && (
            <>
              <button
                onClick={() => handleAbrirAccion(r, 'Aprobar')}
                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                title="Aprobar reserva"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleAbrirAccion(r, 'Rechazar')}
                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Rechazar reserva"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Cancelar por Solicitante */}
          {r.estado === 'Pendiente' && (
            <button
              onClick={() => handleAbrirAccion(r, 'Cancelar')}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Cancelar solicitud"
            >
              <Ban className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Encabezado de la Vista */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            Control y Listado de Reservas Registradas
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Búsqueda, consulta de detalles y cambio de estado controlado (RF-05, RF-06, RF-07)
          </p>
        </div>
      </div>

      {notificacion && (
        <AlertMessage
          type={notificacion.type}
          message={notificacion.message}
          onClose={() => setNotificacion(null)}
        />
      )}

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por ambiente, docente o motivo..."
            className="w-full pl-9.5 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#006699]/20 focus:border-[#006699]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex gap-1 overflow-x-auto w-full sm:w-auto">
            {['todos', 'Pendiente', 'Aprobada', 'Rechazada', 'Cancelada'].map((estado) => (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
                  filtroEstado === estado
                    ? 'bg-[#006699] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {estado === 'todos' ? 'Todos' : estado}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla Reutilizable TableList (Semana 07 / Componente 8) */}
      <TableList
        columns={columns}
        data={reservasFiltradas}
        keyExtractor={(r) => r.id}
        emptyMessage="No hay reservas que coincidan con los filtros seleccionados."
        isLoading={loading}
      />

      {/* Modal de Detalle de Reserva (RF-06) */}
      {reservaDetalle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">
                  Detalle de Solicitud (RF-06)
                </span>
                <h3 className="text-lg font-bold text-slate-800">
                  {reservaDetalle.ambienteNombre}
                </h3>
              </div>
              <button
                onClick={() => setReservaDetalle(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 font-medium">Fecha Programada:</span>
                <p className="font-bold text-slate-800 mt-0.5">{reservaDetalle.fecha}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 font-medium">Horario:</span>
                <p className="font-bold text-sky-800 mt-0.5">{reservaDetalle.horaInicio} a {reservaDetalle.horaFin}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 font-medium">Solicitante:</span>
                <p className="font-bold text-slate-800 mt-0.5">{reservaDetalle.solicitanteNombre}</p>
                <p className="text-2xs text-slate-500">{reservaDetalle.solicitanteCorreo}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 font-medium">Ubicación Física:</span>
                <p className="font-bold text-slate-800 mt-0.5">{reservaDetalle.ambienteUbicacion}</p>
              </div>
            </div>

            <div className="p-3.5 bg-sky-50/50 border border-sky-100 rounded-xl">
              <span className="text-xs font-bold text-[#006699]">Motivo Académico / Institucional:</span>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                {reservaDetalle.motivo}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="outline" onClick={() => setReservaDetalle(null)}>
                Cerrar Detalle
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Reutilizable ModalConfirmacion (Semana 07 / Componente 7) */}
      <ModalConfirmacion
        isOpen={modalAccion.isOpen}
        title={modalAccion.titulo}
        description={modalAccion.descripcion}
        variant={modalAccion.variante}
        confirmText="Confirmar Acción"
        cancelText="Volver Atrás"
        onConfirm={handleConfirmarAccion}
        onCancel={() => setModalAccion((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
