import React, { useEffect, useState } from 'react';
import { AlertMessage, Button, SelectInput, TextInput } from '../components/ui';
import { api } from '../services/api';
import { Ambiente } from '../types';
import { Building2, Plus, Users, MapPin, CheckCircle2, Wrench, X } from 'lucide-react';

export const AmbientesView: React.FC = () => {
  const [ambientes, setAmbientes] = useState<Ambiente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalAbierto, setModalAbierto] = useState<boolean>(false);
  const [notificacion, setNotificacion] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State para Nuevo Ambiente (RF-02)
  const [nombre, setNombre] = useState<string>('');
  const [tipo, setTipo] = useState<string>('Laboratorio');
  const [capacidad, setCapacidad] = useState<number>(30);
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
      setNotificacion({ type: 'error', message: 'Complete todos los campos requeridos con una capacidad válida.' });
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
      setNotificacion({ type: 'success', message: 'Nuevo ambiente universitario registrado correctamente.' });
      setModalAbierto(false);
      setNombre('');
      setUbicacion('');
      await cargar();
    } catch {
      setNotificacion({ type: 'error', message: 'Error al registrar el ambiente.' });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            Catálogo de Ambientes Universitarios (RF-02)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Laboratorios, auditorios y salas institucionales de la UPLA
          </p>
        </div>
        <Button size="sm" onClick={() => setModalAbierto(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Registrar Ambiente
        </Button>
      </div>

      {notificacion && (
        <AlertMessage
          type={notificacion.type}
          message={notificacion.message}
          onClose={() => setNotificacion(null)}
        />
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Cargando catálogo de ambientes...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ambientes.map((amb) => (
            <div
              key={amb.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-sky-50 text-[#006699] border border-sky-200">
                    {amb.tipo}
                  </span>
                  <span
                    className={`flex items-center gap-1 text-2xs font-bold px-2 py-0.5 rounded-full ${
                      amb.estado === 'Disponible'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {amb.estado === 'Disponible' ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Wrench className="w-3 h-3 text-amber-600" />
                    )}
                    {amb.estado}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800">{amb.nombre}</h3>
                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{amb.ubicacion}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Aforo: <strong>{amb.capacidad} estudiantes / docentes</strong></span>
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-400">
                <span>Código: {amb.id.substring(0, 8)}</span>
                <span className="text-[#006699] font-semibold">Listo para reserva</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Registro de Ambiente (RF-02) */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-100 text-[#006699]">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  Registrar Ambiente Universitario
                </h3>
              </div>
              <button onClick={() => setModalAbierto(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCrear} className="space-y-3.5">
              <TextInput
                label="Nombre del Ambiente"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Laboratorio de IA - Pabellón C"
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <SelectInput
                  label="Tipo de Espacio"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  options={[
                    { value: 'Laboratorio', label: 'Laboratorio' },
                    { value: 'Auditorio', label: 'Auditorio' },
                    { value: 'Sala', label: 'Sala de Sesiones' },
                    { value: 'Taller', label: 'Taller Especializado' },
                  ]}
                  required
                />
                <TextInput
                  label="Aforo (Capacidad)"
                  type="number"
                  min="1"
                  value={capacidad}
                  onChange={(e) => setCapacidad(Number(e.target.value))}
                  required
                />
              </div>

              <TextInput
                label="Ubicación Física"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                placeholder="Ej. Pabellón B - Piso 2"
                required
              />

              <SelectInput
                label="Estado Operativo"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                options={[
                  { value: 'Disponible', label: 'Disponible' },
                  { value: 'Mantenimiento', label: 'Mantenimiento' },
                ]}
                required
              />

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <Button variant="outline" size="sm" type="button" onClick={() => setModalAbierto(false)}>
                  Cancelar
                </Button>
                <Button size="sm" type="submit" isLoading={guardando}>
                  Guardar Ambiente
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
