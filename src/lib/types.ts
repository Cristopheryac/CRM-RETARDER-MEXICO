// ── Tipos de dominio para CRM Retarder México ──

export type TipoFreno = "jacobs" | "escape" | "electromagnetico";

export type TipoServicio = "instalacion" | "preventivo" | "correctivo";

export type TipoItemCotizacion = "pieza" | "kit" | "mano_obra" | "otro";

// ── Inventario (piezas individuales) ──

export interface Pieza {
  id: string;
  numero_parte: string;
  descripcion: string;
  tipo_freno: TipoFreno | "universal";
  precio_usd: number;
  stock_total: number;
  stock_apartado: number;
  stock_disponible: number;
  unidad: string;
  activa: boolean;
}

// ── Kits (configuraciones predefinidas) ──

export interface Kit {
  id: string;
  nombre: string;
  tipo_freno: TipoFreno;
  precio_usd: number;
  activo: boolean;
}

// ── Items de cotización (líneas del cotizador) ──

export interface ItemCotizacion {
  id: string;
  tipo: TipoItemCotizacion;
  pieza_id?: string;
  kit_id?: string;
  descripcion: string;
  cantidad: number;
  precio_unitario_usd: number;
  precio_unitario_mxn: number;
  subtotal: number;
}

// ── Cotización completa ──

export interface Cotizacion {
  folio: string;
  tipo_cambio: number;
  moneda: "MXN" | "USD";
  subtotal: number;
  descuento: number;
  iva: number;
  total: number;
  items: ItemCotizacion[];
}

// ── Roles del sistema ──

export type Rol = "dueno" | "admin" | "ventas" | "tecnico" | "cliente";

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  rol: Rol;
  telefono?: string;
  activo: boolean;
  empresa_id?: string;
  avatar_url?: string;
}

// ── Órdenes de servicio ──

export type Prioridad = "baja" | "normal" | "alta" | "urgente";

export type StatusCotizacion = "borrador" | "enviada" | "aprobada" | "rechazada" | "vencida";

export type StatusOrdenTrabajo = "pendiente" | "en_progreso" | "completada" | "cancelada";

export const ETAPA_NOMBRES: Record<number, string> = {
  1: "Contacto Inicial",
  2: "Diagnóstico / Cotización",
  3: "Cotización Enviada",
  4: "Cotización Aprobada",
  5: "Orden de Compra Recibida",
  6: "Programación",
  7: "Servicio Iniciado",
  8: "Servicio en Progreso",
  9: "Servicio Concluido",
  10: "Firma y Cierre",
  11: "Facturación y Cierre",
};

export interface OrdenServicio {
  id: string;
  folio: string;
  empresa_nombre: string;
  tipo_servicio: TipoServicio;
  tipo_freno: TipoFreno;
  etapa: number;
  etapa_nombre: string;
  vehiculo_marca?: string;
  vehiculo_modelo?: string;
  vehiculo_placas?: string;
  prioridad: Prioridad;
  fecha_programada?: string;
  tecnico_nombre?: string;
  vendedor_nombre?: string;
  created_at: string;
}

export interface CotizacionResumen {
  id: string;
  folio: string;
  empresa_nombre: string;
  total: number;
  moneda: "MXN" | "USD";
  status: StatusCotizacion;
  fecha_vigencia: string;
  created_at: string;
}

export interface OrdenTrabajo {
  id: string;
  folio: string;
  orden_servicio_folio: string;
  empresa_nombre: string;
  tecnico_nombre: string;
  status: StatusOrdenTrabajo;
  trabajo_realizado?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
}

// ── Labels de UI ──

export const BRAKE_TYPE_LABELS: Record<TipoFreno, string> = {
  jacobs: "Jacobs Engine Brake",
  escape: "Freno de Escape",
  electromagnetico: "Retarder Electromagnético",
};

export const BRAKE_TYPE_DESCRIPTIONS: Record<TipoFreno, string> = {
  jacobs: "Freno motor por descompresión — ideal para pendientes prolongadas",
  escape: "Restricción de gases de escape — económico y confiable",
  electromagnetico: "Retarder por corrientes de Foucault — sin desgaste mecánico",
};
