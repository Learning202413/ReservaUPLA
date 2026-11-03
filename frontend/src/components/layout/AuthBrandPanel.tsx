import React from 'react';
import { ShieldCheck, CalendarCheck, Clock, Award, Building2 } from 'lucide-react';

export const AuthBrandPanel: React.FC = () => {
  return (
    <aside className="hidden lg:flex lg:w-[60%] lg:max-w-[60%] lg:basis-[60%] text-white p-12 xl:p-16 flex-col justify-between relative overflow-hidden shrink-0 grow-0 select-none h-full bg-[#00334D]">
      {/* Fondo degradado institucional con textura sutil */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(2, 132, 199, 0.45) 0%, rgba(0, 102, 153, 0.85) 45%, rgba(0, 51, 77, 0.98) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Decoración geométrica */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#006699]/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#0284C7]/20 blur-3xl pointer-events-none" />

      {/* Cabecera de Logo superior izquierda */}
      <div className="relative z-10 flex items-center gap-4 p-2">
        <div className="bg-white p-3 rounded-2xl shadow-lg ring-2 ring-white/20">
          <img
            src="/upla_logo.png"
            alt="Universidad Peruana Los Andes"
            className="h-10 w-auto object-contain"
          />
        </div>
        <div>
          <span className="text-3xs font-extrabold uppercase tracking-widest text-sky-300">
            Facultad de Ingeniería | Sistemas
          </span>
          <h2 className="text-lg font-black tracking-tight text-white leading-tight">
            Universidad Peruana Los Andes
          </h2>
        </div>
      </div>

      {/* Bloque central: Propuesta de Valor y Principios del Solucionario */}
      <div className="relative z-10 max-w-xl my-auto py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-200 text-xs font-semibold mb-4 backdrop-blur-xs">
          <Award className="w-3.5 h-3.5" />
          <span>Construcción de Software | Semanas 01 - 09</span>
        </div>

        <h1 className="text-3xl xl:text-4xl font-black text-white tracking-tight leading-tight">
          Gestión y Control de Reservas de Ambientes Universitarios
        </h1>

        <p className="mt-3.5 text-sm xl:text-base text-sky-100/90 leading-relaxed">
          Plataforma oficial para la administración de laboratorios de cómputo, auditorios y salas institucionales con validación algorítmica y cero conflictos de horario.
        </p>

        {/* Pilares Técnicos */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-sky-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
            <ShieldCheck className="w-5 h-5 text-sky-300 shrink-0" />
            <div>
              <p className="font-bold text-white">Anti-Solapamiento (RN-01)</p>
              <p className="text-2xs text-sky-200">Algoritmo matemático estricto</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
            <Clock className="w-5 h-5 text-sky-300 shrink-0" />
            <div>
              <p className="font-bold text-white">Horario Oficial (RN-04)</p>
              <p className="text-2xs text-sky-200">Operatividad 07:00 a 22:00</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
            <Building2 className="w-5 h-5 text-sky-300 shrink-0" />
            <div>
              <p className="font-bold text-white">Aforo y Capacidad</p>
              <p className="text-2xs text-sky-200">Control de aforo por ambiente</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
            <CalendarCheck className="w-5 h-5 text-sky-300 shrink-0" />
            <div>
              <p className="font-bold text-white">Trazabilidad Total</p>
              <p className="text-2xs text-sky-200">Clean Architecture .NET 8</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pie inferior con acreditación */}
      <div className="relative z-10 pt-4 border-t border-sky-400/20 flex items-center justify-between text-2xs text-sky-300/80">
        <span>UPLA | Licenciada por SUNEDU</span>
        <span>Heurísticas de Nielsen & Shneiderman</span>
      </div>
    </aside>
  );
};

export default AuthBrandPanel;
