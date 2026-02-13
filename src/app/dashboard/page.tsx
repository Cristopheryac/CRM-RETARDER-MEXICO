"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  getKPIs,
  getPipelineData,
  getVentasPorTipoFreno,
  getTopClientes,
  DEMO_ORDENES,
  DEMO_COTIZACIONES,
} from "@/lib/demo-data";
import { ETAPA_NOMBRES } from "@/lib/types";

const PIE_COLORS = ["#2563eb", "#f59e0b", "#10b981"];

export default function DashboardPage() {
  const kpis = getKPIs();
  const pipelineData = getPipelineData();
  const ventasPorTipo = getVentasPorTipoFreno();
  const topClientes = getTopClientes();

  const ordenesPorPrioridad = [
    {
      name: "Urgente",
      value: DEMO_ORDENES.filter((o) => o.prioridad === "urgente").length,
    },
    {
      name: "Alta",
      value: DEMO_ORDENES.filter((o) => o.prioridad === "alta").length,
    },
    {
      name: "Normal",
      value: DEMO_ORDENES.filter((o) => o.prioridad === "normal").length,
    },
    {
      name: "Baja",
      value: DEMO_ORDENES.filter((o) => o.prioridad === "baja").length,
    },
  ];

  const PRIORITY_COLORS = ["#ef4444", "#f97316", "#22c55e", "#9ca3af"];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard Ejecutivo
        </h1>
        <p className="text-sm text-gray-500">
          Vista general del rendimiento del negocio
        </p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Ventas Aprobadas"
          value={`$${(kpis.ventasMes / 1000).toFixed(0)}k`}
          color="text-green-700"
          bg="bg-green-50"
          border="border-green-200"
        />
        <KPICard
          label="Servicios Activos"
          value={String(kpis.serviciosActivos)}
          color="text-brand-700"
          bg="bg-blue-50"
          border="border-blue-200"
        />
        <KPICard
          label="Conversión"
          value={`${kpis.tasaConversion}%`}
          color="text-amber-700"
          bg="bg-amber-50"
          border="border-amber-200"
        />
        <KPICard
          label="Total Órdenes"
          value={String(DEMO_ORDENES.length)}
          color="text-gray-700"
          bg="bg-gray-50"
          border="border-gray-200"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-sm text-gray-900 mb-4">
            Distribución del Pipeline
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={pipelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="etapa" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value) => [value, "Órdenes"]}
                labelFormatter={(label) => {
                  const num = parseInt(String(label).replace("E", ""));
                  return ETAPA_NOMBRES[num] || label;
                }}
              />
              <Bar dataKey="cantidad" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sales by Brake Type */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-sm text-gray-900 mb-4">
            Ventas por Tipo de Freno
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={ventasPorTipo}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {ventasPorTipo.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [
                  `$${Number(value).toLocaleString("es-MX")} MXN`,
                  "Total",
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Clients */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-sm text-gray-900 mb-4">
            Top Clientes por Órdenes
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topClientes} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
              <YAxis
                dataKey="name"
                type="category"
                width={140}
                tick={{ fontSize: 11 }}
              />
              <Tooltip formatter={(value) => [value, "Órdenes"]} />
              <Bar dataKey="ordenes" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-sm text-gray-900 mb-4">
            Órdenes por Prioridad
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={ordenesPorPrioridad}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {ordenesPorPrioridad.map((_, i) => (
                  <Cell
                    key={i}
                    fill={PRIORITY_COLORS[i % PRIORITY_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quotation Summary Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-sm text-gray-900">
            Cotizaciones
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-2">Folio</th>
                <th className="text-left px-4 py-2">Empresa</th>
                <th className="text-right px-4 py-2">Total</th>
                <th className="text-center px-4 py-2">Status</th>
                <th className="text-right px-4 py-2">Vigencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {DEMO_COTIZACIONES.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2.5 font-medium text-gray-900">
                    {c.folio}
                  </td>
                  <td className="px-4 py-2.5 text-gray-600">
                    {c.empresa_nombre}
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold text-gray-900">
                    ${c.total.toLocaleString("es-MX")}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <CotizacionBadge status={c.status} />
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-500">
                    {c.fecha_vigencia}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KPICard({
  label,
  value,
  color,
  bg,
  border,
}: {
  label: string;
  value: string;
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

function CotizacionBadge({ status }: { status: string }) {
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
