import Link from "next/link";
import {
  getKPIs,
  DEMO_ORDENES,
  DEMO_COTIZACIONES,
} from "@/lib/demo-data";
import { ETAPA_NOMBRES } from "@/lib/types";

export default function Home() {
  const kpis = getKPIs();

  const recentOrdenes = [...DEMO_ORDENES]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 5);

  const recentCotizaciones = [...DEMO_COTIZACIONES]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 5);

  return (
    <main className="max-w-7xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          CRM Retarder México
        </h1>
        <p className="text-sm text-gray-500">
          Sistema de gestión de servicios de frenos retarders industriales
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Ventas del Mes"
          value={`$${(kpis.ventasMes / 1000).toFixed(0)}k`}
          sub="MXN aprobadas"
          color="text-green-700"
          bg="bg-green-50"
          border="border-green-200"
        />
        <KPICard
          label="Servicios Activos"
          value={String(kpis.serviciosActivos)}
          sub="en progreso"
          color="text-brand-700"
          bg="bg-blue-50"
          border="border-blue-200"
        />
        <KPICard
          label="Tasa de Conversión"
          value={`${kpis.tasaConversion}%`}
          sub="cotizaciones aprobadas"
          color="text-amber-700"
          bg="bg-amber-50"
          border="border-amber-200"
        />
        <KPICard
          label="Inventario Crítico"
          value={String(kpis.inventarioCritico)}
          sub="piezas bajo mínimo"
          color="text-red-700"
          bg="bg-red-50"
          border="border-red-200"
        />
      </div>

      {/* Module Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/dashboard"
          className="group block p-6 bg-white rounded-lg border border-gray-200 hover:border-brand-500 hover:shadow-md transition-all"
        >
          <div className="text-2xl mb-2">📊</div>
          <h2 className="text-lg font-semibold mb-1 group-hover:text-brand-600 transition-colors">
            Dashboard Ejecutivo
          </h2>
          <p className="text-gray-500 text-sm">
            Gráficas de pipeline, ventas por tipo y top clientes
          </p>
        </Link>

        <Link
          href="/ventas/frenos"
          className="group block p-6 bg-white rounded-lg border border-gray-200 hover:border-brand-500 hover:shadow-md transition-all"
        >
          <div className="text-2xl mb-2">💰</div>
          <h2 className="text-lg font-semibold mb-1 group-hover:text-brand-600 transition-colors">
            Ventas de Frenos
          </h2>
          <p className="text-gray-500 text-sm">
            Cotizador de kits y piezas para retarders
          </p>
        </Link>

        <Link
          href="/servicios"
          className="group block p-6 bg-white rounded-lg border border-gray-200 hover:border-brand-500 hover:shadow-md transition-all"
        >
          <div className="text-2xl mb-2">🔧</div>
          <h2 className="text-lg font-semibold mb-1 group-hover:text-brand-600 transition-colors">
            Pipeline de Servicios
          </h2>
          <p className="text-gray-500 text-sm">
            Kanban de 14 etapas con drag &amp; drop
          </p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-sm text-gray-900">
              Órdenes Recientes
            </h3>
            <Link
              href="/servicios"
              className="text-xs text-brand-600 hover:underline"
            >
              Ver todas
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrdenes.map((o) => (
              <div
                key={o.id}
                className="px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {o.folio}
                  </p>
                  <p className="text-xs text-gray-500">{o.empresa_nombre}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                    {ETAPA_NOMBRES[o.etapa]}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {o.created_at}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Quotations */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-sm text-gray-900">
              Cotizaciones Recientes
            </h3>
            <Link
              href="/ventas/frenos"
              className="text-xs text-brand-600 hover:underline"
            >
              Nueva cotización
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentCotizaciones.map((c) => (
              <div
                key={c.id}
                className="px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {c.folio}
                  </p>
                  <p className="text-xs text-gray-500">{c.empresa_nombre}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    ${c.total.toLocaleString("es-MX")}
                  </p>
                  <StatusBadge status={c.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function KPICard({
  label,
  value,
  sub,
  color,
  bg,
  border,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
  bg: string;
  border: string;
}) {
  return (
    <div className={`${bg} ${border} border rounded-lg p-4`}>
      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
        {label}
      </p>
      <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  borrador: "bg-gray-100 text-gray-600",
  enviada: "bg-blue-100 text-blue-700",
  aprobada: "bg-green-100 text-green-700",
  rechazada: "bg-red-100 text-red-700",
  vencida: "bg-amber-100 text-amber-700",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-full ${
        STATUS_STYLES[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}
