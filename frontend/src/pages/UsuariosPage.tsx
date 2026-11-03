import React, { useEffect, useState } from 'react';
import {
  Button,
  FormMessage,
  InputField,
  ModalWrapper,
  StatusBadge,
  FilterBar,
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
import { Usuario } from '../types';
import { Users, Plus, ShieldCheck, UserCheck } from 'lucide-react';

export const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalAbierto, setModalAbierto] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState<string>('');
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const itemsPorPagina = 8;

  // Form State
  const [nombre, setNombre] = useState<string>('');
  const [correo, setCorreo] = useState<string>('');
  const [rol, setRol] = useState<string>('Solicitante');
  const [guardando, setGuardando] = useState<boolean>(false);

  const cargar = async () => {
    setLoading(true);
    try {
      const data = await api.getUsuarios();
      setUsuarios(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !correo.trim()) {
      setMessage('El nombre y el correo institucional son campos obligatorios.');
      return;
    }

    setGuardando(true);
    try {
      await api.crearUsuario({
        nombreCompleto: nombre.trim(),
        correo: correo.trim().toLowerCase(),
        rol: rol as any,
      });
      setMessage('Usuario solicitante registrado exitosamente en el sistema.');
      setModalAbierto(false);
      setNombre('');
      setCorreo('');
      await cargar();
    } catch {
      setMessage('Error al registrar usuario.');
    } finally {
      setGuardando(false);
    }
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const q = busqueda.toLowerCase();
    return (
      u.nombreCompleto.toLowerCase().includes(q) ||
      u.correo.toLowerCase().includes(q) ||
      u.rol.toLowerCase().includes(q)
    );
  });

  const totalItems = usuariosFiltrados.length;
  const totalPages = Math.ceil(totalItems / itemsPorPagina);
  const usuariosPaginados = usuariosFiltrados.slice(
    (paginaActual - 1) * itemsPorPagina,
    paginaActual * itemsPorPagina
  );

  return (
    <PageContainer>
      {/* Cabecera Estandarizada con PageHeader */}
      <PageHeader
        title="Padrón de Solicitantes y Usuarios"
        subtitle="Gestión de docentes, directores y personal autorizado para requerir ambientes."
        count={usuariosFiltrados.length}
        countLabel="usuarios"
        actions={
          <Button
            variant="primary"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setModalAbierto(true)}
          >
            Registrar Solicitante
          </Button>
        }
      />

      {message && (
        <FormMessage
          type="info"
          message={message}
        />
      )}

      {/* Barra de Filtros y Búsqueda */}
      <FilterBar
        searchValue={busqueda}
        onSearchChange={(val) => {
          setBusqueda(val);
          setPaginaActual(1);
        }}
        searchPlaceholder="Buscar por nombre, correo o rol..."
      />

      {/* Tabla con DataTable */}
      <DataTable
        loading={loading}
        isEmpty={usuariosFiltrados.length === 0}
        emptyTitle="No hay usuarios registrados"
        emptyMessage="No se encontraron usuarios que coincidan con la búsqueda."
      >
        <TableHead>
          <tr>
            <TableHeaderCell>Nombre y Apellidos</TableHeaderCell>
            <TableHeaderCell>Correo Institucional</TableHeaderCell>
            <TableHeaderCell>Rol del Usuario</TableHeaderCell>
            <TableHeaderCell align="right">Estado</TableHeaderCell>
          </tr>
        </TableHead>

        <TableBody>
          {usuariosPaginados.map((u) => (
            <TableRow key={u.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-950/80 text-primary dark:text-sky-300 font-black text-xs flex items-center justify-center border border-sky-200 dark:border-sky-800">
                    {u.nombreCompleto.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-ink">{u.nombreCompleto}</p>
                    <p className="text-3xs text-ink-faint">ID: {u.id.substring(0, 8)}</p>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <span className="font-mono text-xs font-medium text-ink-muted">
                  {u.correo}
                </span>
              </TableCell>

              <TableCell>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-2xs font-bold rounded-full border ${
                    u.rol === 'Administrador'
                      ? 'bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                      : u.rol === 'Responsable'
                      ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800'
                      : 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  }`}
                >
                  {u.rol === 'Administrador' ? (
                    <ShieldCheck className="w-3.5 h-3.5" />
                  ) : (
                    <UserCheck className="w-3.5 h-3.5" />
                  )}
                  {u.rol}
                </span>
              </TableCell>

              <TableCell align="right">
                <StatusBadge status={u.activo ? 'Activo' : 'Inactivo'} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </DataTable>

      {/* Paginación */}
      <TablePagination
        currentPage={paginaActual}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPorPagina}
        entityName="usuarios"
        onPageChange={(pag) => setPaginaActual(pag)}
      />

      {/* Modal Registro Usuario */}
      <ModalWrapper
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title="Registrar Solicitante"
        subtitle="Alta de nuevo usuario para el sistema ReservaUPLA"
        icon={Users}
      >
        <form onSubmit={handleCrear} className="space-y-3.5">
          <InputField
            label="Nombres y Apellidos Completos"
            name="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Ing. Rosa Meléndez (Docente)"
            required
          />

          <InputField
            label="Correo Electrónico Institucional"
            name="correo"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="docente@upla.edu.pe"
            required
          />

          <div>
            <label className="form-label-standard">
              Rol Asignado en el Sistema <span className="text-red-500">*</span>
            </label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="form-input-standard"
              required
            >
              <option value="Solicitante">Solicitante (Docente / Delegado)</option>
              <option value="Administrador">Administrador (Aprueba/Rechaza)</option>
              <option value="Responsable">Responsable de Ambiente</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-line">
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={() => setModalAbierto(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              isSubmitting={guardando}
              submittingText="Guardando..."
            >
              Guardar Solicitante
            </Button>
          </div>
        </form>
      </ModalWrapper>
    </PageContainer>
  );
};

export default UsuariosPage;
