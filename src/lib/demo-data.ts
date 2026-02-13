import type {
  OrdenServicio,
  CotizacionResumen,
  OrdenTrabajo,
  TipoFreno,
} from "./types";

// ── Datos demo para dashboards ──

export const DEMO_ORDENES: OrdenServicio[] = [
  { id: "os1", folio: "OS-2026-0001", empresa_nombre: "Transportes del Norte", tipo_servicio: "instalacion", tipo_freno: "jacobs", etapa: 8, etapa_nombre: "Servicio en Progreso", vehiculo_marca: "Kenworth", vehiculo_modelo: "T680", vehiculo_placas: "ABC-123", prioridad: "alta", fecha_programada: "2026-02-15", tecnico_nombre: "Miguel Torres", vendedor_nombre: "Pedro Sánchez", created_at: "2026-01-20" },
  { id: "os2", folio: "OS-2026-0002", empresa_nombre: "Fletes Mexicanos SA", tipo_servicio: "correctivo", tipo_freno: "escape", etapa: 3, etapa_nombre: "Cotización Enviada", vehiculo_marca: "Freightliner", vehiculo_modelo: "Cascadia", vehiculo_placas: "DEF-456", prioridad: "normal", tecnico_nombre: "Miguel Torres", vendedor_nombre: "Pedro Sánchez", created_at: "2026-02-01" },
  { id: "os3", folio: "OS-2026-0003", empresa_nombre: "Logística Central", tipo_servicio: "preventivo", tipo_freno: "electromagnetico", etapa: 6, etapa_nombre: "Programación", vehiculo_marca: "International", vehiculo_modelo: "LT", vehiculo_placas: "GHI-789", prioridad: "normal", fecha_programada: "2026-02-18", tecnico_nombre: "Miguel Torres", vendedor_nombre: "Pedro Sánchez", created_at: "2026-02-05" },
  { id: "os4", folio: "OS-2026-0004", empresa_nombre: "Transportes del Norte", tipo_servicio: "instalacion", tipo_freno: "jacobs", etapa: 11, etapa_nombre: "Facturación y Cierre", vehiculo_marca: "Peterbilt", vehiculo_modelo: "579", vehiculo_placas: "JKL-012", prioridad: "baja", tecnico_nombre: "Miguel Torres", vendedor_nombre: "Pedro Sánchez", created_at: "2025-12-10" },
  { id: "os5", folio: "OS-2026-0005", empresa_nombre: "Carga Express", tipo_servicio: "instalacion", tipo_freno: "jacobs", etapa: 1, etapa_nombre: "Contacto Inicial", prioridad: "normal", vendedor_nombre: "Pedro Sánchez", created_at: "2026-02-12" },
  { id: "os6", folio: "OS-2026-0006", empresa_nombre: "Mudanzas Rápidas", tipo_servicio: "correctivo", tipo_freno: "escape", etapa: 5, etapa_nombre: "Orden de Compra Recibida", vehiculo_marca: "Volvo", vehiculo_modelo: "VNL", vehiculo_placas: "MNO-345", prioridad: "urgente", fecha_programada: "2026-02-14", tecnico_nombre: "Miguel Torres", vendedor_nombre: "Pedro Sánchez", created_at: "2026-02-08" },
  { id: "os7", folio: "OS-2026-0007", empresa_nombre: "Transportes del Norte", tipo_servicio: "preventivo", tipo_freno: "jacobs", etapa: 9, etapa_nombre: "Servicio Concluido", vehiculo_marca: "Kenworth", vehiculo_modelo: "T880", vehiculo_placas: "PQR-678", prioridad: "normal", tecnico_nombre: "Miguel Torres", vendedor_nombre: "Pedro Sánchez", created_at: "2026-01-15" },
  { id: "os8", folio: "OS-2026-0008", empresa_nombre: "Fletes Mexicanos SA", tipo_servicio: "instalacion", tipo_freno: "electromagnetico", etapa: 2, etapa_nombre: "Diagnóstico / Cotización", vehiculo_marca: "Mercedes", vehiculo_modelo: "Actros", prioridad: "alta", vendedor_nombre: "Pedro Sánchez", created_at: "2026-02-11" },
];

