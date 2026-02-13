"use client";

import { useEffect, useState } from "react";
import type { TipoFreno, Kit, Pieza, ItemCotizacion } from "@/lib/types";
import { BRAKE_TYPE_LABELS } from "@/lib/types";
import { fetchPiezas, fetchKits } from "@/lib/inventario";

interface KitConfiguratorProps {
  tipoFreno: TipoFreno;
  tipoCambio: number;
  items: ItemCotizacion[];
  onItemsChange: (items: ItemCotizacion[]) => void;
}

export default function KitConfigurator({
  tipoFreno,
  tipoCambio,
  items,
  onItemsChange,
}: KitConfiguratorProps) {
  const [kits, setKits] = useState<Kit[]>([]);
  const [piezas, setPiezas] = useState<Pieza[]>([]);
  const [loading, setLoading] = useState(true);
  const [manoObraUsd, setManoObraUsd] = useState(350);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchKits(tipoFreno), fetchPiezas(tipoFreno)]).then(
      ([k, p]) => {
        setKits(k);
        setPiezas(p);
        setLoading(false);
      }
    );
  }, [tipoFreno]);

  const addKit = (kit: Kit) => {
    if (items.some((i) => i.kit_id === kit.id)) return;
    const newItem: ItemCotizacion = {
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      tipo: "kit",
      kit_id: kit.id,
      descripcion: kit.nombre,
      cantidad: 1,
      precio_unitario_usd: kit.precio_usd,
      precio_unitario_mxn: kit.precio_usd * tipoCambio,
      subtotal: kit.precio_usd * tipoCambio,
    };
    onItemsChange([...items, newItem]);
  };

  const addPieza = (pieza: Pieza) => {
    const existing = items.find((i) => i.pieza_id === pieza.id);
    if (existing) {
      onItemsChange(
        items.map((i) =>
          i.id === existing.id
            ? {
                ...i,
                cantidad: i.cantidad + 1,
                subtotal: (i.cantidad + 1) * pieza.precio_usd * tipoCambio,
              }
            : i
        )
      );
      return;
    }
    const newItem: ItemCotizacion = {
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      tipo: "pieza",
      pieza_id: pieza.id,
      descripcion: `${pieza.descripcion} (${pieza.numero_parte})`,
      cantidad: 1,
      precio_unitario_usd: pieza.precio_usd,
      precio_unitario_mxn: pieza.precio_usd * tipoCambio,
      subtotal: pieza.precio_usd * tipoCambio,
    };
    onItemsChange([...items, newItem]);
  };

  const updateManoObra = () => {
    const filtered = items.filter((i) => i.tipo !== "mano_obra");
    const moItem: ItemCotizacion = {
      id: "mano-obra",
      tipo: "mano_obra",
      descripcion: "Mano de obra — instalación / servicio",
      cantidad: 1,
      precio_unitario_usd: manoObraUsd,
      precio_unitario_mxn: manoObraUsd * tipoCambio,
      subtotal: manoObraUsd * tipoCambio,
    };
    onItemsChange([...filtered, moItem]);
  };

  const removeItem = (id: string) => {
    onItemsChange(items.filter((i) => i.id !== id));
  };

  const updateCantidad = (id: string, cantidad: number) => {
    if (cantidad < 1) return;
    onItemsChange(
      items.map((i) =>
        i.id === id
          ? {
              ...i,
              cantidad,
              subtotal: cantidad * i.precio_unitario_usd * tipoCambio,
              precio_unitario_mxn: i.precio_unitario_usd * tipoCambio,
            }
          : i
      )
    );
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Cargando inventario para {BRAKE_TYPE_LABELS[tipoFreno]}...
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">
        2. Configurar Kit — {BRAKE_TYPE_LABELS[tipoFreno]}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Panel izquierdo: catálogo */}
        <div className="space-y-4">
          {/* Kits completos */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Kits completos
            </h3>
            <div className="space-y-2">
              {kits.map((kit) => {
                const added = items.some((i) => i.kit_id === kit.id);
                return (
                  <div
                    key={kit.id}
                    className="flex items-center justify-between gap-2 p-2 rounded border border-gray-100 hover:bg-gray-50"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {kit.nombre}
                      </p>
                      <p className="text-xs text-gray-500">
                        USD ${kit.precio_usd.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => addKit(kit)}
                      disabled={added}
                      className={`shrink-0 px-3 py-1 text-xs rounded-md font-medium ${
                        added
                          ? "bg-green-100 text-green-700 cursor-default"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {added ? "Agregado" : "Agregar"}
                    </button>
                  </div>
                );
              })}
              {kits.length === 0 && (
                <p className="text-xs text-gray-400">
                  No hay kits disponibles para este tipo de freno
                </p>
              )}
            </div>
          </div>

          {/* Piezas individuales */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Piezas individuales
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {piezas.map((pieza) => (
                <div
                  key={pieza.id}
                  className="flex items-center justify-between gap-2 p-2 rounded border border-gray-100 hover:bg-gray-50"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {pieza.descripcion}
                    </p>
                    <p className="text-xs text-gray-500">
                      {pieza.numero_parte} · USD ${pieza.precio_usd.toFixed(2)}{" "}
                      · Stock: {pieza.stock_disponible}
                    </p>
                  </div>
                  <button
                    onClick={() => addPieza(pieza)}
                    disabled={pieza.stock_disponible === 0}
                    className={`shrink-0 px-3 py-1 text-xs rounded-md font-medium ${
                      pieza.stock_disponible === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {pieza.stock_disponible === 0 ? "Agotado" : "+ Agregar"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Mano de obra */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Mano de obra
            </h3>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500">USD $</label>
              <input
                type="number"
                step="50"
                min="0"
                value={manoObraUsd}
                onChange={(e) =>
                  setManoObraUsd(Math.max(0, parseFloat(e.target.value) || 0))
                }
                className="w-28 px-2 py-1 border border-gray-300 rounded text-sm text-right font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={updateManoObra}
                className="px-3 py-1 text-xs rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700"
              >
                {items.some((i) => i.tipo === "mano_obra")
                  ? "Actualizar"
                  : "Agregar"}
              </button>
            </div>
          </div>
        </div>

        {/* Panel derecho: items seleccionados */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Items seleccionados
          </h3>
          {items.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">
              Agrega kits, piezas o mano de obra del panel izquierdo
            </p>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-2 p-2 rounded border border-gray-100"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{item.descripcion}</p>
                    <p className="text-xs text-gray-500">
                      USD ${item.precio_unitario_usd.toFixed(2)} x{" "}
                      {item.cantidad} ={" "}
                      <span className="font-semibold text-gray-700">
                        MXN ${item.subtotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {item.tipo !== "mano_obra" && (
                      <>
                        <button
                          onClick={() =>
                            updateCantidad(item.id, item.cantidad - 1)
                          }
                          className="w-6 h-6 flex items-center justify-center rounded border border-gray-300 text-xs hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-mono">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() =>
                            updateCantidad(item.id, item.cantidad + 1)
                          }
                          className="w-6 h-6 flex items-center justify-center rounded border border-gray-300 text-xs hover:bg-gray-100"
                        >
                          +
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-1 w-6 h-6 flex items-center justify-center rounded text-red-500 hover:bg-red-50 text-xs"
                      title="Eliminar"
                    >
                      x
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
