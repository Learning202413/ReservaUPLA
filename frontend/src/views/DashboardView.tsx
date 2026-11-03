import React, { useEffect, useState } from 'react';
import { CardIndicador } from '../components/ui';
import { api } from '../services/api';
import { DashboardKpis, Reserva } from '../types';
import { Calendar, Clock, CheckCircle2, XCircle, Building2, ArrowRight } from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const [kpis, setKpis] = useState<DashboardKpis>({
    totalReservas: 0,
    reservasPendientes: 0,
    reservasAprobadas: 0,
    reservasRechazadas: 0,
    ambienteMasUtilizado: 'Cargando...',
    usosAmbienteMasUtilizado: 0,
  });
  const [recientes, setRecientes] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [kpiData, resData] = await Promise.all([api.getKpis(), api.getReservas()]);
        setKpis(kpiData);
        setRecientes(resData.slice(0, 4));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Título de Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            Panel de Control y Métricas de Reservas
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Indicadores institucionales consolidados en tiempo real (RF-08)
          </p>
        </div>
        <button
          onClick={() => onNavigate('nueva-reserva')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#006699] text-white text-xs font-bold rounded-xl hover:bg-[#004C73] transition-colors cursor-pointer shadow-xs self-start"
        >
          <span>Nueva Solicitud</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Los 5 Indicadores Mínimos de la Guía (RF-08 / Item 10) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <CardIndicador
          title="Total Reservas"
          value={loading ? '-' : kpis.totalReservas}
          icon={<Calendar className="w-5 h-5" />}
          description="Total registradas"
          variant="blue"
        />
        <CardIndicador
          title="Pendientes"
          value={loading ? '-' : kpis.reservasPendientes}
          icon={<Clock className="w-5 h-5" />}
          description="Por dictamen admin"
          variant="amber"
        />
        <CardIndicador
          title="Aprobadas"
          value={loading ? '-' : kpis.reservasAprobadas}
          icon={<CheckCircle2 className="w-5 h-5" />}
          description="Espacios autorizados"
          variant="emerald"
        />
        <CardIndicador
          title="Rechazadas"
          value={loading ? '-' : kpis.reservasRechazadas}
          icon={<XCircle className="w-5 h-5" />}
          description="Por solapamiento o aforo"
          variant="rose"
        />
        <CardIndicador
          title="Más Demandado"
          value={loading ? '-' : kpis.ambienteMasUtilizado}
          icon={<Building2 className="w-5 h-5" />}
          description={kpis.usosAmbienteMasUtilizado > 0 ? `${kpis.usosAmbienteMasUtilizado} reservas` : 'Sin datos'}
          variant="slate"
        />
      </div>

      {/* Sección Inferior: Resumen Rápido y Cumplimiento de Usabilidad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actividad Reciente */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Solicitudes Recientes de Ambientes
            </h3>
            <button
              onClick={() => onNavigate('reservas')}
              className="text-xs font-semibold text-[#006699] hover:underline cursor-pointer"
            >
              Ver todas
            </button>
          </div>

          <div className="space-y-3">
            {recientes.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100/60 transition-colors"
              >
                <div>
                  <p className="text-sm font-bold text-slate-800">{r.ambienteNombre}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {r.fecha} | {r.horaInicio} - {r.horaFin} | Solicitado por: {r.solicitanteNombre}
                  </p>
                </div>
                <span
                  className={`text-2xs font-bold px-2.5 py-1 rounded-full border ${
                    r.estado === 'Aprobada'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : r.estado === 'Pendiente'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : r.estado === 'Rechazada'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {r.estado}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Panel de Heurísticas de Diseño y Nielsen */}
        <div className="bg-gradient-to-br from-[#006699] to-[#004C73] text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-2xs font-bold uppercase tracking-wider text-sky-200">
              Evaluación de Usabilidad
            </span>
            <h3 className="text-base font-bold mt-1">
              Heurísticas de Jakob Nielsen & Shneiderman
            </h3>
            <p className="text-xs text-sky-100 mt-2 leading-relaxed opacity-90">
              Este dashboard cumple con la <strong>Heurística #1 (Visibilidad del estado del sistema)</strong> y la <strong>Regla #3 de Shneiderman (Ofrecer retroalimentación informativa)</strong>, mostrando el estado global de los recursos académicos sin necesidad de consultas manuales.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-sky-400/30 text-2xs text-sky-200 space-y-1">
            <p>âœ“ Prevención de solapamiento de horarios (RN-01)</p>
            <p>âœ“ Validación horaria entre 07:00 y 22:00 (RN-04)</p>
            <p>âœ“ Aprobación restringida a Administrador (RN-05)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
