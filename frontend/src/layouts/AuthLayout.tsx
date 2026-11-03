import React from 'react';
import { AuthBrandPanel } from '../components/layout/AuthBrandPanel';
import { useHandedness } from '../hooks/useHandedness';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { isLeftHanded } = useHandedness();

  return (
    <div
      className={`h-dvh max-h-dvh w-full flex flex-col ${
        isLeftHanded ? 'lg:flex-row-reverse' : 'lg:flex-row'
      } bg-surface overflow-hidden select-none font-sans`}
    >
      {/* Encabezado superior para pantallas móviles (< lg) */}
      <header className="lg:hidden bg-[#00334D] px-5 py-3.5 flex items-center justify-center gap-3 shadow-sm border-b border-sky-900 shrink-0 text-white">
        <div className="flex items-center gap-3">
          <img
            src="/upla_logo.png"
            alt="UPLA Logo"
            className="h-8 w-auto object-contain bg-white px-2 py-1 rounded-lg"
          />
          <div>
            <h1 className="text-sm font-black text-white leading-tight">ReservaUPLA</h1>
            <p className="text-3xs text-sky-200">Universidad Peruana Los Andes</p>
          </div>
        </div>
      </header>

      {/* 1. Panel de Marca (60% en pantallas grandes) */}
      <AuthBrandPanel />

      {/* 2. Panel de formulario: 40% centrado con scroll controlado */}
      <main className="w-full lg:w-[40%] lg:max-w-[40%] lg:basis-[40%] bg-surface flex flex-col items-center justify-center px-6 sm:px-10 lg:px-10 xl:px-14 py-6 h-full shrink-0 grow-0 overflow-y-auto">
        <div className="w-full max-w-md flex flex-col my-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
