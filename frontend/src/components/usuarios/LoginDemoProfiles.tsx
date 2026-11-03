import React from 'react';

export interface LoginDemoProfilesProps {
  onSelectDemo: (correo: string, pass: string) => void;
}

export const LoginDemoProfiles: React.FC<LoginDemoProfilesProps> = ({ onSelectDemo }) => {
  return (
    <div className="mt-4 border border-dashed border-demo-border rounded-2xl p-3 bg-slate-50 dark:bg-slate-900/60 text-left">
      <div className="flex items-center justify-between">
        <p className="font-bold text-xs text-ink">Perfiles de prueba</p>
        <span className="text-3xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-[#006699] dark:text-sky-400">
          Acceso Rápido
        </span>
      </div>
      <p className="text-xs text-ink-muted mt-0.5 mb-2">
        Seleccione un perfil institucional para autocompletar credenciales por rol:
      </p>

      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-demo-divider">
        <button
          type="button"
          onClick={() => onSelectDemo('admin@upla.edu.pe', 'admin123')}
          className="px-2.5 py-1 bg-sky-50 dark:bg-sky-950/70 hover:bg-sky-100 dark:hover:bg-sky-900 text-[#006699] dark:text-sky-300 border border-sky-200 dark:border-sky-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
        >
          Administrador
        </button>

        <button
          type="button"
          onClick={() => onSelectDemo('cmendoza@upla.edu.pe', 'docente123')}
          className="px-2.5 py-1 bg-surface hover:bg-slate-100 dark:hover:bg-slate-800 text-ink border border-line rounded-lg text-xs font-medium transition-colors cursor-pointer"
        >
          Docente (Solicitante)
        </button>

        <button
          type="button"
          onClick={() => onSelectDemo('mquispe@upla.edu.pe', 'responsable123')}
          className="px-2.5 py-1 bg-surface hover:bg-slate-100 dark:hover:bg-slate-800 text-ink border border-line rounded-lg text-xs font-medium transition-colors cursor-pointer"
        >
          Responsable Ambiente
        </button>

        <button
          type="button"
          onClick={() => onSelectDemo('inactivo@upla.edu.pe', 'inactivo123')}
          className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          title="Prueba de cuenta con estado inactivo"
        >
          Inactivo (Prueba)
        </button>
      </div>
    </div>
  );
};

export default LoginDemoProfiles;
