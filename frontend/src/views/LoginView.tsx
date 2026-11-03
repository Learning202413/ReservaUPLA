import React, { useState } from 'react';
import { AlertMessage, Button } from '../components/ui';
import { api } from '../services/api';
import { Usuario } from '../types';
import { Shield, UserCheck, Eye, EyeOff, Lock, Mail, Building, KeyRound, Sparkles } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (usuario: Usuario) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [correo, setCorreo] = useState<string>('admin@upla.edu.pe');
  const [clave, setClave] = useState<string>('admin123');
  const [mostrarClave, setMostrarClave] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Heurística de Nielsen #5: Prevención de errores
    if (!correo.trim() || !clave.trim()) {
      setErrorMsg('Por favor ingrese su correo institucional y contraseña.');
      return;
    }

    if (!correo.includes('@')) {
      setErrorMsg('El formato del correo institucional no es válido.');
      return;
    }

    setLoading(true);
    try {
      const usuario = await api.login(correo.trim(), clave.trim());
      onLoginSuccess(usuario);
    } catch (err: any) {
      // Heurística de Nielsen #9: Ayuda a reconocer, diagnosticar y recuperarse de errores
      setErrorMsg(err.message || 'No se pudo iniciar sesión. Verifique sus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  // Regla de Oro de Shneiderman #2: Facilitar atajos para usuarios y evaluadores
  const seleccionarAtajoRol = (rol: 'Administrador' | 'Solicitante' | 'Responsable') => {
    setErrorMsg(null);
    if (rol === 'Administrador') {
      setCorreo('admin@upla.edu.pe');
      setClave('admin123');
    } else if (rol === 'Solicitante') {
      setCorreo('cmendoza@upla.edu.pe');
      setClave('docente123');
    } else {
      setCorreo('mquispe@upla.edu.pe');
      setClave('responsable123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#004C73] to-[#006699] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/40">
        
        {/* Panel Izquierdo: Branding UPLA y Principios de Diseño */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#006699] to-[#004466] text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

          <div>
            {/* Logo de la Universidad Peruana Los Andes */}
            <div className="bg-white p-3.5 rounded-2xl shadow-sm inline-block mb-6">
              <img
                src="/upla_logo.png"
                alt="Universidad Peruana Los Andes"
                className="h-10 w-auto object-contain"
              />
            </div>

            <span className="text-2xs font-bold uppercase tracking-widest text-sky-200 bg-sky-900/50 px-2.5 py-1 rounded-full border border-sky-400/30">
              Construcción de Software
            </span>

            <h1 className="text-2xl font-black mt-3 leading-tight tracking-tight">
              ReservaUPLA
            </h1>
            <p className="text-xs text-sky-100/90 mt-1.5 leading-relaxed">
              Sistema Integral de Gestión y Control de Disponibilidad de Ambientes Universitarios.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-sky-400/20 space-y-3 text-xs text-sky-100/80">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-sky-300 shrink-0 mt-0.5" />
              <p>Diseño centrado en el usuario con las <strong>10 Heurísticas de Nielsen</strong> y <strong>Reglas de Shneiderman</strong>.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <Building className="w-4 h-4 text-sky-300 shrink-0 mt-0.5" />
              <p>Control de solapamiento en tiempo real para laboratorios, auditorios y salas.</p>
            </div>
          </div>

          <div className="mt-6 text-2xs text-sky-300/70 font-mono">
            UPLA 2026-II | Semanas 01 - 09
          </div>
        </div>

        {/* Panel Derecho: Formulario de Autenticación */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                Iniciar Sesión
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Ingrese sus credenciales institucionales para acceder según su rol.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5">
                <AlertMessage
                  type="error"
                  message={errorMsg}
                  onClose={() => setErrorMsg(null)}
                />
              </div>
            )}

            {/* Atajos de Rol para Evaluación (Shneiderman Regla #2) */}
            <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#006699]" />
                  Acceso Rápido para Evaluación
                </span>
                <span className="text-3xs bg-sky-100 text-[#006699] font-semibold px-2 py-0.5 rounded-full">
                  1-Clic
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => seleccionarAtajoRol('Administrador')}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    correo === 'admin@upla.edu.pe'
                      ? 'border-[#006699] bg-sky-50/70 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center gap-1 text-slate-800 font-bold text-xs">
                    <Shield className="w-3.5 h-3.5 text-[#006699]" />
                    <span>Admin</span>
                  </div>
                  <p className="text-3xs text-slate-400 truncate mt-0.5">Aprueba/Rechaza</p>
                </button>

                <button
                  type="button"
                  onClick={() => seleccionarAtajoRol('Solicitante')}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    correo === 'cmendoza@upla.edu.pe'
                      ? 'border-[#006699] bg-sky-50/70 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center gap-1 text-slate-800 font-bold text-xs">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Docente</span>
                  </div>
                  <p className="text-3xs text-slate-400 truncate mt-0.5">Solicita Aulas</p>
                </button>

                <button
                  type="button"
                  onClick={() => seleccionarAtajoRol('Responsable')}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    correo === 'mquispe@upla.edu.pe'
                      ? 'border-[#006699] bg-sky-50/70 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center gap-1 text-slate-800 font-bold text-xs">
                    <Building className="w-3.5 h-3.5 text-amber-600" />
                    <span>Encargado</span>
                  </div>
                  <p className="text-3xs text-slate-400 truncate mt-0.5">Consulta Uso</p>
                </button>
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Correo Institucional UPLA <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="usuario@upla.edu.pe"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#006699]/20 focus:border-[#006699] transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Contraseña <span className="text-red-500">*</span>
                  </label>
                  <span className="text-2xs text-slate-400">Mínimo 4 caracteres</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={mostrarClave ? 'text' : 'password'}
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#006699]/20 focus:border-[#006699] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarClave(!mostrarClave)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    aria-label="Alternar visibilidad de contraseña"
                  >
                    {mostrarClave ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full shadow-md py-3 text-sm font-bold"
                  isLoading={loading}
                >
                  Acceder al Sistema ReservaUPLA
                </Button>
              </div>
            </form>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-400">
            <span>Universidad Peruana Los Andes</span>
            <span className="text-[#006699] font-semibold">Seguridad y Trazabilidad</span>
          </div>
        </div>

      </div>
    </div>
  );
};
