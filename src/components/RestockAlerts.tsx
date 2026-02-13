"use client";

import type { Pieza } from "@/lib/types";

interface RestockAlertsProps {
  piezas: Pieza[];
}

export default function RestockAlerts({ piezas }: RestockAlertsProps) {
  const criticas = piezas.filter((p) => p.stock_total < p.stock_minimo);
  const bajas = piezas.filter(
    (p) =>
      p.stock_disponible < p.stock_minimo && p.stock_total >= p.stock_minimo
  );

  function generarOrdenCompra() {
    const items = [...criticas, ...bajas];
    if (items.length === 0) return;

    const now = new Date();
    const folio = `OC-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;

    // Generar contenido CSV como reporte de orden de compra
    const headers = [
      "# Parte",
      "Descripción",
      "Stock Actual",
      "Stock Mínimo",
      "Cantidad a Pedir",
      "Precio USD",
      "Subtotal USD",
    ];

    const rows = items.map((p) => {
      const cantPedir = Math.max(p.stock_minimo * 2 - p.stock_total, p.stock_minimo);
      const subtotal = cantPedir * p.precio_usd;
      return [
        p.numero_parte,
        `"${p.descripcion}"`,
        p.stock_total.toString(),
        p.stock_minimo.toString(),
        cantPedir.toString(),
        p.precio_usd.toFixed(2),
        subtotal.toFixed(2),
      ];
    });

    const totalUsd = rows.reduce((sum, r) => sum + parseFloat(r[6]), 0);

    const csv = [
      `Orden de Compra ${folio}`,
      `Fecha: ${now.toISOString().split("T")[0]}`,
      "",
      headers.join(","),
      ...rows.map((r) => r.join(",")),
      "",
      `,,,,,"TOTAL USD",$${totalUsd.toFixed(2)}`,
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${folio}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const allItems = [
    ...criticas.map((p) => ({ ...p, nivel: "critico" as const })),
    ...bajas.map((p) => ({ ...p, nivel: "bajo" as const })),
  ];

  if (allItems.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
        <div className="text-4xl mb-2">✅</div>
        <h3 className="text-lg font-bold text-gray-900">
          Inventario en orden
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Todas las piezas están por encima del stock mínimo.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Alertas de Reabastecimiento
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {allItems.length} pieza(s) requieren atención
            </p>
          </div>
          <button
            onClick={generarOrdenCompra}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
          >
            <span>📋</span>
            Generar Orden de Compra
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {allItems.map((p) => {
          const isCritico = p.nivel === "critico";
          const cantPedir = Math.max(
            p.stock_minimo * 2 - p.stock_total,
            p.stock_minimo
          );
          return (
            <div
              key={p.id}
              className={`px-4 py-3 flex items-center gap-4 ${
                isCritico ? "bg-red-50" : "bg-yellow-50"
              }`}
            >
              <span className="text-2xl flex-shrink-0">
                {isCritico ? "🔴" : "🟡"}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-gray-500">
                    {p.numero_parte}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isCritico
                        ? "bg-red-200 text-red-900"
                        : "bg-yellow-200 text-yellow-900"
                    }`}
                  >
                    {isCritico ? "CRÍTICO" : "BAJO"}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-800 truncate">
                  {p.descripcion}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-gray-500">
                  Stock: <strong className={isCritico ? "text-red-700" : "text-yellow-700"}>{p.stock_total}</strong> / Mín: {p.stock_minimo}
                </p>
                <p className="text-xs text-brand-600 font-medium mt-0.5">
                  Pedir: {cantPedir} uds
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
