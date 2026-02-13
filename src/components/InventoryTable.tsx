"use client";

import { useState, useMemo } from "react";
import type { Pieza, TipoFreno } from "@/lib/types";

interface InventoryTableProps {
  piezas: Pieza[];
}

type FilterCategoria = "todas" | TipoFreno | "universal";

export default function InventoryTable({ piezas }: InventoryTableProps) {
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState<FilterCategoria>("todas");
  const [sortCol, setSortCol] = useState<keyof Pieza>("numero_parte");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = useMemo(() => {
    let result = piezas;

    if (categoria !== "todas") {
      result = result.filter((p) => p.tipo_freno === categoria);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.numero_parte.toLowerCase().includes(q) ||
          p.descripcion.toLowerCase().includes(q)
      );
    }

    result = [...result].sort((a, b) => {
      const aVal = a[sortCol];
      const bVal = b[sortCol];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    return result;
  }, [piezas, search, categoria, sortCol, sortDir]);

  function handleSort(col: keyof Pieza) {
    if (sortCol === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  }

  function getStockIndicator(p: Pieza): { icon: string; bg: string; tooltip: string } {
    if (p.stock_total < p.stock_minimo) {
      return { icon: "🔴", bg: "bg-red-50", tooltip: "Stock total por debajo del mínimo" };
    }
    if (p.stock_disponible < p.stock_minimo) {
      return { icon: "🟡", bg: "bg-yellow-50", tooltip: "Stock disponible por debajo del mínimo" };
    }
    return { icon: "🟢", bg: "", tooltip: "Stock OK" };
  }

  const criticas = piezas.filter((p) => p.stock_total < p.stock_minimo).length;
  const bajas = piezas.filter(
    (p) => p.stock_disponible < p.stock_minimo && p.stock_total >= p.stock_minimo
  ).length;

  const SortIcon = ({ col }: { col: keyof Pieza }) => (
    <span className="ml-1 text-[10px] text-gray-400">
      {sortCol === col ? (sortDir === "asc" ? "▲" : "▼") : "⇅"}
    </span>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">Inventario de Piezas</h2>
          <div className="flex gap-2 text-xs">
            {criticas > 0 && (
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                🔴 {criticas} críticas
              </span>
            )}
            {bajas > 0 && (
              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                🟡 {bajas} bajas
              </span>
            )}
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
              {filtered.length} piezas
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Buscar por # parte o descripción..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value as FilterCategoria)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="todas">Todas las categorías</option>
            <option value="jacobs">Jacobs</option>
            <option value="escape">Escape</option>
            <option value="electromagnetico">Electromagnético</option>
            <option value="universal">Universal</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-2.5 font-semibold text-gray-600 text-xs uppercase tracking-wide w-8"></th>
              <th
                className="px-4 py-2.5 font-semibold text-gray-600 text-xs uppercase tracking-wide cursor-pointer hover:text-brand-600"
                onClick={() => handleSort("numero_parte")}
              >
                # Parte <SortIcon col="numero_parte" />
              </th>
              <th
                className="px-4 py-2.5 font-semibold text-gray-600 text-xs uppercase tracking-wide cursor-pointer hover:text-brand-600"
                onClick={() => handleSort("descripcion")}
              >
                Descripción <SortIcon col="descripcion" />
              </th>
              <th className="px-4 py-2.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Categoría</th>
              <th
                className="px-4 py-2.5 font-semibold text-gray-600 text-xs uppercase tracking-wide text-right cursor-pointer hover:text-brand-600"
                onClick={() => handleSort("stock_total")}
              >
                Stock <SortIcon col="stock_total" />
              </th>
              <th className="px-4 py-2.5 font-semibold text-gray-600 text-xs uppercase tracking-wide text-right">
                Apartado
              </th>
              <th
                className="px-4 py-2.5 font-semibold text-gray-600 text-xs uppercase tracking-wide text-right cursor-pointer hover:text-brand-600"
                onClick={() => handleSort("stock_disponible")}
              >
                Disponible <SortIcon col="stock_disponible" />
              </th>
              <th className="px-4 py-2.5 font-semibold text-gray-600 text-xs uppercase tracking-wide text-right">
                Mínimo
              </th>
              <th className="px-4 py-2.5 font-semibold text-gray-600 text-xs uppercase tracking-wide text-right">
                USD
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((p) => {
              const ind = getStockIndicator(p);
              return (
                <tr key={p.id} className={`hover:bg-gray-50 transition-colors ${ind.bg}`}>
                  <td className="px-4 py-2 text-center" title={ind.tooltip}>
                    {ind.icon}
                  </td>
                  <td className="px-4 py-2 font-mono text-xs font-medium text-gray-800">
                    {p.numero_parte}
                  </td>
                  <td className="px-4 py-2 text-gray-700">{p.descripcion}</td>
                  <td className="px-4 py-2">
                    <CategoriaTag tipo={p.tipo_freno} />
                  </td>
                  <td className={`px-4 py-2 text-right font-medium ${p.stock_total < p.stock_minimo ? "text-red-700 font-bold" : "text-gray-800"}`}>
                    {p.stock_total}
                  </td>
                  <td className="px-4 py-2 text-right text-gray-500">
                    {p.stock_apartado > 0 ? p.stock_apartado : "—"}
                  </td>
                  <td className={`px-4 py-2 text-right font-medium ${p.stock_disponible < p.stock_minimo ? "text-yellow-700 font-bold" : "text-gray-800"}`}>
                    {p.stock_disponible}
                  </td>
                  <td className="px-4 py-2 text-right text-gray-500">{p.stock_minimo}</td>
                  <td className="px-4 py-2 text-right font-medium text-gray-800">
                    ${p.precio_usd.toFixed(2)}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                  No se encontraron piezas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const CAT_COLORS: Record<string, string> = {
  jacobs: "bg-blue-100 text-blue-800",
  escape: "bg-purple-100 text-purple-800",
  electromagnetico: "bg-amber-100 text-amber-800",
  universal: "bg-gray-100 text-gray-600",
};

const CAT_LABELS: Record<string, string> = {
  jacobs: "Jacobs",
  escape: "Escape",
  electromagnetico: "Electromag.",
  universal: "Universal",
};

function CategoriaTag({ tipo }: { tipo: string }) {
  return (
    <span
      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${CAT_COLORS[tipo] || "bg-gray-100 text-gray-600"}`}
    >
      {CAT_LABELS[tipo] || tipo}
    </span>
  );
}
