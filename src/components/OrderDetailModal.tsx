"use client";

import { useState } from "react";
import type { OrdenServicio } from "@/lib/types";
import { ETAPA_NOMBRES } from "@/lib/types";
import {
  getStageActions,
  PRIORIDAD_BADGE,
  getArchivosOrden,
  getMovimientosOrden,
  addArchivo,
  validateTransition,
} from "@/lib/pipeline";
import FileUploader from "./FileUploader";
import InventoryAllocator from "./InventoryAllocator";

interface OrderDetailModalProps {
  orden: OrdenServicio;
  onClose: () => void;
  onAdvance: (orden: OrdenServicio) => { valid: boolean; errors: string[] };
}

const TIPO_SERVICIO_LABELS: Record<string, string> = {
  instalacion: "Instalación",
  preventivo: "Preventivo",
  correctivo: "Correctivo",
};

const TIPO_FRENO_LABELS: Record<string, string> = {
  jacobs: "Jacobs Engine Brake",
  escape: "Freno de Escape",
  electromagnetico: "Retarder Electromagnético",
};

export default function OrderDetailModal({
  orden,
  onClose,
  onAdvance,
}: OrderDetailModalProps) {
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState("");

  const actions = getStageActions(orden.etapa);
  const archivos = getArchivosOrden(orden.id);
  const movimientos = getMovimientosOrden(orden.id);
  const prioridadClass = PRIORIDAD_BADGE[orden.prioridad] || "";

  // Validación previa para mostrar alertas
  const nextStage = orden.etapa + 1;
  const preValidation = nextStage <= 14 ? validateTransition(orden, nextStage) : null;

  function handleAdvance() {
    setErrors([]);
    setSuccess("");
    const result = onAdvance(orden);
    if (result.valid) {
      setSuccess(`Orden avanzada a etapa ${orden.etapa + 1}: ${ETAPA_NOMBRES[orden.etapa + 1]}`);
    } else {
      setErrors(result.errors);
    }
  }

  function handleFileUpload(tipo: "pdf_oc" | "foto_evidencia") {
    return (file: { nombre: string; url: string }) => {
      addArchivo({
        id: `arch-${Date.now()}`,
        orden_servicio_id: orden.id,
        nombre: file.nombre,
        tipo,
        url: file.url,
        fecha: new Date().toISOString().split("T")[0],
      });
      setErrors([]);
    };
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl z-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-gray-900">
                  {orden.folio}
                </h2>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full border ${prioridadClass}`}
                >
                  {orden.prioridad.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {orden.empresa_nombre}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none p-1"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Etapa actual */}
          <div className="bg-brand-50 rounded-lg px-4 py-3 border border-brand-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-brand-600 uppercase tracking-wide">
                  Etapa Actual
                </p>
                <p className="text-base font-semibold text-brand-900">
                  {orden.etapa}. {orden.etapa_nombre}
                </p>
              </div>
              <div className="text-2xl font-bold text-brand-600">
                {orden.etapa}/14
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-2 h-2 bg-brand-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-600 rounded-full transition-all"
                style={{ width: `${(orden.etapa / 14) * 100}%` }}
              />
            </div>
          </div>

          {/* Info del cliente y servicio */}
          <div className="grid grid-cols-2 gap-4">
            <InfoField label="Tipo de Servicio" value={TIPO_SERVICIO_LABELS[orden.tipo_servicio] || orden.tipo_servicio} />
            <InfoField label="Tipo de Freno" value={TIPO_FRENO_LABELS[orden.tipo_freno] || orden.tipo_freno} />
            <InfoField label="Técnico Asignado" value={orden.tecnico_nombre || "Sin asignar"} warn={!orden.tecnico_nombre} />
            <InfoField label="Vendedor" value={orden.vendedor_nombre || "—"} />
            {orden.vehiculo_marca && (
              <InfoField
                label="Vehículo"
                value={`${orden.vehiculo_marca} ${orden.vehiculo_modelo || ""} ${orden.vehiculo_placas ? `(${orden.vehiculo_placas})` : ""}`}
              />
            )}
            {orden.fecha_programada && (
              <InfoField label="Fecha Programada" value={orden.fecha_programada} />
            )}
          </div>

          {/* Alertas de validación */}
          {preValidation && !preValidation.valid && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm font-medium text-yellow-800 mb-1">
                Requisitos para avanzar a la siguiente etapa:
              </p>
              <ul className="list-disc list-inside text-sm text-yellow-700 space-y-0.5">
                {preValidation.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Acciones según etapa */}
          {actions.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">
                Acciones disponibles
              </h3>
              {actions.map((action) => {
                if (action.action === "upload_oc") {
                  return (
                    <FileUploader
                      key={action.action}
                      ordenId={orden.id}
                      tipo="pdf_oc"
                      onUpload={handleFileUpload("pdf_oc")}
                    />
                  );
                }
                if (action.action === "upload_evidencias") {
                  return (
                    <FileUploader
                      key={action.action}
                      ordenId={orden.id}
                      tipo="foto_evidencia"
                      onUpload={handleFileUpload("foto_evidencia")}
                      multiple
                    />
                  );
                }
                return (
                  <button
                    key={action.action}
                    onClick={() => {
                      // Acciones simuladas
                      setSuccess(`Acción "${action.label}" ejecutada correctamente.`);
                    }}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      action.variant === "success"
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : action.variant === "warning"
                        ? "bg-yellow-500 text-white hover:bg-yellow-600"
                        : action.variant === "danger"
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-brand-600 text-white hover:bg-brand-700"
                    }`}
                  >
                    <span>{action.icon}</span>
                    <span>{action.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Inventario */}
          <InventoryAllocator
            ordenId={orden.id}
            movimientos={movimientos}
            tipoFreno={TIPO_FRENO_LABELS[orden.tipo_freno] || orden.tipo_freno}
          />

          {/* Archivos adjuntos */}
          {archivos.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Archivos adjuntos
              </h3>
              <div className="space-y-1">
                {archivos.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-2 text-sm bg-gray-50 rounded px-3 py-2"
                  >
                    <span>{a.tipo === "pdf_oc" ? "📄" : "📸"}</span>
                    <span className="truncate flex-1">{a.nombre}</span>
                    <span className="text-xs text-gray-400">{a.fecha}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Errores */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <ul className="list-disc list-inside text-sm text-red-700 space-y-0.5">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Éxito */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
              {success}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-xl flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cerrar
          </button>
          {orden.etapa < 14 && (
            <button
              onClick={handleAdvance}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
            >
              Avanzar a Etapa {orden.etapa + 1}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoField({
  label,
  value,
  warn = false,
}: {
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </p>
      <p className={`text-sm font-medium ${warn ? "text-yellow-600" : "text-gray-900"}`}>
        {value}
      </p>
    </div>
  );
}
