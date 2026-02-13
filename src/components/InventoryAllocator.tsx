"use client";

import type { InventoryMovement } from "@/lib/types";

interface InventoryAllocatorProps {
  ordenId: string;
  movimientos: InventoryMovement[];
  tipoFreno: string;
}

const TIPO_LABELS: Record<string, { label: string; color: string }> = {
  apartado: { label: "Apartado", color: "bg-yellow-100 text-yellow-800" },
  descontado: { label: "Descontado", color: "bg-red-100 text-red-800" },
  liberado: { label: "Liberado", color: "bg-green-100 text-green-800" },
};

export default function InventoryAllocator({
  movimientos,
  tipoFreno,
}: InventoryAllocatorProps) {
  if (movimientos.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Inventario
        </h4>
        <p className="text-sm text-gray-500">
          Sin movimientos de inventario para esta orden.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Se apartará al iniciar servicio (etapa 7) y se descontará al concluir (etapa 9).
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">
        Movimientos de Inventario — {tipoFreno}
      </h4>
      <div className="space-y-2">
        {movimientos.map((mov) => {
          const tipo = TIPO_LABELS[mov.tipo] || {
            label: mov.tipo,
            color: "bg-gray-100 text-gray-800",
          };
          return (
            <div
              key={mov.id}
              className="flex items-center justify-between gap-3 rounded-md border border-gray-100 bg-gray-50 px-3 py-2"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {mov.pieza_descripcion}
                </p>
                <p className="text-xs text-gray-500">
                  Cant: {mov.cantidad} — {mov.fecha}
                </p>
              </div>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${tipo.color}`}
              >
                {tipo.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
