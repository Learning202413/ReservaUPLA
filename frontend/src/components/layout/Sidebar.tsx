import React from 'react';
import { LayoutDashboard, CalendarDays, PlusCircle, Building2, Users } from 'lucide-react';

export type TabType = 'dashboard' | 'reservas' | 'nueva-reserva' | 'ambientes' | 'usuarios';

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const menuItems: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard KPIs',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'reservas',
      label: 'Listado de Reservas',
      icon: <CalendarDays className="w-4 h-4" />,
    },
    {
      id: 'nueva-reserva',
      label: 'Nueva Solicitud',
      icon: <PlusCircle className="w-4 h-4" />,
    },
    {
      id: 'ambientes',
      label: 'Ambientes UPLA',
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      id: 'usuarios',
      label: 'Solicitantes',
      icon: <Users className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 shrink-0 min-h-[calc(100vh-65px)] p-4 flex flex-col justify-between">
      <nav className="space-y-1.5">
        <div className="px-3 py-2 text-2xs font-bold uppercase tracking-wider text-slate-400">
          Módulos Académicos
        </div>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#006699] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-slate-400'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Tarjeta de Especificación Técnica */}
      <div className="p-4 bg-sky-50/70 border border-sky-100 rounded-xl">
        <p className="text-xs font-bold text-[#006699]">Construcción de Software</p>
        <p className="text-2xs text-slate-500 mt-1 leading-relaxed">
          Sem. 01 a 09 | Clean Architecture + 10 Heurísticas de Nielsen + Shneiderman
        </p>
      </div>
    </aside>
  );
};
