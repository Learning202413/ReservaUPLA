import React from 'react';
import { UserCheck, Shield } from 'lucide-react';

interface HeaderProps {
  rolActual: string;
  onCambiarRol: (rol: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ rolActual, onCambiarRol }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-3.5 shadow-2xs">
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
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Sistema de Gestión de Ambientes Universitarios
            </p>
          </div>
        </div>

        {/* Selector de Rol para Evaluación / Docente */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            {rolActual === 'Administrador' ? (
              <Shield className="w-4 h-4 text-[#006699]" />
            ) : (
              <UserCheck className="w-4 h-4 text-emerald-600" />
            )}
            <span className="text-slate-600 font-medium">Modo Evaluación:</span>
            <select
              value={rolActual}
              onChange={(e) => onCambiarRol(e.target.value)}
              className="font-bold text-slate-800 bg-transparent border-none focus:outline-none cursor-pointer"
            >
              <option value="Administrador">Administrador (Puede Aprobar/Rechazar)</option>
              <option value="Solicitante">Solicitante (Solo Registrar/Ver)</option>
              <option value="Responsable">Responsable de Ambiente</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
