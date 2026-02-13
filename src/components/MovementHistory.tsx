"use client";

import { useState, useMemo } from "react";
import type { InventoryMovement } from "@/lib/types";

interface MovementHistoryProps {
  movimientos: InventoryMovement[];
}

type FilterTipo = "todos" | "entrada" | "apartado" | "descontado" | "liberado";

const TIPO_LABELS: Record<string, { label: string; color: string }> = {
  entrada: { label: "Entrada", color: "bg-green-100 text-green-800" },
  apartado: { label: "Apartado", color: "bg-yellow-100 text-yellow-800" },
  descontado: { label: "Descontado", color: "bg-red-100 text-red-800" },
  liberado: { label: "Liberado", color: "bg-blue-100 text-blue-800" },
};

export default function MovementHistory({ movimientos }: MovementHistoryProps) {
  const [filterTipo, setFilterTipo] = useState<FilterTipo>("todos");
  const [filterFecha, setFilterFecha] = useState("");
  const [filterOrden, setFilterOrden] = useState("");

  const filtered = useMemo(() => {
    let result = [...movimientos].sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );

    if (filterTipo !== "todos") {
      result = result.filter((m) => m.tipo === filterTipo);
    }
    if (filterFecha) {
      result = result.filter((m) => m.fecha === filterFecha);
    }
    if (filterOrden.trim()) {
      const q = filterOrden.toLowerCase();
      result = result.filter((m) =>
        m.orden_servicio_id.toLowerCase().includes(q)
      );
    }

    return result.slice(0, 100);
  }, [movimientos, filterTipo, filterFecha, filterOrden]);

  function exportToCSV() {
    const headers = ["Fecha", "Tipo", "Pieza", "Cantidad", "Orden"];
    const rows = filtered.map((m) => [
      m.fecha,
      TIPO_LABELS[m.tipo]?.label || m.tipo,
      `"${m.pieza_descripcion}"`,
      m.cantidad.toString(),
      m.orden_servicio_id || "—",
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `movimientos_inventario_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Stats
  const entradas = movimientos.filter((m) => m.tipo === "entrada").length;
  const apartados = movimientos.filter((m) => m.tipo === "apartado").length;
  const descontados = movimientos.filter((m) => m.tipo === "descontado").length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Historial de Movimientos
            </h2>
            <div className="flex gap-3 mt-1 text-xs text-gray-500">
              <span>{entradas} entradas</span>
              <span>{apartados} apartados</span>
              <span>{descontados} descontados</span>
            </div>
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg border border-brand-200 transition-colors"
          >
            <span>📊</span>
            Exportar CSV
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value as FilterTipo)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="todos">Todos los tipos</option>
            <option value="entrada">Entrada</option>
            <option value="apartado">Apartado</option>
            <option value="descontado">Descontado</option>
            <option value="liberado">Liberado</option>
          </select>

          <input
            type="date"
            value={filterFecha}
            onChange={(e) => setFilterFecha(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />

          <input
            type="text"
            placeholder="Filtrar por orden..."
            value={filterOrden}
            onChange={(e) => setFilterOrden(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />

          {(filterTipo !== "todos" || filterFecha || filterOrden) && (
            <button
              onClick={() => {
                setFilterTipo("todos");
                setFilterFecha("");
                setFilterOrden("");
              }}
              className="text-xs text-brand-600 hover:text-brand-800 font-medium underline self-center"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-50">
            <tr>
              <th className="px-4 py-2.5 font-semibold text-gray-600 text-xs uppercase tracking-wide text-left">
                Fecha
              </th>
              <th className="px-4 py-2.5 font-semibold text-gray-600 text-xs uppercase tracking-wide text-left">
                Tipo
              </th>
              <th className="px-4 py-2.5 font-semibold text-gray-600 text-xs uppercase tracking-wide text-left">
                Pieza
              </th>
              <th className="px-4 py-2.5 font-semibold text-gray-600 text-xs uppercase tracking-wide text-right">
                Cant.
              </th>
              <th className="px-4 py-2.5 font-semibold text-gray-600 text-xs uppercase tracking-wide text-left">
                Orden
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((m) => {
              const tipoInfo = TIPO_LABELS[m.tipo] || {
                label: m.tipo,
                color: "bg-gray-100 text-gray-600",
              };
              return (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2 text-gray-600 font-mono text-xs">
                    {m.fecha}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${tipoInfo.color}`}
                    >
                      {tipoInfo.label}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-700 truncate max-w-[300px]">
                    {m.pieza_descripcion}
                  </td>
                  <td className="px-4 py-2 text-right font-medium text-gray-800">
                    {m.tipo === "entrada" ? "+" : "−"}{m.cantidad}
                  </td>
                  <td className="px-4 py-2 text-gray-500 font-mono text-xs">
                    {m.orden_servicio_id || "—"}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  Sin movimientos que coincidan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
