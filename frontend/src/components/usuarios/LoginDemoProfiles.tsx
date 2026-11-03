import React from 'react';

export interface LoginDemoProfilesProps {
  onSelectDemo: (correo: string, pass: string) => void;
}

export const LoginDemoProfiles: React.FC<LoginDemoProfilesProps> = ({ onSelectDemo }) => {
  return (
    <div className="mt-4 border border-dashed border-demo-border rounded-2xl p-3 bg-slate-50 text-left">
      <div className="flex items-center justify-between">
        <p className="font-bold text-xs text-ink">Acceso de demostración</p>
        <span className="text-3xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-[#006699]">
          Sustentación
        </span>
      </div>
      <p className="text-xs text-ink-muted mt-0.5 mb-2">
        Seleccione un perfil institucional para probar el acceso rápido por rol:
      </p>

      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-demo-divider">
        <button
          type="button"
          onClick={() => onSelectDemo('admin@upla.edu.pe', 'admin123')}
          className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-[#006699] border border-sky-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
        >
          Administrador
        </button>

        <button
          type="button"
          onClick={() => onSelectDemo('cmendoza@upla.edu.pe', 'docente123')}
          className="px-2.5 py-1 bg-surface hover:bg-slate-100 text-ink border border-line rounded-lg text-xs font-medium transition-colors cursor-pointer"
        >
          Docente (Solicitante)
        </button>

        <button
          type="button"
          onClick={() => onSelectDemo('mquispe@upla.edu.pe', 'responsable123')}
          className="px-2.5 py-1 bg-surface hover:bg-slate-100 text-ink border border-line rounded-lg text-xs font-medium transition-colors cursor-pointer"
        >
          Responsable Ambiente
        </button>

        <button
          type="button"
          onClick={() => onSelectDemo('inactivo@upla.edu.pe', 'inactivo123')}
          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          title="Prueba de cuenta de demostración inactiva"
        >
          Inactivo (Prueba)
        </button>
      </div>
    </div>
  );
};

export default LoginDemoProfiles;
