"use client";

import { useState, useEffect } from "react";
import type { TipoFreno, ItemCotizacion } from "@/lib/types";
import { fetchTipoCambio } from "@/lib/inventario";
import BrakeSelector from "@/components/BrakeSelector";
import KitConfigurator from "@/components/KitConfigurator";
import ExchangeRateInput from "@/components/ExchangeRateInput";
import QuotationPreview from "@/components/QuotationPreview";

export default function VentasFrenosPage() {
  const [tipoFreno, setTipoFreno] = useState<TipoFreno | null>(null);
  const [tipoCambio, setTipoCambio] = useState(17.25);
  const [items, setItems] = useState<ItemCotizacion[]>([]);

  // Cargar tipo de cambio de Supabase al montar
  useEffect(() => {
    fetchTipoCambio().then(setTipoCambio);
  }, []);

  // Recalcular precios MXN cuando cambia el tipo de cambio
  useEffect(() => {
    if (items.length === 0) return;
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        precio_unitario_mxn: item.precio_unitario_usd * tipoCambio,
        subtotal: item.cantidad * item.precio_unitario_usd * tipoCambio,
      }))
    );
    // Solo recalcular cuando cambia tipoCambio, no items
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipoCambio]);

  const handleTipoFrenoChange = (tipo: TipoFreno) => {
    setTipoFreno(tipo);
    setItems([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Ventas de Frenos</h1>
            <p className="text-sm text-gray-500">Cotizador de kits y piezas para retarders</p>
          </div>
          <ExchangeRateInput value={tipoCambio} onChange={setTipoCambio} />
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Paso 1: Selector de tipo de freno */}
        <BrakeSelector selected={tipoFreno} onSelect={handleTipoFrenoChange} />

        {/* Paso 2: Configurador de kit (visible solo si hay tipo seleccionado) */}
        {tipoFreno && (
          <KitConfigurator
            tipoFreno={tipoFreno}
            tipoCambio={tipoCambio}
            items={items}
            onItemsChange={setItems}
          />
        )}

        {/* Paso 3: Vista previa de cotización */}
        {tipoFreno && (
          <QuotationPreview items={items} tipoCambio={tipoCambio} />
        )}
      </main>
    </div>
  );
}
