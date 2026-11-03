import React, { useEffect, useState } from 'react';
import { Button, FilterBar, FormMessage, InputField, ModalWrapper, StatusBadge } from '../components/ui';
import { api } from '../services/api';
import { Ambiente } from '../types';
import { Plus, Users, MapPin, Building2 } from 'lucide-react';

export const AmbientesPage: React.FC = () => {
  const [ambientes, setAmbientes] = useState<Ambiente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalAbierto, setModalAbierto] = useState<boolean>(false);
  const [busqueda, setBusqueda] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);

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
      setModalAbierto(false);
      setNombre('');
      setUbicacion('');
      await cargar();
    } catch {
      setMessage('Error al registrar el ambiente.');
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-ink tracking-tight">
            Catálogo de Ambientes Universitarios (RF-02)
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
            Aulas magnas, laboratorios de cómputo y auditorios registrados en el campus UPLA.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setModalAbierto(true)}
          className="self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Registrar Ambiente</span>
        </Button>
      </div>

      {message && (
        <FormMessage
          type="info"
          message={message}
        />
      )}

      <FilterBar
        searchValue={busqueda}
        onSearchChange={setBusqueda}
        searchPlaceholder="Buscar por nombre, tipo o pabellón..."
      />

      {loading ? (
        <div className="p-16 text-center text-slate-400">Cargando catálogo...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ambientesFiltrados.map((amb) => (
            <div
              key={amb.id}
              className="bg-surface border border-line-strong rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xs font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-sky-50 text-primary border border-sky-200">
                    {amb.tipo}
                  </span>
                  <StatusBadge status={amb.estado} />
                </div>

                <h3 className="text-base font-bold text-ink">{amb.nombre}</h3>

                <div className="mt-3.5 space-y-2 text-xs text-ink-muted">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{amb.ubicacion}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Capacidad: <strong className="text-ink">{amb.capacidad} estudiantes</strong></span>
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-line flex items-center justify-between text-2xs text-ink-faint">
                <span>ID: {amb.id.substring(0, 8)}</span>
                <span className="text-primary font-bold">Habilitado</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Registro Ambiente con ModalWrapper de GirasolesRes */}
      <ModalWrapper
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title="Registrar Nuevo Ambiente (RF-02)"
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
              <label className="form-label-standard">
                Tipo de Espacio <span className="text-red-500">*</span>
              </label>
              <select
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
            <label className="form-label-standard">
              Estado Operativo <span className="text-red-500">*</span>
            </label>
            <select
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
    </div>
  );
};

export default AmbientesPage;
