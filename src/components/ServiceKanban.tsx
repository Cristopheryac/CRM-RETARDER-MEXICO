"use client";

import { useState, useCallback, useRef } from "react";
import type { OrdenServicio } from "@/lib/types";
import { ETAPA_NOMBRES, TOTAL_ETAPAS } from "@/lib/types";
import {
  PRIORIDAD_COLORS,
  PRIORIDAD_BADGE,
  validateTransition,
  moveToNextStage,
} from "@/lib/pipeline";
import OrderDetailModal from "./OrderDetailModal";

interface ServiceKanbanProps {
  initialOrdenes: OrdenServicio[];
}

const TIPO_SERVICIO_ICONS: Record<string, string> = {
  instalacion: "🔧",
  preventivo: "🛡️",
  correctivo: "⚠️",
};

export default function ServiceKanban({ initialOrdenes }: ServiceKanbanProps) {
  const [ordenes, setOrdenes] = useState<OrdenServicio[]>(initialOrdenes);
  const [selectedOrden, setSelectedOrden] = useState<OrdenServicio | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback(
    (message: string, type: "success" | "error") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    },
    []
  );

  // ── Drag & Drop handlers ──

  function handleDragStart(e: React.DragEvent, ordenId: string) {
    setDraggedId(ordenId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", ordenId);
  }

  function handleDragOver(e: React.DragEvent, etapa: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverStage(etapa);
  }

  function handleDragLeave() {
    setDragOverStage(null);
  }

  function handleDrop(e: React.DragEvent, targetEtapa: number) {
    e.preventDefault();
    setDragOverStage(null);

    const ordenId = e.dataTransfer.getData("text/plain");
    const orden = ordenes.find((o) => o.id === ordenId);
    if (!orden || orden.etapa === targetEtapa) {
      setDraggedId(null);
      return;
    }

    // Solo avanzar una etapa a la vez, o retroceder
    if (targetEtapa > orden.etapa + 1) {
      showToast("Solo se puede avanzar una etapa a la vez.", "error");
      setDraggedId(null);
      return;
    }

    if (targetEtapa > orden.etapa) {
      const validation = validateTransition(orden, targetEtapa);
      if (!validation.valid) {
        showToast(validation.errors[0], "error");
        setDraggedId(null);
        return;
      }
    }

    // Mover
    const updated = ordenes.map((o) =>
      o.id === ordenId
        ? {
            ...o,
            etapa: targetEtapa,
            etapa_nombre: ETAPA_NOMBRES[targetEtapa] || `Etapa ${targetEtapa}`,
          }
        : o
    );
    setOrdenes(updated);
    showToast(
      `${orden.folio} movida a ${ETAPA_NOMBRES[targetEtapa]}`,
      "success"
    );
    setDraggedId(null);
  }

  function handleDragEnd() {
    setDraggedId(null);
    setDragOverStage(null);
  }

  // ── Advance from modal ──

  function handleAdvance(orden: OrdenServicio) {
    const result = moveToNextStage(orden, ordenes, setOrdenes);
    if (result.valid) {
      showToast(
        `${orden.folio} avanzada a etapa ${orden.etapa + 1}`,
        "success"
      );
      // Re-select updated order
      setSelectedOrden((prev) =>
        prev
          ? {
              ...prev,
              etapa: prev.etapa + 1,
              etapa_nombre:
                ETAPA_NOMBRES[prev.etapa + 1] || `Etapa ${prev.etapa + 1}`,
            }
          : null
      );
    }
    return result;
  }

  // ── Render ──

  const etapas = Array.from({ length: TOTAL_ETAPAS }, (_, i) => i + 1);

  return (
    <div className="relative">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[60] px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all ${
            toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Kanban Board */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-4 px-1"
        style={{ minHeight: "calc(100vh - 200px)" }}
      >
        {etapas.map((etapa) => {
          const columnOrdenes = ordenes.filter((o) => o.etapa === etapa);
          const isDragOver = dragOverStage === etapa;

          return (
            <div
              key={etapa}
              className={`flex-shrink-0 w-64 rounded-xl border transition-colors ${
                isDragOver
                  ? "border-brand-400 bg-brand-50/50"
                  : "border-gray-200 bg-gray-50/80"
              }`}
              onDragOver={(e) => handleDragOver(e, etapa)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, etapa)}
            >
              {/* Column header */}
              <div className="px-3 py-2.5 border-b border-gray-200 bg-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] font-bold">
                      {etapa}
                    </span>
                    <h3 className="text-xs font-semibold text-gray-800 leading-tight">
                      {ETAPA_NOMBRES[etapa]}
                    </h3>
                  </div>
                  <span className="text-xs font-medium text-gray-400 bg-gray-100 rounded-full px-1.5 py-0.5">
                    {columnOrdenes.length}
                  </span>
                </div>
              </div>

              {/* Cards */}
              <div className="p-2 space-y-2 min-h-[120px]">
                {columnOrdenes.map((orden) => {
                  const colors = PRIORIDAD_COLORS[orden.prioridad];
                  const isDragging = draggedId === orden.id;

                  return (
                    <div
                      key={orden.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, orden.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => setSelectedOrden(orden)}
                      className={`rounded-lg border p-2.5 cursor-pointer transition-all hover:shadow-md ${
                        isDragging
                          ? "opacity-40 scale-95"
                          : `${colors.bg} ${colors.border} hover:border-brand-400`
                      }`}
                    >
                      {/* Card header */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-gray-800">
                          {orden.folio}
                        </span>
                        <span className="text-sm">
                          {TIPO_SERVICIO_ICONS[orden.tipo_servicio] || "📋"}
                        </span>
                      </div>

                      {/* Company */}
                      <p className="text-xs font-medium text-gray-700 truncate mb-1">
                        {orden.empresa_nombre}
                      </p>

                      {/* Vehicle */}
                      {orden.vehiculo_marca && (
                        <p className="text-[10px] text-gray-500 truncate mb-1.5">
                          {orden.vehiculo_marca} {orden.vehiculo_modelo}{" "}
                          {orden.vehiculo_placas && `· ${orden.vehiculo_placas}`}
                        </p>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${
                            PRIORIDAD_BADGE[orden.prioridad]
                          }`}
                        >
                          {orden.prioridad}
                        </span>
                        {orden.tecnico_nombre && (
                          <span className="text-[10px] text-gray-500 truncate max-w-[80px]">
                            {orden.tecnico_nombre.split(" ")[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Empty state */}
                {columnOrdenes.length === 0 && (
                  <div className="flex items-center justify-center h-20 text-xs text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                    Sin órdenes
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail modal */}
      {selectedOrden && (
        <OrderDetailModal
          orden={selectedOrden}
          onClose={() => setSelectedOrden(null)}
          onAdvance={handleAdvance}
        />
      )}
    </div>
  );
}
