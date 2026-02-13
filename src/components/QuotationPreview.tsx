"use client";

import type { ItemCotizacion } from "@/lib/types";

const IVA_RATE = 0.16;

interface QuotationPreviewProps {
  items: ItemCotizacion[];
  tipoCambio: number;
}

export default function QuotationPreview({
  items,
  tipoCambio,
}: QuotationPreviewProps) {
  const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);
  const iva = subtotal * IVA_RATE;
  const total = subtotal + iva;

  const hasKit = items.some((i) => i.tipo === "kit");
  const hasManoObra = items.some((i) => i.tipo === "mano_obra");
  const isComplete = items.length > 0 && (hasKit || items.some((i) => i.tipo === "pieza"));

  const handleGeneratePdf = () => {
    alert(
      "Generación de PDF pendiente de implementación.\n\n" +
        `Folio: COT-${new Date().getFullYear()}-XXXX\n` +
        `Items: ${items.length}\n` +
        `Total: MXN $${total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`
    );
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">3. Resumen de Cotización</h2>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        {/* Tabla de items */}
        {items.length > 0 ? (
          <table className="w-full text-sm mb-4">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs text-gray-500 uppercase">
                <th className="pb-2 font-medium">Concepto</th>
                <th className="pb-2 font-medium text-center">Cant.</th>
                <th className="pb-2 font-medium text-right">P.U. (USD)</th>
                <th className="pb-2 font-medium text-right">Subtotal (MXN)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-50">
                  <td className="py-2">
                    <span className="font-medium">{item.descripcion}</span>
                    <span className="ml-2 text-xs text-gray-400 uppercase">
                      {item.tipo === "mano_obra" ? "M.O." : item.tipo}
                    </span>
                  </td>
                  <td className="py-2 text-center">{item.cantidad}</td>
                  <td className="py-2 text-right font-mono">
                    ${item.precio_unitario_usd.toFixed(2)}
                  </td>
                  <td className="py-2 text-right font-mono font-medium">
                    ${item.subtotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-gray-400 text-center py-4">
            No hay items seleccionados
          </p>
        )}

        {/* Totales */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 pt-3 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-mono">
                MXN ${subtotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">IVA (16%)</span>
              <span className="font-mono">
                MXN ${iva.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold pt-1 border-t border-gray-100">
              <span>Total</span>
              <span className="font-mono text-blue-700">
                MXN ${total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <p className="text-xs text-gray-400 text-right">
              T.C. aplicado: 1 USD = {tipoCambio.toFixed(2)} MXN
            </p>
          </div>
        )}

        {/* Validaciones y botón */}
        {items.length > 0 && (
          <div className="mt-4 space-y-2">
            {!isComplete && (
              <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                Agrega al menos un kit o pieza para poder cotizar.
              </p>
            )}
            {!hasManoObra && (
              <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                Considera agregar mano de obra a la cotización.
              </p>
            )}
            <button
              onClick={handleGeneratePdf}
              disabled={!isComplete}
              className={`w-full py-3 rounded-lg font-semibold text-sm transition-all ${
                isComplete
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Generar Cotización PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
