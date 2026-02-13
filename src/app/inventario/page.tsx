"use client";

import { useState } from "react";
import InventoryTable from "@/components/InventoryTable";
import MovementHistory from "@/components/MovementHistory";
import KitPanel from "@/components/KitPanel";
import RestockAlerts from "@/components/RestockAlerts";
import {
  getAllPiezas,
  getAllKits,
  fetchMovimientos,
  getPiezasCriticas,
  getPiezasBajas,
} from "@/lib/inventario";

type Tab = "piezas" | "movimientos" | "kits" | "alertas";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "piezas", label: "Piezas", icon: "🔩" },
  { key: "movimientos", label: "Movimientos", icon: "📦" },
  { key: "kits", label: "Kits", icon: "🛠️" },
  { key: "alertas", label: "Alertas", icon: "🚨" },
];

export default function InventarioPage() {
  const [activeTab, setActiveTab] = useState<Tab>("piezas");

  const piezas = getAllPiezas();
  const kits = getAllKits();
  const movimientos = fetchMovimientos();
  const criticas = getPiezasCriticas(piezas);
  const bajas = getPiezasBajas(piezas);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Control de Inventario
              </h1>
              <p className="text-sm text-gray-500">
                Piezas, kits y movimientos — Retarder México
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex gap-4">
              <StatCard label="Total piezas" value={piezas.length} color="text-gray-900" />
              <StatCard
                label="Críticas"
                value={criticas.length}
                color={criticas.length > 0 ? "text-red-600" : "text-green-600"}
              />
              <StatCard
                label="Bajas"
                value={bajas.length}
                color={bajas.length > 0 ? "text-yellow-600" : "text-green-600"}
              />
              <StatCard label="Kits" value={kits.length} color="text-brand-600" />
              <StatCard label="Movimientos" value={movimientos.length} color="text-gray-600" />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === tab.key
                    ? "bg-gray-100 text-brand-700 border-b-2 border-brand-600"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.key === "alertas" && criticas.length + bajas.length > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full inline-flex items-center justify-center">
                    {criticas.length + bajas.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === "piezas" && <InventoryTable piezas={piezas} />}
        {activeTab === "movimientos" && <MovementHistory movimientos={movimientos} />}
        {activeTab === "kits" && <KitPanel kits={kits} piezas={piezas} />}
        {activeTab === "alertas" && <RestockAlerts piezas={piezas} />}
      </main>
    </div>
  );
}

function StatCard({
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
      <p className="text-[10px] text-gray-500 uppercase tracking-wide">{label}</p>
    </div>
  );
}
