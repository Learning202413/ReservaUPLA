import React, { useEffect, useState } from 'react';
import { Button, FormMessage, InputField, ModalWrapper, StatusBadge } from '../components/ui';
import { api } from '../services/api';
import { Usuario } from '../types';
import { Users, Plus, ShieldCheck, UserCheck } from 'lucide-react';

export const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalAbierto, setModalAbierto] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-ink tracking-tight">
            Gestión de Usuarios Solicitantes (RF-01)
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
            Padrón de docentes, directores y personal con acceso para reservar ambientes.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setModalAbierto(true)}
          className="self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Registrar Solicitante</span>
        </Button>
      </div>

      {message && (
        <FormMessage
          type="info"
          message={message}
        />
      )}

      {loading ? (
        <div className="p-16 text-center text-slate-400">Cargando solicitantes...</div>
      ) : (
        <div className="w-full overflow-hidden border border-line rounded-2xl bg-surface shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans">
              <thead>
                <tr className="bg-slate-50 border-b border-line text-xs font-bold text-ink-muted uppercase tracking-wider">
                  <th className="py-3.5 px-4">Nombre y Apellidos</th>
                  <th className="py-3.5 px-4">Correo Institucional</th>
                  <th className="py-3.5 px-4">Rol del Usuario</th>
                  <th className="py-3.5 px-4">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-sm">
                {usuarios.map((u, idx) => (
                  <tr
                    key={u.id}
                    className={`hover:bg-sky-50/40 transition-colors ${
                      idx % 2 === 0 ? 'bg-surface' : 'bg-slate-50/30'
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-sky-100 text-primary font-black text-xs flex items-center justify-center">
                          {u.nombreCompleto.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-ink">{u.nombreCompleto}</p>
                          <p className="text-3xs text-ink-faint">ID: {u.id.substring(0, 8)}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs font-medium text-slate-600">
                        {u.correo}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-2xs font-extrabold rounded-full ${
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
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={u.activo ? 'Activo' : 'Inactivo'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Registro Usuario */}
      <ModalWrapper
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title="Registrar Solicitante (RF-01)"
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
    </div>
  );
};

export default UsuariosPage;
