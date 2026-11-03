import React, { useEffect, useState } from 'react';
import {
  Button,
  ActionButton,
  FilterBar,
  StatusBadge,
  ConfirmModal,
  ModalWrapper,
  DataTable,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  TablePagination,
} from '../components/ui';
import { PageHeader } from '../components/layout/PageHeader';
import { PageContainer } from '../components/layout/PageContainer';
import { api } from '../services/api';
import { Reserva, Usuario } from '../types';
import {
  PlusCircle,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  User,
  Building,
} from 'lucide-react';

interface ReservasPageProps {
  usuario?: Usuario | null;
  onNuevaReservaClick: () => void;
}

export const ReservasPage: React.FC<ReservasPageProps> = ({
  usuario,
  onNuevaReservaClick,
}) => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [busqueda, setBusqueda] = useState<string>('');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const itemsPorPagina = 8;

  // Modales
  const [reservaDetalle, setReservaDetalle] = useState<Reserva | null>(null);
  const [modalConfirmacion, setModalConfirmacion] = useState<{
    abierto: boolean;
    accion: 'aprobar' | 'rechazar';
    reservaId: string;
    ambienteNombre: string;
  }>({
    abierto: false,
    accion: 'aprobar',
    reservaId: '',
    ambienteNombre: '',
  });

  const [procesando, setProcesando] = useState<boolean>(false);

  const cargarReservas = async () => {
    setLoading(true);
    try {
      const data = await api.getReservas();
      setReservas(data);
    } catch (err) {
      console.error('Error al cargar reservas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  const esAdmin = usuario?.rol === 'Administrador';

  // Filtrado
  const reservasFiltradas = reservas.filter((r) => {
    const matchBusqueda =
      r.ambienteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.solicitanteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.motivo.toLowerCase().includes(busqueda.toLowerCase());

    const matchEstado =
      filtroEstado === 'todos' ||
      r.estado.toLowerCase() === filtroEstado.toLowerCase();

    return matchBusqueda && matchEstado;
  });

  // Paginación
  const totalItems = reservasFiltradas.length;
  const totalPages = Math.ceil(totalItems / itemsPorPagina);
  const reservasPaginadas = reservasFiltradas.slice(
    (paginaActual - 1) * itemsPorPagina,
    paginaActual * itemsPorPagina
  );

  const handleAbrirConfirmacion = (id: string, nombre: string, accion: 'aprobar' | 'rechazar') => {
    setModalConfirmacion({
      abierto: true,
      accion,
      reservaId: id,
      ambienteNombre: nombre,
    });
  };

  const handleEjecutarAccion = async () => {
    setProcesando(true);
    try {
      const nuevoEstado = modalConfirmacion.accion === 'aprobar' ? 'Aprobada' : 'Rechazada';
      await api.cambiarEstadoReserva(modalConfirmacion.reservaId, nuevoEstado);
      await cargarReservas();
      setModalConfirmacion((prev) => ({ ...prev, abierto: false }));
    } catch (err) {
      console.error('Error al procesar reserva:', err);
    } finally {
      setProcesando(false);
    }
  };

  return (
    <PageContainer>
      {/* Cabecera Estandarizada con PageHeader */}
      <PageHeader
        title="Control de Reservas de Ambientes"
        subtitle="Monitoreo de solicitudes, dictamen administrativo y asignación horaria."
        count={reservasFiltradas.length}
        countLabel="solicitudes"
        actions={
          <Button
            variant="primary"
            size="md"
            icon={<PlusCircle className="w-4 h-4" />}
            onClick={onNuevaReservaClick}
          >
            Nueva Reserva
          </Button>
        }
      />

      {/* Barra de Filtros y Búsqueda */}
      <FilterBar
        searchValue={busqueda}
        onSearchChange={(val) => {
          setBusqueda(val);
          setPaginaActual(1);
        }}
        searchPlaceholder="Buscar por ambiente, solicitante o motivo..."
      >
        <div className="flex items-center gap-1.5">
          {['todos', 'Pendiente', 'Aprobada', 'Rechazada'].map((estado) => {
            const isSelected = filtroEstado === estado;
            return (
              <button
                key={estado}
                type="button"
                onClick={() => {
                  setFiltroEstado(estado);
                  setPaginaActual(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer select-none ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-surface hover:bg-slate-100 dark:hover:bg-slate-800 text-ink border-line'
                }`}
              >
                {estado === 'todos' ? 'Todas' : estado}
              </button>
            );
          })}
        </div>
      </FilterBar>

      {/* Tabla Estandarizada con DataTable */}
      <DataTable
        loading={loading}
        isEmpty={reservasFiltradas.length === 0}
        emptyTitle="No se encontraron solicitudes"
        emptyMessage="No hay reservas que coincidan con los criterios de búsqueda o filtros seleccionados."
        emptyActionLabel="Registrar nueva reserva"
        onEmptyAction={onNuevaReservaClick}
      >
        <TableHead>
          <tr>
            <TableHeaderCell>Ambiente</TableHeaderCell>
            <TableHeaderCell>Solicitante</TableHeaderCell>
            <TableHeaderCell>Fecha</TableHeaderCell>
            <TableHeaderCell>Horario</TableHeaderCell>
            <TableHeaderCell>Estado</TableHeaderCell>
            <TableHeaderCell align="right">Acciones</TableHeaderCell>
          </tr>
        </TableHead>

        <TableBody>
          {reservasPaginadas.map((r) => (
            <TableRow key={r.id}>
              <TableCell>
                <div className="flex items-center gap-2 font-bold text-ink">
                  <Building className="w-4 h-4 text-primary dark:text-sky-400 shrink-0" />
                  <span>{r.ambienteNombre}</span>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2 text-ink-muted">
                  <User className="w-3.5 h-3.5 text-ink-faint shrink-0" />
                  <span>{r.solicitanteNombre}</span>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-1.5 text-ink font-medium">
                  <Calendar className="w-3.5 h-3.5 text-ink-muted shrink-0" />
                  <span>{r.fecha}</span>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-1.5 text-ink font-semibold">
                  <Clock className="w-3.5 h-3.5 text-ink-muted shrink-0" />
                  <span>
                    {r.horaInicio} - {r.horaFin}
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <StatusBadge status={r.estado} />
              </TableCell>

              <TableCell align="right">
                <div className="flex items-center justify-end gap-1.5">
                  <ActionButton
                    size="sm"
                    variant="ghost"
                    icon={Eye}
                    onClick={() => setReservaDetalle(r)}
                    aria-label="Ver detalle de la solicitud"
                    title="Ver detalle de la solicitud"
                  />

                  {esAdmin && r.estado === 'Pendiente' && (
                    <>
                      <ActionButton
                        size="sm"
                        variant="secondary"
                        icon={CheckCircle}
                        onClick={() => handleAbrirConfirmacion(r.id, r.ambienteNombre, 'aprobar')}
                        className="text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60"
                        title="Aprobar solicitud de reserva"
                      >
                        Aprobar
                      </ActionButton>

                      <ActionButton
                        size="sm"
                        variant="danger"
                        icon={XCircle}
                        onClick={() => handleAbrirConfirmacion(r.id, r.ambienteNombre, 'rechazar')}
                        title="Rechazar solicitud de reserva"
                      >
                        Rechazar
                      </ActionButton>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </DataTable>

      {/* Paginación Estandarizada */}
      <TablePagination
        currentPage={paginaActual}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPorPagina}
        entityName="solicitudes"
        onPageChange={(pag) => setPaginaActual(pag)}
      />

      {/* Modal de Detalle con ModalWrapper */}
      <ModalWrapper
        isOpen={reservaDetalle !== null}
        onClose={() => setReservaDetalle(null)}
        title="Ficha Oficial de Reserva"
        subtitle={`Código: ${reservaDetalle?.id.slice(0, 8)}`}
        icon={Building}
        maxWidth="lg"
      >
        {reservaDetalle && (
          <div className="space-y-4 text-left">
            <div className="p-4 bg-canvas rounded-2xl border border-line space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xs font-extrabold uppercase tracking-widest text-ink-muted">
                    Espacio Físico Solicitado
                  </span>
                  <h4 className="text-base font-black text-ink">
                    {reservaDetalle.ambienteNombre}
                  </h4>
                </div>
                <StatusBadge status={reservaDetalle.estado} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-line-soft">
                <div className="flex items-center gap-2 text-ink-muted">
                  <User className="w-4 h-4 text-primary shrink-0" />
                  <span><strong>Docente / Solicitante:</strong> {reservaDetalle.solicitanteNombre}</span>
                </div>
                <div className="flex items-center gap-2 text-ink-muted">
                  <Calendar className="w-4 h-4 text-primary shrink-0" />
                  <span><strong>Fecha Programada:</strong> {reservaDetalle.fecha}</span>
                </div>
                <div className="flex items-center gap-2 text-ink-muted">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span><strong>Horario Asignado:</strong> {reservaDetalle.horaInicio} a {reservaDetalle.horaFin}</span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-3xs font-extrabold uppercase tracking-widest text-ink-muted block mb-1">
                Justificación Académica e Institucional:
              </span>
              <p className="p-3.5 bg-canvas rounded-xl border border-line text-xs sm:text-sm text-ink leading-relaxed">
                {reservaDetalle.motivo}
              </p>
            </div>
          </div>
        )}
      </ModalWrapper>

      {/* Modal de Confirmación para Aprobar / Rechazar */}
      <ConfirmModal
        isOpen={modalConfirmacion.abierto}
        onClose={() => setModalConfirmacion((prev) => ({ ...prev, abierto: false }))}
        onConfirm={handleEjecutarAccion}
        loading={procesando}
        title={
          modalConfirmacion.accion === 'aprobar'
            ? '¿Aprobar solicitud de reserva?'
            : '¿Rechazar solicitud de reserva?'
        }
        subtitle={`Ambiente: ${modalConfirmacion.ambienteNombre}. Esta acción notificará al solicitante y actualizará la disponibilidad horaria institucional.`}
        confirmText={
          modalConfirmacion.accion === 'aprobar'
            ? 'Aprobar Reserva'
            : 'Rechazar Reserva'
        }
        confirmVariant={modalConfirmacion.accion === 'aprobar' ? 'primary' : 'danger'}
      />
    </PageContainer>
  );
};

export default ReservasPage;
