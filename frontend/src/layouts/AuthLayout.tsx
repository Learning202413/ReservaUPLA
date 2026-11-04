import React from 'react';
import { AuthBrandPanel } from '../components/layout/AuthBrandPanel';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="h-dvh max-h-dvh w-full flex flex-col lg:flex-row bg-surface overflow-hidden select-none">
      {/* Encabezado superior para pantallas móviles (< lg) */}
      <header className="lg:hidden bg-sidebar px-5 py-3.5 flex items-center justify-between shadow-xs border-b border-sidebar-line shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1.5 rounded-lg shadow-xs">
            <img
              src="/upla_icon.png"
              alt="Universidad Peruana Los Andes"
              className="h-6 w-6 object-contain"
            />
          </div>
          <span className="text-white font-bold text-sm">ReservaUPLA</span>
        </div>
      </header>

      {/* 1. Panel de Marca (60% en pantallas grandes) */}
      <AuthBrandPanel />

      {/* 2. Panel de formulario: 40% alineado verticalmente */}
      <main className="w-full lg:w-[40%] lg:max-w-[40%] lg:basis-[40%] bg-surface flex flex-col items-center justify-center px-6 sm:px-10 lg:px-10 xl:px-14 py-6 h-full shrink-0 grow-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
