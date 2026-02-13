import type { OrdenServicio, InventoryMovement, ArchivoAdjunto } from "./types";

// ── Reglas de validación por etapa ──

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// Archivos adjuntos simulados (en producción: Supabase Storage)
const archivosDemo: ArchivoAdjunto[] = [];

// Movimientos de inventario simulados
const movimientosDemo: InventoryMovement[] = [];

export function getArchivosOrden(ordenId: string): ArchivoAdjunto[] {
  return archivosDemo.filter((a) => a.orden_servicio_id === ordenId);
}

export function getMovimientosOrden(ordenId: string): InventoryMovement[] {
  return movimientosDemo.filter((m) => m.orden_servicio_id === ordenId);
}

export function addArchivo(archivo: ArchivoAdjunto): void {
  archivosDemo.push(archivo);
}

export function addMovimiento(movimiento: InventoryMovement): void {
  movimientosDemo.push(movimiento);
}

// ── Validaciones antes de avanzar de etapa ──

export function validateTransition(
  orden: OrdenServicio,
  targetStage: number
): ValidationResult {
  const errors: string[] = [];

  // Solo se puede avanzar una etapa a la vez (o retroceder libremente)
  if (targetStage > orden.etapa + 1) {
    errors.push("Solo se puede avanzar una etapa a la vez.");
  }

  // Etapa 3 → 4: Requiere PDF de Orden de Compra
  if (orden.etapa === 3 && targetStage === 4) {
    const tieneOC = archivosDemo.some(
      (a) => a.orden_servicio_id === orden.id && a.tipo === "pdf_oc"
    );
    if (!tieneOC) {
      errors.push("Se requiere subir el PDF de la Orden de Compra antes de aprobar la cotización.");
    }
  }

  // Etapa 6 → 7: Requiere técnico asignado
  if (orden.etapa === 6 && targetStage === 7) {
    if (!orden.tecnico_nombre) {
      errors.push("Se requiere un técnico asignado antes de iniciar el servicio.");
    }
  }

  // Etapa 9 → 10: Requiere evidencias fotográficas
  if (orden.etapa === 9 && targetStage === 10) {
    const tieneFotos = archivosDemo.some(
      (a) => a.orden_servicio_id === orden.id && a.tipo === "foto_evidencia"
    );
    if (!tieneFotos) {
      errors.push("Se requiere subir evidencias fotográficas antes de firmar y cerrar.");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ── Acciones especiales por etapa ──

export type StageAction = {
  label: string;
  icon: string;
  action: string;
  variant: "primary" | "success" | "warning" | "danger";
};

export function getStageActions(etapa: number): StageAction[] {
  const actions: StageAction[] = [];

  switch (etapa) {
    case 3:
      actions.push({
        label: "Subir Orden de Compra (PDF)",
        icon: "📄",
        action: "upload_oc",
        variant: "primary",
      });
      break;
    case 7:
      actions.push({
        label: "Iniciar Servicio",
        icon: "🔧",
        action: "iniciar_servicio",
        variant: "success",
      });
      break;
    case 9:
      actions.push({
        label: "Concluir Servicio",
        icon: "✅",
        action: "concluir_servicio",
        variant: "success",
      });
      break;
    case 10:
      actions.push({
        label: "Subir Evidencias (Fotos)",
        icon: "📸",
        action: "upload_evidencias",
        variant: "primary",
      });
      break;
    case 12:
      actions.push({
        label: "Enviar Encuesta",
        icon: "📋",
        action: "enviar_encuesta",
        variant: "warning",
      });
      break;
  }

  return actions;
}

// ── Ejecutar transición ──

export function moveToNextStage(
  orden: OrdenServicio,
  ordenes: OrdenServicio[],
  setOrdenes: (ordenes: OrdenServicio[]) => void
): ValidationResult {
  const targetStage = orden.etapa + 1;

  if (targetStage > 14) {
    return { valid: false, errors: ["La orden ya está en la etapa final."] };
  }

  const validation = validateTransition(orden, targetStage);

  if (!validation.valid) {
    return validation;
  }

  // Acciones especiales al entrar a ciertas etapas
  if (targetStage === 7) {
    // Apartar inventario al iniciar servicio
    addMovimiento({
      id: `mov-${Date.now()}`,
      orden_servicio_id: orden.id,
      pieza_id: "kit-default",
      pieza_descripcion: `Kit ${orden.tipo_freno} para ${orden.empresa_nombre}`,
      cantidad: 1,
      tipo: "apartado",
      fecha: new Date().toISOString().split("T")[0],
    });
  }

  if (targetStage === 9) {
    // Descontar inventario al concluir servicio
    addMovimiento({
      id: `mov-${Date.now()}`,
      orden_servicio_id: orden.id,
      pieza_id: "kit-default",
      pieza_descripcion: `Kit ${orden.tipo_freno} para ${orden.empresa_nombre}`,
      cantidad: 1,
      tipo: "descontado",
      fecha: new Date().toISOString().split("T")[0],
    });
  }

  // Actualizar etapa
  const { ETAPA_NOMBRES } = require("./types");
  const updated = ordenes.map((o) =>
    o.id === orden.id
      ? { ...o, etapa: targetStage, etapa_nombre: ETAPA_NOMBRES[targetStage] || `Etapa ${targetStage}` }
      : o
  );
  setOrdenes(updated);

  return { valid: true, errors: [] };
}

// ── Colores por prioridad ──

export const PRIORIDAD_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  urgente: { bg: "bg-red-50", text: "text-red-700", border: "border-red-300" },
  alta: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-300" },
  normal: { bg: "bg-green-50", text: "text-green-700", border: "border-green-300" },
  baja: { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" },
};

export const PRIORIDAD_BADGE: Record<string, string> = {
  urgente: "bg-red-100 text-red-800 border-red-200",
  alta: "bg-orange-100 text-orange-800 border-orange-200",
  normal: "bg-green-100 text-green-800 border-green-200",
  baja: "bg-gray-100 text-gray-600 border-gray-200",
};
