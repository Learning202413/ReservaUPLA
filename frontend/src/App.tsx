import { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar, TabType } from './components/layout/Sidebar';
import { DashboardView } from './views/DashboardView';
import { ReservasView } from './views/ReservasView';
import { NuevaReservaView } from './views/NuevaReservaView';
import { AmbientesView } from './views/AmbientesView';
import { UsuariosView } from './views/UsuariosView';
import { LoginView } from './views/LoginView';
import { Usuario } from './types';

const STORAGE_KEY = 'reservaupla_sesion_usuario';

export function App() {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      return guardado ? JSON.parse(guardado) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  useEffect(() => {
    if (usuario) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [usuario]);

  const handleLoginSuccess = (usuarioLogueado: Usuario) => {
    setUsuario(usuarioLogueado);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setUsuario(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleCambiarRolEnCaliente = (nuevoRol: string) => {
    if (!usuario) return;
    const actualizado: Usuario = {
      ...usuario,
      rol: nuevoRol as any,
    };
    setUsuario(actualizado);
  };

  // Si no hay sesión activa, mostrar la pantalla de Login institucional (Heurística de Nielsen 1 y 4)
  if (!usuario) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header Institucional con Datos de Sesión Activa */}
      <Header
        usuarioActual={usuario}
        onLogout={handleLogout}
        onCambiarRol={handleCambiarRolEnCaliente}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Barra Lateral de Navegación */}
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Área Principal de Contenido */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView onNavigate={(tab) => setActiveTab(tab)} />
          )}

          {activeTab === 'reservas' && (
            <ReservasView rolActual={usuario.rol} />
          )}

          {activeTab === 'nueva-reserva' && (
            <NuevaReservaView onSuccess={() => setActiveTab('reservas')} />
          )}

          {activeTab === 'ambientes' && (
            <AmbientesView />
          )}

          {activeTab === 'usuarios' && (
            <UsuariosView />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
