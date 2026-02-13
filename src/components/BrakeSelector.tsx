"use client";

import type { TipoFreno } from "@/lib/types";
import { BRAKE_TYPE_LABELS, BRAKE_TYPE_DESCRIPTIONS } from "@/lib/types";

const BRAKE_TYPES: TipoFreno[] = ["jacobs", "escape", "electromagnetico"];

interface BrakeSelectorProps {
  selected: TipoFreno | null;
  onSelect: (tipo: TipoFreno) => void;
}

export default function BrakeSelector({ selected, onSelect }: BrakeSelectorProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">1. Tipo de Freno</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {BRAKE_TYPES.map((tipo) => {
          const isActive = selected === tipo;
          return (
            <button
              key={tipo}
              onClick={() => onSelect(tipo)}
              className={`text-left p-4 rounded-lg border-2 transition-all ${
                isActive
                  ? "border-blue-600 bg-blue-50 shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <span
                className={`text-sm font-semibold ${
                  isActive ? "text-blue-700" : "text-gray-800"
                }`}
              >
                {BRAKE_TYPE_LABELS[tipo]}
              </span>
              <p className="text-xs text-gray-500 mt-1">
                {BRAKE_TYPE_DESCRIPTIONS[tipo]}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
