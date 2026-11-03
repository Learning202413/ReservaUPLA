import React, { useEffect, useState } from 'react';
import { AlertMessage, Button, SelectInput, TableList, TextInput } from '../components/ui';
import { api } from '../services/api';
import { Usuario } from '../types';
import { Users, Plus, ShieldCheck, UserCheck, X } from 'lucide-react';

export const UsuariosView: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalAbierto, setModalAbierto] = useState<boolean>(false);
  const [notificacion, setNotificacion] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State para Nuevo Usuario Solicitante (RF-01)
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
      setNotificacion({ type: 'error', message: 'Nombre y correo son campos obligatorios.' });
      return;
    }

    setGuardando(true);
    try {
      await api.crearUsuario({
        nombreCompleto: nombre.trim(),
        correo: correo.trim().toLowerCase(),
        rol: rol as any,
      });
      setNotificacion({ type: 'success', message: 'Usuario registrado exitosamente.' });
      setModalAbierto(false);
      setNombre('');
      setCorreo('');
      await cargar();
    } catch {
      setNotificacion({ type: 'error', message: 'Error al registrar usuario.' });
    } finally {
      setGuardando(false);
    }
  };

  const columns = [
    {
      key: 'nombre',
      header: 'Nombre Completo',
      render: (u: Usuario) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-sky-100 text-[#006699] font-bold text-xs flex items-center justify-center">
            {u.nombreCompleto.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-slate-800">{u.nombreCompleto}</p>
            <p className="text-2xs text-slate-400">ID: {u.id.substring(0, 8)}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'correo',
      header: 'Correo Institucional',
      render: (u: Usuario) => (
        <span className="text-xs font-medium text-slate-600 font-mono">
          {u.correo}
        </span>
      ),
    },
    {
      key: 'rol',
      header: 'Rol en el Sistema',
      render: (u: Usuario) => (
        <span
          className={`inline-flex items-center gap-1.5 text-2xs font-bold px-2.5 py-1 rounded-full ${
            u.rol === 'Administrador'
              ? 'bg-purple-50 text-purple-700 border border-purple-200'
              : u.rol === 'Responsable'
              ? 'bg-sky-50 text-sky-700 border border-sky-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}
        >
          {u.rol === 'Administrador' ? (
            <ShieldCheck className="w-3.5 h-3.5" />
          ) : (
            <UserCheck className="w-3.5 h-3.5" />
          )}
          {u.rol}
        </span>
      ),
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (u: Usuario) => (
        <span className="text-2xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
          {u.activo ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            Gestión de Usuarios y Solicitantes (RF-01)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Docentes, directores y personal con autorización para reservar
          </p>
        </div>
        <Button size="sm" onClick={() => setModalAbierto(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Registrar Solicitante
        </Button>
      </div>

      {notificacion && (
        <AlertMessage
          type={notificacion.type}
          message={notificacion.message}
          onClose={() => setNotificacion(null)}
        />
      )}

      <TableList
        columns={columns}
        data={usuarios}
        keyExtractor={(u) => u.id}
        isLoading={loading}
        emptyMessage="No hay usuarios registrados."
      />

      {/* Modal Registro Usuario (RF-01) */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-100 text-[#006699]">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  Registrar Solicitante (RF-01)
                </h3>
              </div>
              <button onClick={() => setModalAbierto(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCrear} className="space-y-3.5">
              <TextInput
                label="Nombre y Apellidos Completos"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Ing. Rosa Meléndez (Docente)"
                required
              />

              <TextInput
                label="Correo Electrónico Institucional"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="ejemplo@upla.edu.pe"
                required
              />

              <SelectInput
                label="Rol Asignado"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                options={[
                  { value: 'Solicitante', label: 'Solicitante (Docente / Delegado)' },
                  { value: 'Administrador', label: 'Administrador (Aprueba Reservas)' },
                  { value: 'Responsable', label: 'Responsable de Ambiente' },
                ]}
                required
              />

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <Button variant="outline" size="sm" type="button" onClick={() => setModalAbierto(false)}>
                  Cancelar
                </Button>
                <Button size="sm" type="submit" isLoading={guardando}>
                  Guardar Usuario
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