export const DEMO_COTIZACIONES: CotizacionResumen[] = [
  { id: "c1", folio: "COT-2026-0001", empresa_nombre: "Transportes del Norte", total: 45680.00, moneda: "MXN", status: "aprobada", fecha_vigencia: "2026-02-28", created_at: "2026-01-20" },
  { id: "c2", folio: "COT-2026-0002", empresa_nombre: "Fletes Mexicanos SA", total: 18250.00, moneda: "MXN", status: "enviada", fecha_vigencia: "2026-02-20", created_at: "2026-02-01" },
  { id: "c3", folio: "COT-2026-0003", empresa_nombre: "Logística Central", total: 72400.00, moneda: "MXN", status: "borrador", fecha_vigencia: "2026-03-01", created_at: "2026-02-05" },
  { id: "c4", folio: "COT-2026-0004", empresa_nombre: "Transportes del Norte", total: 38900.00, moneda: "MXN", status: "aprobada", fecha_vigencia: "2026-01-15", created_at: "2025-12-10" },
  { id: "c5", folio: "COT-2026-0005", empresa_nombre: "Carga Express", total: 22100.00, moneda: "MXN", status: "enviada", fecha_vigencia: "2026-02-25", created_at: "2026-02-12" },
  { id: "c6", folio: "COT-2026-0006", empresa_nombre: "Mudanzas Rápidas", total: 15800.00, moneda: "MXN", status: "aprobada", fecha_vigencia: "2026-02-22", created_at: "2026-02-08" },
  { id: "c7", folio: "COT-2026-0007", empresa_nombre: "Fletes Mexicanos SA", total: 91200.00, moneda: "MXN", status: "rechazada", fecha_vigencia: "2026-01-30", created_at: "2026-01-05" },
];

export const DEMO_ORDENES_TRABAJO: OrdenTrabajo[] = [
  { id: "ot1", folio: "OT-2026-0001", orden_servicio_folio: "OS-2026-0001", empresa_nombre: "Transportes del Norte", tecnico_nombre: "Miguel Torres", status: "en_progreso", trabajo_realizado: "Instalación de kit Jacobs 340B en Kenworth T680", fecha_inicio: "2026-02-15" },
  { id: "ot2", folio: "OT-2026-0002", orden_servicio_folio: "OS-2026-0007", empresa_nombre: "Transportes del Norte", tecnico_nombre: "Miguel Torres", status: "completada", trabajo_realizado: "Mantenimiento preventivo de retarder Jacobs", fecha_inicio: "2026-02-10", fecha_fin: "2026-02-11" },
  { id: "ot3", folio: "OT-2026-0003", orden_servicio_folio: "OS-2026-0003", empresa_nombre: "Logística Central", tecnico_nombre: "Miguel Torres", status: "pendiente" },
];

// ── Datos agregados para KPIs ──

export function getKPIs() {
  const ventasMes = DEMO_COTIZACIONES
    .filter((c) => c.status === "aprobada")
    .reduce((sum, c) => sum + c.total, 0);

  const serviciosActivos = DEMO_ORDENES.filter(
    (o) => o.etapa >= 6 && o.etapa <= 9
  ).length;

  const cotizacionesEnviadas = DEMO_COTIZACIONES.filter(
    (c) => c.status === "enviada" || c.status === "aprobada"
  ).length;
  const cotizacionesAprobadas = DEMO_COTIZACIONES.filter(
    (c) => c.status === "aprobada"
  ).length;
  const tasaConversion =
    cotizacionesEnviadas > 0
      ? Math.round((cotizacionesAprobadas / cotizacionesEnviadas) * 100)
      : 0;

  const inventarioCritico = 3; // piezas con stock < 5

  return { ventasMes, serviciosActivos, tasaConversion, inventarioCritico };
}

export function getVentasPorTipoFreno(): { name: string; value: number }[] {
  const totals: Record<TipoFreno, number> = {
    jacobs: 0,
    escape: 0,
    electromagnetico: 0,
  };

  DEMO_ORDENES.forEach((o) => {
    const cot = DEMO_COTIZACIONES.find(
      (c) => c.empresa_nombre === o.empresa_nombre && c.status === "aprobada"
    );
    if (cot) totals[o.tipo_freno] += cot.total;
  });

  return [
    { name: "Jacobs", value: totals.jacobs },
    { name: "Escape", value: totals.escape },
    { name: "Electromagnético", value: totals.electromagnetico },
  ];
}

export function getPipelineData(): { etapa: string; cantidad: number }[] {
  const counts: Record<number, number> = {};
  DEMO_ORDENES.forEach((o) => {
    counts[o.etapa] = (counts[o.etapa] || 0) + 1;
  });

  return Array.from({ length: 14 }, (_, i) => ({
    etapa: `E${i + 1}`,
    cantidad: counts[i + 1] || 0,
  }));
}

export function getTopClientes(): { name: string; ordenes: number }[] {
  const counts: Record<string, number> = {};
  DEMO_ORDENES.forEach((o) => {
    counts[o.empresa_nombre] = (counts[o.empresa_nombre] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([name, ordenes]) => ({ name, ordenes }))
    .sort((a, b) => b.ordenes - a.ordenes)
    .slice(0, 5);
}
