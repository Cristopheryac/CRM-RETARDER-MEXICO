"use client";

import { useState } from "react";
import type { Kit, Pieza } from "@/lib/types";
import { validarStockKit } from "@/lib/inventario";

interface KitPanelProps {
  kits: Kit[];
  piezas: Pieza[];
}

const TIPO_COLORS: Record<string, string> = {
  jacobs: "border-blue-200 bg-blue-50",
  escape: "border-purple-200 bg-purple-50",
  electromagnetico: "border-amber-200 bg-amber-50",
};

const TIPO_LABELS: Record<string, string> = {
  jacobs: "Jacobs",
  escape: "Escape",
  electromagnetico: "Electromagnético",
};

export default function KitPanel({ kits, piezas }: KitPanelProps) {
  const [expandedKit, setExpandedKit] = useState<string | null>(null);

  function toggleKit(id: string) {
    setExpandedKit(expandedKit === id ? null : id);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Panel de Kits</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          {kits.length} kits disponibles — clic para ver composición
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {kits.map((kit) => {
          const isExpanded = expandedKit === kit.id;
          const validation = validarStockKit(kit, piezas);

          return (
            <div key={kit.id}>
              {/* Kit header */}
              <button
                onClick={() => toggleKit(kit.id)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                  isExpanded ? "bg-gray-50" : ""
                }`}
              >
                <span className="text-lg">
                  {isExpanded ? "▼" : "▶"}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        TIPO_COLORS[kit.tipo_freno] || "border-gray-200 bg-gray-50"
                      }`}
                    >
                      {TIPO_LABELS[kit.tipo_freno] || kit.tipo_freno}
                    </span>
                    <span className="text-sm font-medium text-gray-800 truncate">
                      {kit.nombre}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-sm font-bold text-gray-800">
                    ${kit.precio_usd.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
                  </span>
                  {validation.valido ? (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                      Stock OK
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                      Sin stock
                    </span>
                  )}
                </div>
              </button>

              {/* Kit composition */}
              {isExpanded && (
                <div className="px-4 pb-4 pl-12">
                  <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-100 text-left">
                          <th className="px-3 py-1.5 text-xs font-semibold text-gray-600 uppercase">
                            Pieza
                          </th>
                          <th className="px-3 py-1.5 text-xs font-semibold text-gray-600 uppercase text-center">
                            Necesario
                          </th>
                          <th className="px-3 py-1.5 text-xs font-semibold text-gray-600 uppercase text-center">
                            Disponible
                          </th>
                          <th className="px-3 py-1.5 text-xs font-semibold text-gray-600 uppercase text-center">
                            Estado
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {kit.piezas.map((kp) => {
                          const pieza = piezas.find((p) => p.id === kp.pieza_id);
                          const suficiente = pieza
                            ? pieza.stock_disponible >= kp.cantidad
                            : false;
                          return (
                            <tr key={kp.pieza_id} className={suficiente ? "" : "bg-red-50"}>
                              <td className="px-3 py-1.5 text-gray-700">
                                <span className="font-mono text-xs text-gray-500 mr-1">
                                  {pieza?.numero_parte || "?"}
                                </span>
                                {pieza?.descripcion || "No encontrada"}
                              </td>
                              <td className="px-3 py-1.5 text-center font-medium">
                                {kp.cantidad}
                              </td>
                              <td
                                className={`px-3 py-1.5 text-center font-medium ${
                                  suficiente ? "text-green-700" : "text-red-700"
                                }`}
                              >
                                {pieza?.stock_disponible ?? 0}
                              </td>
                              <td className="px-3 py-1.5 text-center">
                                {suficiente ? (
                                  <span className="text-green-600 text-xs">✓</span>
                                ) : (
                                  <span className="text-red-600 text-xs font-medium">
                                    Faltan {kp.cantidad - (pieza?.stock_disponible ?? 0)}
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {!validation.valido && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                      No es posible ensamblar este kit — faltan{" "}
                      {validation.faltantes.length} pieza(s).
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
