"use client";

import { useState } from "react";
import ServiceKanban from "@/components/ServiceKanban";
import { DEMO_ORDENES } from "@/lib/demo-data";
import { ETAPA_NOMBRES, TOTAL_ETAPAS } from "@/lib/types";

type FilterPrioridad = "todas" | "urgente" | "alta" | "normal" | "baja";
type FilterTipo = "todos" | "instalacion" | "preventivo" | "correctivo";

export default function ServiciosPage() {
  const [filterPrioridad, setFilterPrioridad] = useState<FilterPrioridad>("todas");
  const [filterTipo, setFilterTipo] = useState<FilterTipo>("todos");
  const [searchTerm, setSearchTerm] = useState("");

  const ordenesFiltradas = DEMO_ORDENES.filter((o) => {
    if (filterPrioridad !== "todas" && o.prioridad !== filterPrioridad)
      return false;
    if (filterTipo !== "todos" && o.tipo_servicio !== filterTipo) return false;
    if (
      searchTerm &&
      !o.folio.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !o.empresa_nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    return true;
  });

  // Resumen rápido
  const totalOrdenes = DEMO_ORDENES.length;
  const enProgreso = DEMO_ORDENES.filter(
    (o) => o.etapa >= 7 && o.etapa <= 9
  ).length;
  const urgentes = DEMO_ORDENES.filter(
    (o) => o.prioridad === "urgente" || o.prioridad === "alta"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-[1800px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Pipeline de Servicios
              </h1>
              <p className="text-sm text-gray-500">
                Gestión de órdenes — {TOTAL_ETAPAS} etapas del proceso
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex gap-4">
              <QuickStat label="Total" value={totalOrdenes} color="text-gray-900" />
              <QuickStat label="En progreso" value={enProgreso} color="text-brand-600" />
              <QuickStat label="Urgentes" value={urgentes} color="text-red-600" />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Buscar por folio o empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent w-64"
            />

            <select
              value={filterPrioridad}
              onChange={(e) =>
                setFilterPrioridad(e.target.value as FilterPrioridad)
              }
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="todas">Todas las prioridades</option>
              <option value="urgente">Urgente</option>
              <option value="alta">Alta</option>
              <option value="normal">Normal</option>
              <option value="baja">Baja</option>
            </select>

            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value as FilterTipo)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="todos">Todos los tipos</option>
              <option value="instalacion">Instalación</option>
              <option value="preventivo">Preventivo</option>
              <option value="correctivo">Correctivo</option>
            </select>

            {(filterPrioridad !== "todas" ||
              filterTipo !== "todos" ||
              searchTerm) && (
              <button
                onClick={() => {
                  setFilterPrioridad("todas");
                  setFilterTipo("todos");
                  setSearchTerm("");
                }}
                className="text-xs text-brand-600 hover:text-brand-800 font-medium underline"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Leyenda etapas */}
      <div className="max-w-[1800px] mx-auto px-4 py-2">
        <div className="flex items-center gap-1 overflow-x-auto text-[10px] text-gray-500 pb-1">
          {Array.from({ length: TOTAL_ETAPAS }, (_, i) => (
            <span key={i} className="flex-shrink-0 bg-white rounded px-1.5 py-0.5 border border-gray-100">
              <strong className="text-brand-600">{i + 1}</strong>{" "}
              {ETAPA_NOMBRES[i + 1]}
            </span>
          ))}
        </div>
      </div>

      {/* Kanban */}
      <div className="max-w-[1800px] mx-auto px-4 py-2">
        <ServiceKanban initialOrdenes={ordenesFiltradas} />
      </div>
    </div>
  );
}

function QuickStat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="text-center">
      <p className={`text-lg font-bold ${color}`}>{value}</p>
      <p className="text-[10px] text-gray-500 uppercase tracking-wide">
        {label}
      </p>
    </div>
  );
}
