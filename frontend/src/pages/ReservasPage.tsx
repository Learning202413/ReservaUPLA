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
import { RechazarReservaModal } from '../components/reservas/RechazarReservaModal';
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
  Ban,
  AlertTriangle,
  Info,
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

  // Modal para Aprobación (Admin)
  const [modalAprobar, setModalAprobar] = useState<{
    abierto: boolean;
    reservaId: string;
    ambienteNombre: string;
  }>({
    abierto: false,
    reservaId: '',
    ambienteNombre: '',
  });

  // Modal para Rechazo con justificación (Admin)
  const [modalRechazar, setModalRechazar] = useState<{
    abierto: boolean;
    reservaId: string;
    ambienteNombre: string;
  }>({
    abierto: false,
    reservaId: '',
    ambienteNombre: '',
  });

  // Modal para Cancelar solicitud por el usuario solicitante
  const [modalCancelar, setModalCancelar] = useState<{
    abierto: boolean;
    reservaId: string;
    ambienteNombre: string;
  }>({
    abierto: false,
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

  // Atajo de teclado global: '/' enfoca el buscador (Nielsen H7 / Shneiderman Aceleradores)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (input) input.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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

  // Acciones de administración
  const handleConfirmarAprobar = async () => {
    setProcesando(true);
    try {
      await api.cambiarEstadoReserva(modalAprobar.reservaId, 'Aprobada', 'Administrador');
      await cargarReservas();
      setModalAprobar((prev) => ({ ...prev, abierto: false }));
    } catch (err) {
      console.error('Error al aprobar reserva:', err);
    } finally {
      setProcesando(false);
    }
  };

  const handleConfirmarRechazar = async (motivo: string) => {
    setProcesando(true);
    try {
      await api.cambiarEstadoReserva(
        modalRechazar.reservaId,
        'Rechazada',
        'Administrador',
        motivo
      );
      await cargarReservas();
      setModalRechazar((prev) => ({ ...prev, abierto: false }));
    } catch (err) {
      console.error('Error al rechazar reserva:', err);
    } finally {
      setProcesando(false);
    }
  };

  // Acción de cancelación por parte del solicitante (Locus de control / Puente de Ejecución)
  const handleConfirmarCancelar = async () => {
    setProcesando(true);
    try {
      await api.cambiarEstadoReserva(
        modalCancelar.reservaId,
        'Cancelada',
        usuario?.rol || 'Docente'
      );
      await cargarReservas();
      setModalCancelar((prev) => ({ ...prev, abierto: false }));
    } catch (err) {
      console.error('Error al cancelar reserva:', err);
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
        searchPlaceholder="Buscar por ambiente, solicitante o motivo (Presione '/' para enfocar)..."
      >
        <div className="flex items-center gap-1.5">
          {['todos', 'Pendiente', 'Aprobada', 'Rechazada', 'Cancelada'].map((estado) => {
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

                  {/* Acciones de Administrador */}
                  {esAdmin && r.estado === 'Pendiente' && (
                    <>
                      <ActionButton
                        size="sm"
                        variant="secondary"
                        icon={CheckCircle}
                        onClick={() =>
                          setModalAprobar({
                            abierto: true,
                            reservaId: r.id,
                            ambienteNombre: r.ambienteNombre,
                          })
                        }
                        className="text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60"
                        title="Aprobar solicitud de reserva"
                      >
                        Aprobar
                      </ActionButton>

                      <ActionButton
                        size="sm"
                        variant="danger"
                        icon={XCircle}
                        onClick={() =>
                          setModalRechazar({
                            abierto: true,
                            reservaId: r.id,
                            ambienteNombre: r.ambienteNombre,
                          })
                        }
                        title="Rechazar solicitud con motivo detallado"
                      >
                        Rechazar
                      </ActionButton>
                    </>
                  )}

                  {/* Acción de Solicitante: Cancelar propia solicitud (Puente de Ejecución / Control de Usuario) */}
                  {!esAdmin && r.estado === 'Pendiente' && (
                    <ActionButton
                      size="sm"
                      variant="danger"
                      icon={Ban}
                      onClick={() =>
                        setModalCancelar({
                          abierto: true,
                          reservaId: r.id,
                          ambienteNombre: r.ambienteNombre,
                        })
                      }
                      title="Cancelar mi solicitud de reserva"
                    >
                      Cancelar
                    </ActionButton>
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
          <div className="space-y-4 text-left font-sans">
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
                  <span>
                    <strong>Docente / Solicitante:</strong> {reservaDetalle.solicitanteNombre}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-ink-muted">
                  <Calendar className="w-4 h-4 text-primary shrink-0" />
                  <span>
                    <strong>Fecha Programada:</strong> {reservaDetalle.fecha}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-ink-muted">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span>
                    <strong>Horario Asignado:</strong> {reservaDetalle.horaInicio} a{' '}
                    {reservaDetalle.horaFin}
                  </span>
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

            {/* Muestra del Motivo de Rechazo (Puente de Evaluación - Donald Norman) */}
            {reservaDetalle.estado === 'Rechazada' && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200 text-xs space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-rose-800 dark:text-rose-300">
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  Motivo Oficial del Dictamen Administrativo:
                </span>
                <p className="leading-relaxed pl-5 font-medium">
                  {reservaDetalle.motivoRechazo ||
                    'La solicitud no cumplió con las políticas de disponibilidad o prelación académica de la facultad.'}
                </p>
              </div>
            )}

            {reservaDetalle.estado === 'Cancelada' && (
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-ink-muted text-xs flex items-center gap-2">
                <Info className="w-4 h-4 text-ink-muted shrink-0" />
                <span>Esta solicitud fue cancelada por el usuario solicitante antes de su dictamen.</span>
              </div>
            )}
          </div>
        )}
      </ModalWrapper>

      {/* Modal de Confirmación para Aprobar */}
      <ConfirmModal
        isOpen={modalAprobar.abierto}
        onClose={() => setModalAprobar((prev) => ({ ...prev, abierto: false }))}
        onConfirm={handleConfirmarAprobar}
        loading={procesando}
        title="¿Aprobar solicitud de reserva?"
        subtitle={`Ambiente: ${modalAprobar.ambienteNombre}. Esta acción formalizará el turno y lo reflejará en el cronograma oficial.`}
        confirmText="Aprobar Reserva"
        confirmVariant="primary"
      />

      {/* Modal con Motivo Detallado para Rechazar (Norman - Feedback & Shneiderman) */}
      <RechazarReservaModal
        isOpen={modalRechazar.abierto}
        ambienteNombre={modalRechazar.ambienteNombre}
        loading={procesando}
        onClose={() => setModalRechazar((prev) => ({ ...prev, abierto: false }))}
        onConfirm={handleConfirmarRechazar}
      />

      {/* Modal de Confirmación para Cancelar Solicitud (Locus de Control) */}
      <ConfirmModal
        isOpen={modalCancelar.abierto}
        onClose={() => setModalCancelar((prev) => ({ ...prev, abierto: false }))}
        onConfirm={handleConfirmarCancelar}
        loading={procesando}
        title="¿Cancelar su solicitud de reserva?"
        subtitle={`Ambiente: ${modalCancelar.ambienteNombre}. La solicitud será anulada inmediatamente y el turno quedará libre para otros docentes.`}
        confirmText="Sí, Cancelar Solicitud"
        confirmVariant="danger"
      />
    </PageContainer>
  );
};

export default ReservasPage;
