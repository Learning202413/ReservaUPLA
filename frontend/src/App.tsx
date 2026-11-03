import { useState } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar, TabType } from './components/layout/Sidebar';
import { DashboardView } from './views/DashboardView';
import { ReservasView } from './views/ReservasView';
import { NuevaReservaView } from './views/NuevaReservaView';
import { AmbientesView } from './views/AmbientesView';
import { UsuariosView } from './views/UsuariosView';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [rolActual, setRolActual] = useState<string>('Administrador');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header Corporativo UPLA */}
      <Header rolActual={rolActual} onCambiarRol={setRolActual} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Barra Lateral de Navegación */}
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Área Principal de Contenido */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView onNavigate={(tab) => setActiveTab(tab)} />
          )}

          {activeTab === 'reservas' && (
            <ReservasView rolActual={rolActual} />
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
