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
