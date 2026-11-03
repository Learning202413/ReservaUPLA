import { useState, useEffect } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ReservasPage } from './pages/ReservasPage';
import { NuevaReservaPage } from './pages/NuevaReservaPage';
import { AmbientesPage } from './pages/AmbientesPage';
import { UsuariosPage } from './pages/UsuariosPage';
import { PaginaActiva } from './components/layout/Sidebar';
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

  const [paginaActiva, setPaginaActiva] = useState<PaginaActiva>('dashboard');

  useEffect(() => {
    if (usuario) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [usuario]);

  const handleLoginSuccess = (usuarioLogueado: Usuario) => {
    setUsuario(usuarioLogueado);
    setPaginaActiva('dashboard');
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

  // 1. Pantalla de Autenticación Institucional (AuthLayout + AuthBrandPanel 60/40)
  if (!usuario) {
    return <LoginPage onSuccess={handleLoginSuccess} />;
  }

  // 2. Shell Principal del Sistema (MainLayout + Sidebar + Header)
  return (
    <MainLayout
      usuario={usuario}
      onLogout={handleLogout}
      onCambiarRol={handleCambiarRolEnCaliente}
      paginaActiva={paginaActiva}
      onSelectPagina={setPaginaActiva}
    >
      {paginaActiva === 'dashboard' && (
        <DashboardPage
          onNuevaReservaClick={() => setPaginaActiva('nueva-reserva')}
          onVerTodasClick={() => setPaginaActiva('reservas')}
        />
      )}

      {paginaActiva === 'reservas' && (
        <ReservasPage
          usuario={usuario}
          onNuevaReservaClick={() => setPaginaActiva('nueva-reserva')}
        />
      )}

      {paginaActiva === 'nueva-reserva' && (
        <NuevaReservaPage onSuccess={() => setPaginaActiva('reservas')} />
      )}

      {paginaActiva === 'ambientes' && (
        <AmbientesPage />
      )}

      {paginaActiva === 'usuarios' && (
        <UsuariosPage />
      )}
    </MainLayout>
  );
}

export default App;
