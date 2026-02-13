"use client";

interface ExchangeRateInputProps {
  value: number;
  onChange: (rate: number) => void;
}

export default function ExchangeRateInput({ value, onChange }: ExchangeRateInputProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Tipo de Cambio</h2>
      <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-200">
        <label className="text-sm text-gray-600 whitespace-nowrap">
          1 USD =
        </label>
        <input
          type="number"
          step="0.01"
          min="1"
          max="99"
          value={value}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            if (!isNaN(v) && v > 0) onChange(v);
          }}
          className="w-28 px-3 py-2 border border-gray-300 rounded-md text-right font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="text-sm text-gray-600">MXN</span>
      </div>
    </div>
  );
}
