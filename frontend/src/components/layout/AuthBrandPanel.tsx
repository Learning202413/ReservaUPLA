import React from 'react';

export const AuthBrandPanel: React.FC = () => {
  return (
    <aside className="hidden lg:flex lg:w-[60%] lg:max-w-[60%] lg:basis-[60%] text-white p-12 xl:p-16 flex-col justify-between relative overflow-hidden shrink-0 grow-0 select-none h-full bg-[#002233]">
      {/* Fotografía del Campus UPLA de fondo */}
      <img
        src="/bg-login-campus.png"
        alt="Campus Universidad Peruana Los Andes"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none z-0"
      />

      {/* Superposición con gradiente azul institucional semitransparente para preservar contraste y legibilidad */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, rgba(0, 34, 51, 0.82) 0%, rgba(0, 77, 115, 0.65) 50%, rgba(0, 26, 40, 0.88) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Cabecera de Logo superior izquierda */}
      <div className="relative z-10 flex items-center gap-3.5">
        <div className="bg-white p-2.5 rounded-2xl shadow-lg ring-2 ring-white/20">
          <img
            src="/upla_logo.png"
            alt="Universidad Peruana Los Andes"
            className="h-9 w-auto object-contain"
          />
        </div>
        <div>
          <span className="text-3xs font-extrabold uppercase tracking-widest text-sky-300 block drop-shadow-sm">
            Facultad de Ingeniería | Sistemas
          </span>
          <h2 className="text-sm font-black tracking-tight text-white leading-tight drop-shadow-sm">
            Universidad Peruana Los Andes
          </h2>
        </div>
      </div>

      {/* Textos Centrales alineados al estilo de GirasolesRes */}
      <div className="relative z-10 my-auto py-8 max-w-xl text-left">
        <div className="mb-4">
          <span className="text-sky-300 font-bold tracking-widest text-xs uppercase block mb-2 drop-shadow">
            BIENVENIDOS A:
          </span>
          <div className="w-12 h-0.5 bg-sky-400 rounded-full shadow-sm" />
        </div>

        <h1 className="font-bold text-5xl lg:text-6xl text-white leading-tight mb-5 tracking-tight drop-shadow-lg">
          ReservaUPLA.<br />
        </h1>

        <p className="text-white/95 font-sans text-base lg:text-lg max-w-md leading-relaxed drop-shadow-md font-medium">
          Sistema oficial de gestión, asignación y control de reservas de ambientes universitarios y laboratorios institucionales.
        </p>
      </div>

      {/* Pie de página inferior institucional */}
      <footer className="relative z-10 pt-4 border-t border-white/20 flex items-center justify-between text-xs text-white/80 font-medium drop-shadow-sm">
        <span>Universidad Peruana Los Andes &copy; {new Date().getFullYear()}</span>
        <span className="tracking-wide">Campus Chorrillos &bull; Huancayo</span>
      </footer>
    </aside>
  );
};

export default AuthBrandPanel;
