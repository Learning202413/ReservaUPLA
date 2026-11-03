import React, { useState } from 'react';
import { Sidebar, PaginaActiva } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { LogoutModal } from '../components/layout/LogoutModal';
import { Usuario } from '../types';

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
  const [modalLogoutAbierto, setModalLogoutAbierto] = useState(false);

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

  const handleConfirmLogout = () => {
    setModalLogoutAbierto(false);
    onLogout();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
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
          onLogout={() => setModalLogoutAbierto(true)}
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

      <LogoutModal
        isOpen={modalLogoutAbierto}
        onClose={() => setModalLogoutAbierto(false)}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
};

export default MainLayout;
