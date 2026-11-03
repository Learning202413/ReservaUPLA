import React from 'react';
import { LayoutDashboard, CalendarDays, PlusCircle, Building2, Users, X, ShieldCheck } from 'lucide-react';
import { Usuario } from '../../types';

export type PaginaActiva = 'dashboard' | 'reservas' | 'nueva-reserva' | 'ambientes' | 'usuarios';

interface SidebarProps {
  paginaActiva: PaginaActiva;
  onSelectPagina: (pagina: PaginaActiva) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  usuario?: Usuario | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  paginaActiva,
  onSelectPagina,
  isOpenMobile = false,
  onCloseMobile,
  usuario,
}) => {
  const menuGroups: {
    seccion: string;
    items: { id: PaginaActiva; label: string; icon: React.ReactNode; roles?: string[] }[];
  }[] = [
    {
      seccion: 'Métricas',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard KPIs',
          icon: <LayoutDashboard className="w-5 h-5" />,
        },
      ],
    },
    {
      seccion: 'Solicitudes',
      items: [
        {
          id: 'reservas',
          label: 'Control de Reservas',
          icon: <CalendarDays className="w-5 h-5" />,
        },
        {
          id: 'nueva-reserva',
          label: 'Nueva Reserva',
          icon: <PlusCircle className="w-5 h-5" />,
        },
      ],
    },
    {
      seccion: 'Infraestructura',
      items: [
        {
          id: 'ambientes',
          label: 'Ambientes UPLA',
          icon: <Building2 className="w-5 h-5" />,
        },
      ],
    },
    {
      seccion: 'Administración',
      items: [
        {
          id: 'usuarios',
          label: 'Usuarios Solicitantes',
          icon: <Users className="w-5 h-5" />,
          roles: ['Administrador'],
        },
      ],
    },
  ];

  const handleSelect = (id: PaginaActiva) => {
    onSelectPagina(id);
    if (onCloseMobile) onCloseMobile();
  };

  const content = (
    <div className="w-64 bg-[#00334D] text-white flex flex-col justify-between h-full select-none border-r border-sky-950 font-sans">
      <div>
        {/* Cabecera Sidebar con Logo */}
        <div className="p-5 flex items-center justify-between border-b border-sky-900/60">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl shadow-xs">
              <img
                src="/upla_logo.png"
                alt="UPLA Logo"
                className="h-7 w-auto object-contain"
              />
            </div>
            <div>
              <h2 className="text-sm font-black text-white leading-tight">ReservaUPLA</h2>
              <span className="text-3xs font-semibold text-sky-300">Gestión de Ambientes</span>
            </div>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden text-sky-300 hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Lista de Navegación por Secciones / Grupos */}
        <nav className="p-4 space-y-4">
          {menuGroups.map((group) => {
            const itemsVisibles = group.items.filter(
              (item) => !item.roles || (usuario?.rol && item.roles.includes(usuario.rol))
            );

            if (itemsVisibles.length === 0) return null;

            return (
              <div key={group.seccion} className="space-y-1">
                <p className="px-3 py-1 text-3xs font-extrabold uppercase tracking-widest text-sky-400">
                  {group.seccion}
                </p>

                {itemsVisibles.map((item) => {
                  const isActive = paginaActiva === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#006699] text-white shadow-md shadow-sky-950/40 border border-sky-400/30'
                          : 'text-sky-100/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span className={isActive ? 'text-white' : 'text-sky-300'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Tarjeta de Especificación y Rol en Pie */}
      <div className="p-4 border-t border-sky-900/60 m-3 rounded-2xl bg-sky-950/50 border border-sky-900">
        <div className="flex items-center gap-2 text-sky-300 text-xs font-bold mb-1">
          <ShieldCheck className="w-4 h-4 text-sky-400" />
          <span>Perfil Activo</span>
        </div>
        <p className="text-xs font-bold text-white truncate">
          {usuario?.nombreCompleto || 'Usuario'}
        </p>
        <p className="text-3xs text-sky-300 truncate mt-0.5">
          Rol: {usuario?.rol || 'Solicitante'}
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (oculto en pantallas pequeñas) */}
      <aside className="hidden lg:block shrink-0 h-screen sticky top-0">
        {content}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        >
          <div
            className="fixed inset-y-0 left-0 z-50 w-64 shadow-2xl animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {content}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
