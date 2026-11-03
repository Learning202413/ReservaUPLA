import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Menu, ChevronDown, Hand } from 'lucide-react';
import { Usuario } from '../../types';
import { useHandedness } from '../../hooks/useHandedness';

interface HeaderProps {
  usuario?: Usuario | null;
  onLogout: () => void;
  onCambiarRol?: (rol: string) => void;
  breadcrumbSection?: string;
  breadcrumbPage?: string;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  usuario,
  onLogout,
  onCambiarRol,
  breadcrumbSection = 'Sistema',
  breadcrumbPage = 'Dashboard',
  onToggleSidebar,
}) => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isLeftHanded, toggleHandedness } = useHandedness();

  // Cerrar menú al hacer clic afuera
  useEffect(() => {
    if (!menuAbierto) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuAbierto(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuAbierto]);

  const iniciales = usuario?.nombreCompleto
    ? usuario.nombreCompleto
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <header className="bg-surface border-b border-line sticky top-0 z-30 px-4 sm:px-6 py-2.5 shadow-2xs font-sans">
      <div className="flex items-center justify-between w-full">
        {/* Lado izquierdo: Botón menú móvil + Migas de pan (Breadcrumbs) */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="text-ink-muted font-medium hidden sm:inline">
              {breadcrumbSection}
            </span>
            <span className="text-ink-faint hidden sm:inline">/</span>
            <span className="text-ink font-bold font-sans">
              {breadcrumbPage}
            </span>
          </div>
        </div>

        {/* Lado derecho: Menú de Perfil de Usuario con Dropdown accesible */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="flex items-center gap-3 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-line focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-expanded={menuAbierto}
            aria-haspopup="true"
          >
            <div className="w-8 h-8 rounded-full bg-[#006699] text-white flex items-center justify-center font-black text-xs shadow-2xs">
              {iniciales}
            </div>

            <div className="text-left hidden md:block">
              <p className="text-xs font-bold text-ink leading-tight">
                {usuario?.nombreCompleto || 'Usuario'}
              </p>
              <p className="text-3xs text-ink-muted font-semibold mt-0.5">
                {usuario?.rol || 'Solicitante'}
              </p>
            </div>

            <ChevronDown className={`w-3.5 h-3.5 text-ink-muted transition-transform duration-200 hidden sm:block ${menuAbierto ? 'rotate-180' : ''}`} />
          </button>

          {/* Menú Desplegable */}
          {menuAbierto && (
            <div
              className="absolute right-0 mt-2 w-72 bg-surface rounded-2xl border border-line-strong shadow-xl py-2 z-50 animate-in fade-in duration-150"
              role="menu"
            >
              <div className="px-4 py-3 border-b border-line">
                <p className="text-xs font-bold text-ink truncate">
                  {usuario?.nombreCompleto}
                </p>
                <p className="text-2xs text-ink-muted truncate mt-0.5">
                  {usuario?.correo}
                </p>
                <span className="inline-block mt-2 text-3xs font-extrabold uppercase px-2 py-0.5 rounded-md bg-sky-50 text-primary border border-sky-200">
                  Rol: {usuario?.rol}
                </span>
              </div>

              {/* Selector de Rol en Caliente para Sustentación */}
              {onCambiarRol && (
                <div className="px-4 py-2.5 border-b border-line bg-slate-50/50">
                  <label className="block text-3xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                    Cambio de Rol en Caliente (Sustentación):
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        onCambiarRol('Administrador');
                        setMenuAbierto(false);
                      }}
                      className={`px-2 py-1 rounded-lg text-3xs font-bold border transition-colors cursor-pointer ${
                        usuario?.rol === 'Administrador'
                          ? 'bg-[#006699] text-white border-[#006699]'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onCambiarRol('Solicitante');
                        setMenuAbierto(false);
                      }}
                      className={`px-2 py-1 rounded-lg text-3xs font-bold border transition-colors cursor-pointer ${
                        usuario?.rol === 'Solicitante'
                          ? 'bg-[#006699] text-white border-[#006699]'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Docente
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onCambiarRol('Responsable');
                        setMenuAbierto(false);
                      }}
                      className={`px-2 py-1 rounded-lg text-3xs font-bold border transition-colors cursor-pointer ${
                        usuario?.rol === 'Responsable'
                          ? 'bg-[#006699] text-white border-[#006699]'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Encargado
                    </button>
                  </div>
                </div>
              )}

              {/* Conmutador de Ergonomía Zurdos/Diestros */}
              <button
                type="button"
                onClick={() => toggleHandedness()}
                className="w-full px-4 py-2.5 text-xs text-left text-ink-muted hover:text-ink hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Hand className="w-4 h-4 text-slate-400" />
                  <span>Orientación de interfaz</span>
                </span>
                <span className="text-3xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {isLeftHanded ? 'Zurdo' : 'Diestro'}
                </span>
              </button>

              {/* Botón Cerrar Sesión */}
              <div className="pt-1.5 border-t border-line mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMenuAbierto(false);
                    onLogout();
                  }}
                  className="w-full px-4 py-2.5 text-xs text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold cursor-pointer transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
