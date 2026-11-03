import React, { useEffect, useState } from 'react';
import { StatCard, StatusBadge, Button } from '../components/ui';
import { api } from '../services/api';
import { DashboardKpis, Reserva } from '../types';
import { Calendar, Clock, CheckCircle2, XCircle, Building2, PlusCircle, ArrowRight } from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (pagina: any) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
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
        setRecientes(resData.slice(0, 5));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Cabecera del Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-ink tracking-tight">
            Dashboard de Gestión de Ambientes
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
            Métricas institucionales consolidadas y demanda académica en tiempo real (RF-08).
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => onNavigate('nueva-reserva')}
          className="self-start sm:self-auto shadow-sm"
        >
          <PlusCircle className="w-4 h-4 mr-1.5" />
          <span>Solicitar Reserva</span>
        </Button>
      </div>

      {/* Los 5 Indicadores Mínimos de la Rúbrica (RF-08) implementados con StatCard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Reservas"
          value={loading ? '-' : kpis.totalReservas}
          icon={Calendar}
          subtitle="Registradas acumuladas"
          iconBg="bg-sky-50 text-[#006699]"
        />
        <StatCard
          title="Pendientes"
          value={loading ? '-' : kpis.reservasPendientes}
          icon={Clock}
          subtitle="Por dictamen de admin"
          badge={{ text: 'En espera', variant: 'warning' }}
          iconBg="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Aprobadas"
          value={loading ? '-' : kpis.reservasAprobadas}
          icon={CheckCircle2}
          subtitle="Espacios autorizados"
          badge={{ text: 'Activas', variant: 'positive' }}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Rechazadas"
          value={loading ? '-' : kpis.reservasRechazadas}
          icon={XCircle}
          subtitle="Por aforo o cruce"
          badge={{ text: 'Denegadas', variant: 'negative' }}
          iconBg="bg-rose-50 text-rose-600"
        />
        <StatCard
          title="Más Solicitado"
          value={loading ? '-' : kpis.ambienteMasUtilizado}
          icon={Building2}
          subtitle={kpis.usosAmbienteMasUtilizado > 0 ? `${kpis.usosAmbienteMasUtilizado} reservas` : 'Sin datos'}
          iconBg="bg-slate-100 text-slate-700"
        />
      </div>

      {/* Grilla Inferior: Actividad Reciente + Panel de Usabilidad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface border border-line-strong rounded-2xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-ink uppercase tracking-wider">
              Solicitudes Recientes de Ambientes
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('reservas')}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver todas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recientes.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-3.5 bg-slate-50 border border-line rounded-xl hover:bg-slate-100/70 transition-colors"
              >
                <div>
                  <p className="text-sm font-bold text-ink">{r.ambienteNombre}</p>
                  <p className="text-xs text-ink-muted mt-0.5">
                    {r.fecha} | {r.horaInicio} - {r.horaFin} | Docente: {r.solicitanteNombre}
                  </p>
                </div>
                <StatusBadge status={r.estado} />
              </div>
            ))}
          </div>
        </div>

        {/* Panel Informativo del Sistema */}
        <div className="bg-[#00334D] text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <span className="text-3xs font-extrabold uppercase tracking-widest text-sky-300">
              Políticas de Operación
            </span>
            <h3 className="text-lg font-black mt-1 text-white">
              Reglamento de Ambientes
            </h3>
            <p className="text-xs text-sky-100/90 mt-2.5 leading-relaxed">
              Las solicitudes registradas son procesadas bajo validación en tiempo real para garantizar disponibilidad continua y trazabilidad oficial de la infraestructura institucional.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-sky-800/80 text-2xs text-sky-200/90 space-y-1.5 font-medium">
            <p>✓ Validación algorítmica sin cruce de horarios</p>
            <p>✓ Horario de atención institucional: 07:00 a 22:00</p>
            <p>✓ Aprobación y asignación por administración</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
