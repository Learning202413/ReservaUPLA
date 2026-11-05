import React, { useEffect, useState } from 'react';
import {
  Button,
  FilterBar,
  FormMessage,
  InputField,
  ModalWrapper,
  StatusBadge,
  EmptyState,
} from '../components/ui';
import { PageHeader } from '../components/layout/PageHeader';
import { PageContainer } from '../components/layout/PageContainer';
import { api } from '../services/api';
import { Ambiente } from '../types';
import { Plus, Users, MapPin, Building2 } from 'lucide-react';

export const AmbientesPage: React.FC = () => {
  const [ambientes, setAmbientes] = useState<Ambiente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalAbierto, setModalAbierto] = useState<boolean>(false);
  const [busqueda, setBusqueda] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  // Form State
  const [nombre, setNombre] = useState<string>('');
  const [tipo, setTipo] = useState<string>('Laboratorio');
  const [capacidad, setCapacidad] = useState<number>(35);
  const [ubicacion, setUbicacion] = useState<string>('');
  const [estado, setEstado] = useState<string>('Disponible');
  const [guardando, setGuardando] = useState<boolean>(false);

  const cargar = async () => {
    setLoading(true);
    try {
      const data = await api.getAmbientes();
      setAmbientes(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !ubicacion.trim() || capacidad <= 0) {
      setMessage('Complete los campos obligatorios con una capacidad válida mayor a 0.');
      setMessageType('error');
      return;
    }

    setGuardando(true);
    try {
      await api.crearAmbiente({
        nombre: nombre.trim(),
        tipo: tipo as any,
        capacidad: Number(capacidad),
        ubicacion: ubicacion.trim(),
        estado: estado as any,
      });
      setMessage('Ambiente universitario registrado exitosamente.');
      setMessageType('success');
      setModalAbierto(false);
      setNombre('');
      setUbicacion('');
      await cargar();
    } catch {
      setMessage('Error al registrar el ambiente.');
      setMessageType('error');
    } finally {
      setGuardando(false);
    }
  };

  const ambientesFiltrados = ambientes.filter(
    (a) =>
      a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      a.tipo.toLowerCase().includes(busqueda.toLowerCase()) ||
      a.ubicacion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <PageContainer>
      {/* Cabecera Estandarizada con PageHeader */}
      <PageHeader
        title="Catálogo de Ambientes Universitarios"
        subtitle="Aulas magnas, laboratorios de cómputo y auditorios registrados en el campus UPLA."
        count={ambientesFiltrados.length}
        countLabel="ambientes"
        actions={
          <Button
            variant="primary"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setModalAbierto(true)}
          >
            Registrar Ambiente
          </Button>
        }
      />

      {message && (
        <FormMessage
          type={messageType}
          message={message}
        />
      )}

      {/* Barra de Búsqueda */}
      <FilterBar
        searchValue={busqueda}
        onSearchChange={setBusqueda}
        searchPlaceholder="Buscar por nombre, tipo o pabellón..."
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-surface border border-line rounded-2xl p-5 space-y-4 animate-pulse"
            >
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-lg w-1/3" />
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-3/4" />
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-lg w-1/2" />
            </div>
          ))}
        </div>
      ) : ambientesFiltrados.length === 0 ? (
        <EmptyState
          title="No se encontraron ambientes"
          description="No hay espacios físicos registrados que coincidan con la búsqueda."
          actionLabel="Registrar nuevo ambiente"
          onAction={() => setModalAbierto(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ambientesFiltrados.map((amb) => (
            <div
              key={amb.id}
              className="bg-surface border border-line rounded-2xl p-5 shadow-2xs hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xs font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/70 text-[#006699] dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                    {amb.tipo}
                  </span>
                  <StatusBadge status={amb.estado} />
                </div>

                <h3 className="text-base font-black text-ink">{amb.nombre}</h3>

                <div className="mt-3.5 space-y-2 text-xs text-ink-muted">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary dark:text-sky-400 shrink-0" />
                    <span>{amb.ubicacion}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary dark:text-sky-400 shrink-0" />
                    <span>
                      Capacidad: <strong className="text-ink">{amb.capacidad} estudiantes</strong>
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-line flex items-center justify-between text-2xs text-ink-faint">
                <span>ID: {amb.id.substring(0, 8)}</span>
                <span className="text-primary dark:text-sky-400 font-bold">Habilitado</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Registro Ambiente */}
      <ModalWrapper
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title="Registrar Nuevo Ambiente"
        subtitle="Agregue aulas, laboratorios o auditorios al catálogo UPLA"
        icon={Building2}
      >
        <form onSubmit={handleCrear} className="space-y-3.5">
          <InputField
            label="Nombre del Ambiente"
            name="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Laboratorio de IA - Pabellón C"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="select-tipo-espacio" className="form-label-standard">
                Tipo de Espacio <span className="text-red-500">*</span>
              </label>
              <select
                id="select-tipo-espacio"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="form-input-standard"
                required
              >
                <option value="Laboratorio">Laboratorio</option>
                <option value="Auditorio">Auditorio</option>
                <option value="Sala">Sala de Sesiones</option>
                <option value="Taller">Taller Especializado</option>
              </select>
            </div>

            <InputField
              label="Aforo (Capacidad)"
              name="capacidad"
              type="number"
              min="1"
              value={String(capacidad)}
              onChange={(e) => setCapacidad(Number(e.target.value))}
              required
            />
          </div>

          <InputField
            label="Ubicación Física"
            name="ubicacion"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            placeholder="Ej. Pabellón B - Piso 2"
            required
          />

          <div>
            <label htmlFor="select-estado-operativo" className="form-label-standard">
              Estado Operativo <span className="text-red-500">*</span>
            </label>
            <select
              id="select-estado-operativo"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="form-input-standard"
              required
            >
              <option value="Disponible">Disponible</option>
              <option value="Mantenimiento">Mantenimiento</option>
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
              Guardar Ambiente
            </Button>
          </div>
        </form>
      </ModalWrapper>
    </PageContainer>
  );
};

export default AmbientesPage;
