import React, { useEffect, useState } from 'react';
import { StatCard, Button, StatusBadge } from '../components/ui';
import { PageHeader } from '../components/layout/PageHeader';
import { PageContainer } from '../components/layout/PageContainer';
import { api } from '../services/api';
import { DashboardKpis, Reserva } from '../types';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  PlusCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface DashboardPageProps {
  onNuevaReservaClick: () => void;
  onVerTodasClick: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNuevaReservaClick,
  onVerTodasClick,
}) => {
  const [kpis, setKpis] = useState<DashboardKpis | null>(null);
  const [recientes, setRecientes] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        const [kpiData, resData] = await Promise.all([
          api.getKpis(),
          api.getReservas(),
        ]);
        setKpis(kpiData);
        setRecientes(resData.slice(0, 5));
      } catch (err) {
        console.error('Error al cargar dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  return (
    <PageContainer>
      {/* Cabecera Estandarizada con PageHeader */}
      <PageHeader
        title="Dashboard de Gestión de Ambientes"
        subtitle="Métricas institucionales consolidadas y demanda académica en tiempo real."
        badge={
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 dark:bg-sky-950/70 text-[#006699] dark:text-sky-300 border border-sky-200 dark:border-sky-800 shadow-2xs">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Tiempo Real</span>
          </span>
        }
        actions={
          <Button
            variant="primary"
            size="md"
            icon={<PlusCircle className="w-4 h-4" />}
            onClick={onNuevaReservaClick}
          >
            Solicitar Reserva
          </Button>
        }
      />

      {/* Grid de 5 Indicadores (StatCards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Reservas"
          value={loading ? '...' : kpis?.totalReservas ?? 0}
          subtitle="Registradas acumuladas"
          icon={CalendarDays}
          iconBg="bg-sky-50 dark:bg-sky-950/70 text-[#006699] dark:text-sky-400"
        />

        <StatCard
          title="Pendientes"
          value={loading ? '...' : kpis?.reservasPendientes ?? 0}
          subtitle="En espera de dictamen"
          icon={Clock}
          badge={{ text: 'Por revisar', variant: 'warning' }}
          iconBg="bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400"
        />

        <StatCard
          title="Aprobadas"
          value={loading ? '...' : kpis?.reservasAprobadas ?? 0}
          subtitle="Espacios autorizados"
          icon={CheckCircle2}
          badge={{ text: 'Activas', variant: 'positive' }}
          iconBg="bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400"
        />

        <StatCard
          title="Rechazadas"
          value={loading ? '...' : kpis?.reservasRechazadas ?? 0}
          subtitle="Por aforo o cruce horario"
          icon={XCircle}
          badge={{ text: 'Denegadas', variant: 'negative' }}
          iconBg="bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400"
        />

        <StatCard
          title="Más Solicitado"
          value={loading ? '...' : kpis?.ambienteMasUtilizado || 'Sin datos'}
          subtitle="Mayor demanda académica"
          icon={Building2}
          iconBg="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
        />
      </div>

      {/* Bloque Inferior: Lista Reciente + Políticas de Operación */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Reservas Recientes */}
        <div className="lg:col-span-2 bg-surface rounded-2xl border border-line p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-black text-ink">
                Solicitudes Recientes de Ambientes
              </h3>
              <p className="text-xs text-ink-muted mt-0.5">
                Últimos requerimientos ingresados por docentes y directivos
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={onVerTodasClick}
            >
              Ver todas
            </Button>
          </div>

          <div className="space-y-2.5">
            {recientes.length === 0 ? (
              <div className="text-center py-10 text-xs text-ink-muted">
                No hay solicitudes recientes registradas.
              </div>
            ) : (
              recientes.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-3.5 bg-canvas border border-line rounded-xl hover:bg-surface-raised transition-colors"
                >
                  <div className="min-w-0 pr-3">
                    <p className="font-bold text-xs sm:text-sm text-ink truncate">
                      {r.ambienteNombre}
                    </p>
                    <p className="text-2xs text-ink-muted mt-0.5">
                      {r.fecha} | {r.horaInicio} - {r.horaFin} | Solicitado por: {r.solicitanteNombre}
                    </p>
                  </div>
                  <StatusBadge status={r.estado} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Panel Informativo de Políticas */}
        <div className="bg-sidebar text-white rounded-2xl p-6 shadow-md flex flex-col justify-between border border-sidebar-line">
          <div>
            <span className="text-3xs font-extrabold uppercase tracking-widest text-sky-300">
              Guía Rápida de Uso
            </span>
            <h3 className="text-lg font-black mt-1 text-white">
              Reglas para Reservar
            </h3>
            <p className="text-xs text-sky-100/90 mt-2.5 leading-relaxed font-normal">
              Para que todos los docentes y estudiantes usen los ambientes de forma ordenada, ten en cuenta estas 3 reglas:
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-xs text-sky-200/90 space-y-2.5 font-medium">
            <p className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span><strong>Sin cruces:</strong> No se pueden pedir horarios que ya estén ocupados.</span>
            </p>
            <p className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
              <span><strong>Horario:</strong> El campus atiende de <strong>07:00 a 22:00</strong>.</span>
            </p>
            <p className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              <span><strong>Revisión:</strong> Administración revisa y aprueba cada solicitud.</span>
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default DashboardPage;
