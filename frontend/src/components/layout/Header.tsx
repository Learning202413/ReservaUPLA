import React from 'react';
import { Usuario } from '../../types';
import { Shield, UserCheck, Building, LogOut } from 'lucide-react';

interface HeaderProps {
  usuarioActual: Usuario;
  onLogout: () => void;
  onCambiarRol?: (rol: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ usuarioActual, onLogout, onCambiarRol }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-3 shadow-2xs">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo Institucional UPLA */}
        <div className="flex items-center gap-4">
          <img
            src="/upla_logo.png"
            alt="Universidad Peruana Los Andes"
            className="h-10 w-auto object-contain"
          />
          <div className="hidden sm:block border-l border-slate-200 pl-4">
            <h1 className="text-base font-black text-[#006699] tracking-tight leading-none">
              ReservaUPLA
            </h1>
            <p className="text-2xs text-slate-500 font-medium mt-0.5">
              Sistema de Gestión de Ambientes Universitarios
            </p>
          </div>
        </div>

        {/* Información del Usuario Autenticado y Salida */}
        <div className="flex items-center gap-4">
          {/* Badge del Usuario y Rol */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-2xl">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
              usuarioActual.rol === 'Administrador'
                ? 'bg-purple-100 text-purple-700'
                : usuarioActual.rol === 'Responsable'
                ? 'bg-sky-100 text-[#006699]'
                : 'bg-emerald-100 text-emerald-700'
            }`}>
              {usuarioActual.rol === 'Administrador' ? (
                <Shield className="w-4 h-4" />
              ) : usuarioActual.rol === 'Responsable' ? (
                <Building className="w-4 h-4" />
              ) : (
                <UserCheck className="w-4 h-4" />
              )}
            </div>

            <div className="text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {usuarioActual.nombreCompleto}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-3xs font-extrabold uppercase px-1.5 py-0.2 rounded-md ${
                  usuarioActual.rol === 'Administrador'
                    ? 'bg-purple-100 text-purple-700'
                    : usuarioActual.rol === 'Responsable'
                    ? 'bg-sky-100 text-[#006699]'
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {usuarioActual.rol}
                </span>
                <span className="text-3xs text-slate-400 hidden md:inline">
                  {usuarioActual.correo}
                </span>
              </div>
            </div>

            {/* Selector rápido de rol (útil durante la sustentación en vivo) */}
            {onCambiarRol && (
              <select
                value={usuarioActual.rol}
                onChange={(e) => onCambiarRol(e.target.value)}
                className="ml-2 text-2xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                title="Cambiar rol en caliente para prueba"
              >
                <option value="Administrador">Admin</option>
                <option value="Solicitante">Docente</option>
                <option value="Responsable">Encargado</option>
              </select>
            )}
          </div>

          {/* Botón Cerrar Sesión (Shneiderman Regla #7: Locus interno de control) */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-xl transition-all cursor-pointer shadow-2xs"
            title="Cerrar sesión actual"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
};
