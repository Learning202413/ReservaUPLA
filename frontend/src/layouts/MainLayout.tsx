import React, { useState } from 'react';
import { Sidebar, PaginaActiva } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { Usuario } from '../types';
import { useHandedness } from '../hooks/useHandedness';

interface MainLayoutProps {
  children: React.ReactNode;
  usuario?: Usuario | null;
  onLogout: () => void;
  onCambiarRol?: (rol: string) => void;
  paginaActiva: PaginaActiva;
  onSelectPagina: (pagina: PaginaActiva) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  usuario,
  onLogout,
  onCambiarRol,
  paginaActiva,
  onSelectPagina,
}) => {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const { isLeftHanded } = useHandedness();

  const titulosPorPagina: Record<PaginaActiva, { seccion: string; pagina: string }> = {
    dashboard: { seccion: 'Métricas', pagina: 'Dashboard de Indicadores' },
    reservas: { seccion: 'Gestión', pagina: 'Control de Reservas' },
    'nueva-reserva': { seccion: 'Solicitudes', pagina: 'Nueva Reserva' },
    ambientes: { seccion: 'Infraestructura', pagina: 'Ambientes UPLA' },
    usuarios: { seccion: 'Administración', pagina: 'Usuarios Solicitantes' },
  };

  const breadcrumbs = titulosPorPagina[paginaActiva] || {
    seccion: 'Sistema',
    pagina: 'ReservaUPLA',
  };

  return (
    <div
      className={`flex h-screen overflow-hidden bg-canvas ${
        isLeftHanded ? 'flex-row-reverse' : ''
      }`}
    >
      <Sidebar
        usuario={usuario}
        paginaActiva={paginaActiva}
        onSelectPagina={onSelectPagina}
        isOpenMobile={sidebarAbierto}
        onCloseMobile={() => setSidebarAbierto(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header
          usuario={usuario}
          onLogout={onLogout}
          onCambiarRol={onCambiarRol}
          breadcrumbSection={breadcrumbs.seccion}
          breadcrumbPage={breadcrumbs.pagina}
          onToggleSidebar={() => setSidebarAbierto((prev) => !prev)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
