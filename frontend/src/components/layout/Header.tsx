import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Menu, ChevronDown, HelpCircle } from 'lucide-react';
import { Usuario } from '../../types';
import { ThemeToggle } from './ThemeToggle';
import { ReglamentoModal } from './ReglamentoModal';

interface HeaderProps {
  usuario?: Usuario | null;
  onLogout: () => void;
  breadcrumbSection?: string;
  breadcrumbPage?: string;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  usuario,
  onLogout,
  breadcrumbSection = 'Sistema',
  breadcrumbPage = 'Dashboard',
  onToggleSidebar,
}) => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modalReglamento, setModalReglamento] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar menú al hacer clic afuera o presionar Escape (Norman - Asequibilidad por teclado)
  useEffect(() => {
    if (!menuAbierto) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuAbierto(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuAbierto(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
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
        {/* Lado izquierdo: Botón menú móvil + Migas de pan */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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

        {/* Lado derecho: Guía + Botón Modo Oscuro + Menú de Perfil */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setModalReglamento(true)}
            aria-label="Ver reglamento y guía de reservas"
            title="Guía y reglamento"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-ink-muted hover:text-ink border border-line bg-surface hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer min-h-[38px]"
          >
            <HelpCircle className="w-4 h-4 text-primary dark:text-sky-400 shrink-0" />
            <span className="hidden md:inline">Guía</span>
          </button>

          <ThemeToggle />

          <div className="h-6 w-px bg-line" aria-hidden="true" />

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="flex items-center gap-3 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-line focus:outline-none focus:ring-2 focus:ring-primary/20"
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

            {/* Menú Desplegable (GirasolesRes Pattern) */}
            {menuAbierto && (
              <div
                className="absolute right-0 mt-2 w-60 bg-surface rounded-2xl shadow-xl border border-line p-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                role="menu"
              >
                <div className="px-3.5 py-2.5 border-b border-line bg-canvas/40 rounded-xl mb-1">
                  <p className="text-xs font-black text-ink truncate">
                    {usuario?.nombreCompleto || 'Usuario'}
                  </p>
                  <p className="text-2xs text-ink-muted font-medium truncate mt-0.5">
                    {usuario?.correo || ''}
                  </p>
                  <span className="inline-block mt-2 text-3xs font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/70 text-primary dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                    {usuario?.rol || 'Solicitante'}
                  </span>
                </div>

                <div className="p-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuAbierto(false);
                      onLogout();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 flex items-center gap-2 cursor-pointer transition-colors font-bold"
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ReglamentoModal
        isOpen={modalReglamento}
        onClose={() => setModalReglamento(false)}
      />
    </header>
  );
};

export default Header;
