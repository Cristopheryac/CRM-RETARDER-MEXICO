import { supabase } from "./supabase";
import type { Pieza, Kit, KitPieza, TipoFreno, InventoryMovement } from "./types";

// ── Datos de demostración (fallback cuando Supabase no responde) ──

const DEMO_PIEZAS: Pieza[] = [
  // Jacobs
  { id: "p1", numero_parte: "JB-340B-VALVE", descripcion: "Válvula maestra Jacobs 340B", tipo_freno: "jacobs", precio_usd: 285.00, stock_total: 12, stock_apartado: 2, stock_disponible: 10, stock_minimo: 5, unidad: "pieza", activa: true },
  { id: "p2", numero_parte: "JB-340B-HSG", descripcion: "Housing completo Jacobs 340B", tipo_freno: "jacobs", precio_usd: 420.00, stock_total: 8, stock_apartado: 1, stock_disponible: 7, stock_minimo: 4, unidad: "pieza", activa: true },
  { id: "p3", numero_parte: "JB-SLAVE-PST", descripcion: "Pistón esclavo Jacobs", tipo_freno: "jacobs", precio_usd: 95.00, stock_total: 30, stock_apartado: 4, stock_disponible: 26, stock_minimo: 10, unidad: "pieza", activa: true },
  { id: "p4", numero_parte: "JB-GASKET-SET", descripcion: "Kit de juntas Jacobs", tipo_freno: "jacobs", precio_usd: 45.00, stock_total: 50, stock_apartado: 0, stock_disponible: 50, stock_minimo: 15, unidad: "kit", activa: true },
  { id: "p5", numero_parte: "JB-SOLENOID", descripcion: "Solenoide Jacobs 12V", tipo_freno: "jacobs", precio_usd: 180.00, stock_total: 15, stock_apartado: 3, stock_disponible: 12, stock_minimo: 5, unidad: "pieza", activa: true },
  // Escape
  { id: "p6", numero_parte: "EB-BUTTERFLY-V", descripcion: "Válvula mariposa freno de escape", tipo_freno: "escape", precio_usd: 210.00, stock_total: 20, stock_apartado: 0, stock_disponible: 20, stock_minimo: 8, unidad: "pieza", activa: true },
  { id: "p7", numero_parte: "EB-ACTUATOR", descripcion: "Actuador neumático freno escape", tipo_freno: "escape", precio_usd: 155.00, stock_total: 18, stock_apartado: 2, stock_disponible: 16, stock_minimo: 6, unidad: "pieza", activa: true },
  { id: "p8", numero_parte: "EB-BRACKET-KIT", descripcion: "Kit de montaje freno escape", tipo_freno: "escape", precio_usd: 75.00, stock_total: 25, stock_apartado: 0, stock_disponible: 25, stock_minimo: 8, unidad: "kit", activa: true },
  // Electromagnético
  { id: "p9", numero_parte: "EM-ROTOR-480", descripcion: "Rotor retarder electromagnético 480mm", tipo_freno: "electromagnetico", precio_usd: 890.00, stock_total: 3, stock_apartado: 1, stock_disponible: 2, stock_minimo: 3, unidad: "pieza", activa: true },
  { id: "p10", numero_parte: "EM-COIL-SET", descripcion: "Set de bobinas retarder electromagnético", tipo_freno: "electromagnetico", precio_usd: 650.00, stock_total: 4, stock_apartado: 2, stock_disponible: 2, stock_minimo: 3, unidad: "set", activa: true },
  { id: "p11", numero_parte: "EM-CTRL-MODULE", descripcion: "Módulo de control electrónico retarder", tipo_freno: "electromagnetico", precio_usd: 520.00, stock_total: 2, stock_apartado: 1, stock_disponible: 1, stock_minimo: 3, unidad: "pieza", activa: true },
  // Universal
  { id: "p12", numero_parte: "UN-WIRING-KIT", descripcion: "Arnés de cableado universal", tipo_freno: "universal", precio_usd: 65.00, stock_total: 40, stock_apartado: 0, stock_disponible: 40, stock_minimo: 10, unidad: "kit", activa: true },
  { id: "p13", numero_parte: "UN-SWITCH-DASH", descripcion: "Switch de tablero ON/OFF", tipo_freno: "universal", precio_usd: 35.00, stock_total: 60, stock_apartado: 0, stock_disponible: 60, stock_minimo: 15, unidad: "pieza", activa: true },
];

const DEMO_KITS: Kit[] = [
  { id: "k1", nombre: "Kit Jacobs 340B — Kenworth T680 / Peterbilt 579", tipo_freno: "jacobs", precio_usd: 1250.00, activo: true, piezas: [{ pieza_id: "p1", cantidad: 1 }, { pieza_id: "p2", cantidad: 1 }, { pieza_id: "p3", cantidad: 6 }, { pieza_id: "p4", cantidad: 1 }, { pieza_id: "p5", cantidad: 1 }, { pieza_id: "p12", cantidad: 1 }, { pieza_id: "p13", cantidad: 1 }] },
  { id: "k2", nombre: "Kit Jacobs 340B — International LT / ProStar", tipo_freno: "jacobs", precio_usd: 1180.00, activo: true, piezas: [{ pieza_id: "p1", cantidad: 1 }, { pieza_id: "p2", cantidad: 1 }, { pieza_id: "p3", cantidad: 4 }, { pieza_id: "p4", cantidad: 1 }, { pieza_id: "p5", cantidad: 1 }, { pieza_id: "p12", cantidad: 1 }, { pieza_id: "p13", cantidad: 1 }] },
  { id: "k3", nombre: "Kit Jacobs 340B — Freightliner Cascadia", tipo_freno: "jacobs", precio_usd: 1320.00, activo: true, piezas: [{ pieza_id: "p1", cantidad: 2 }, { pieza_id: "p2", cantidad: 1 }, { pieza_id: "p3", cantidad: 6 }, { pieza_id: "p4", cantidad: 2 }, { pieza_id: "p5", cantidad: 1 }, { pieza_id: "p12", cantidad: 1 }, { pieza_id: "p13", cantidad: 1 }] },
  { id: "k4", nombre: "Kit Freno de Escape — Motor Cummins ISX", tipo_freno: "escape", precio_usd: 680.00, activo: true, piezas: [{ pieza_id: "p6", cantidad: 1 }, { pieza_id: "p7", cantidad: 1 }, { pieza_id: "p8", cantidad: 1 }, { pieza_id: "p12", cantidad: 1 }, { pieza_id: "p13", cantidad: 1 }] },
  { id: "k5", nombre: "Kit Freno de Escape — Motor PACCAR MX-13", tipo_freno: "escape", precio_usd: 720.00, activo: true, piezas: [{ pieza_id: "p6", cantidad: 1 }, { pieza_id: "p7", cantidad: 1 }, { pieza_id: "p8", cantidad: 1 }, { pieza_id: "p12", cantidad: 1 }, { pieza_id: "p13", cantidad: 1 }] },
  { id: "k6", nombre: "Kit Retarder Electromagnético — Telma", tipo_freno: "electromagnetico", precio_usd: 3200.00, activo: true, piezas: [{ pieza_id: "p9", cantidad: 1 }, { pieza_id: "p10", cantidad: 1 }, { pieza_id: "p11", cantidad: 1 }, { pieza_id: "p12", cantidad: 1 }, { pieza_id: "p13", cantidad: 1 }] },
  { id: "k7", nombre: "Kit Retarder Electromagnético — Voith", tipo_freno: "electromagnetico", precio_usd: 3800.00, activo: true, piezas: [{ pieza_id: "p9", cantidad: 1 }, { pieza_id: "p10", cantidad: 1 }, { pieza_id: "p11", cantidad: 1 }, { pieza_id: "p12", cantidad: 1 }, { pieza_id: "p13", cantidad: 1 }] },
];

// ── Funciones de acceso a datos ──

export async function fetchPiezas(tipoFreno?: TipoFreno): Promise<Pieza[]> {
  try {
    let query = supabase
      .from("inventario")
      .select("*")
      .eq("activa", true)
      .order("descripcion");

    if (tipoFreno) {
      query = query.in("tipo_freno", [tipoFreno, "universal"]);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Pieza[];
  } catch {
    // Fallback a datos de demo
    if (tipoFreno) {
      return DEMO_PIEZAS.filter(
        (p) => p.tipo_freno === tipoFreno || p.tipo_freno === "universal"
      );
    }
    return DEMO_PIEZAS;
  }
}

export async function fetchKits(tipoFreno?: TipoFreno): Promise<Kit[]> {
  try {
    let query = supabase
      .from("kits")
      .select("*")
      .eq("activo", true)
      .order("nombre");

    if (tipoFreno) {
      query = query.eq("tipo_freno", tipoFreno);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Kit[];
  } catch {
    // Fallback a datos de demo
    if (tipoFreno) {
      return DEMO_KITS.filter((k) => k.tipo_freno === tipoFreno);
    }
    return DEMO_KITS;
  }
}

// ── Movimientos de inventario demo ──

const DEMO_MOVIMIENTOS: InventoryMovement[] = [
  { id: "m1", orden_servicio_id: "os1", pieza_id: "p1", pieza_descripcion: "Válvula maestra Jacobs 340B", cantidad: 1, tipo: "apartado", fecha: "2026-02-10" },
  { id: "m2", orden_servicio_id: "os1", pieza_id: "p2", pieza_descripcion: "Housing completo Jacobs 340B", cantidad: 1, tipo: "apartado", fecha: "2026-02-10" },
  { id: "m3", orden_servicio_id: "os1", pieza_id: "p3", pieza_descripcion: "Pistón esclavo Jacobs", cantidad: 6, tipo: "apartado", fecha: "2026-02-10" },
  { id: "m4", orden_servicio_id: "os4", pieza_id: "p1", pieza_descripcion: "Válvula maestra Jacobs 340B", cantidad: 1, tipo: "descontado", fecha: "2026-01-28" },
  { id: "m5", orden_servicio_id: "os4", pieza_id: "p5", pieza_descripcion: "Solenoide Jacobs 12V", cantidad: 1, tipo: "descontado", fecha: "2026-01-28" },
  { id: "m6", orden_servicio_id: "os6", pieza_id: "p7", pieza_descripcion: "Actuador neumático freno escape", cantidad: 2, tipo: "apartado", fecha: "2026-02-09" },
  { id: "m7", orden_servicio_id: "", pieza_id: "p9", pieza_descripcion: "Rotor retarder electromagnético 480mm", cantidad: 5, tipo: "entrada", fecha: "2026-02-01" },
  { id: "m8", orden_servicio_id: "", pieza_id: "p10", pieza_descripcion: "Set de bobinas retarder electromagnético", cantidad: 4, tipo: "entrada", fecha: "2026-02-01" },
  { id: "m9", orden_servicio_id: "", pieza_id: "p11", pieza_descripcion: "Módulo de control electrónico retarder", cantidad: 3, tipo: "entrada", fecha: "2026-02-01" },
  { id: "m10", orden_servicio_id: "os3", pieza_id: "p9", pieza_descripcion: "Rotor retarder electromagnético 480mm", cantidad: 1, tipo: "apartado", fecha: "2026-02-06" },
  { id: "m11", orden_servicio_id: "os3", pieza_id: "p10", pieza_descripcion: "Set de bobinas retarder electromagnético", cantidad: 1, tipo: "apartado", fecha: "2026-02-06" },
  { id: "m12", orden_servicio_id: "os3", pieza_id: "p11", pieza_descripcion: "Módulo de control electrónico retarder", cantidad: 1, tipo: "apartado", fecha: "2026-02-06" },
  { id: "m13", orden_servicio_id: "", pieza_id: "p1", pieza_descripcion: "Válvula maestra Jacobs 340B", cantidad: 10, tipo: "entrada", fecha: "2026-01-15" },
  { id: "m14", orden_servicio_id: "", pieza_id: "p6", pieza_descripcion: "Válvula mariposa freno de escape", cantidad: 15, tipo: "entrada", fecha: "2026-01-20" },
  { id: "m15", orden_servicio_id: "os7", pieza_id: "p1", pieza_descripcion: "Válvula maestra Jacobs 340B", cantidad: 1, tipo: "descontado", fecha: "2026-02-11" },
  { id: "m16", orden_servicio_id: "os7", pieza_id: "p4", pieza_descripcion: "Kit de juntas Jacobs", cantidad: 1, tipo: "descontado", fecha: "2026-02-11" },
  { id: "m17", orden_servicio_id: "", pieza_id: "p3", pieza_descripcion: "Pistón esclavo Jacobs", cantidad: 20, tipo: "entrada", fecha: "2026-01-10" },
  { id: "m18", orden_servicio_id: "os1", pieza_id: "p5", pieza_descripcion: "Solenoide Jacobs 12V", cantidad: 1, tipo: "apartado", fecha: "2026-02-10" },
  { id: "m19", orden_servicio_id: "os1", pieza_id: "p12", pieza_descripcion: "Arnés de cableado universal", cantidad: 1, tipo: "apartado", fecha: "2026-02-10" },
  { id: "m20", orden_servicio_id: "os2", pieza_id: "p10", pieza_descripcion: "Set de bobinas retarder electromagnético", cantidad: 1, tipo: "apartado", fecha: "2026-02-12" },
];

export function fetchMovimientos(): InventoryMovement[] {
  return DEMO_MOVIMIENTOS;
}

export function getPiezasCriticas(piezas: Pieza[]): Pieza[] {
  return piezas.filter((p) => p.stock_total < p.stock_minimo);
}

export function getPiezasBajas(piezas: Pieza[]): Pieza[] {
  return piezas.filter(
    (p) => p.stock_disponible < p.stock_minimo && p.stock_total >= p.stock_minimo
  );
}

export function validarStockKit(kit: Kit, piezas: Pieza[]): { valido: boolean; faltantes: { pieza: Pieza; necesario: number; disponible: number }[] } {
  const faltantes: { pieza: Pieza; necesario: number; disponible: number }[] = [];
  for (const kp of kit.piezas) {
    const pieza = piezas.find((p) => p.id === kp.pieza_id);
    if (!pieza || pieza.stock_disponible < kp.cantidad) {
      faltantes.push({
        pieza: pieza || { id: kp.pieza_id, numero_parte: "?", descripcion: "Pieza no encontrada", tipo_freno: "universal", precio_usd: 0, stock_total: 0, stock_apartado: 0, stock_disponible: 0, stock_minimo: 0, unidad: "pieza", activa: false },
        necesario: kp.cantidad,
        disponible: pieza?.stock_disponible ?? 0,
      });
    }
  }
  return { valido: faltantes.length === 0, faltantes };
}

export function getAllPiezas(): Pieza[] {
  return DEMO_PIEZAS;
}

export function getAllKits(): Kit[] {
  return DEMO_KITS;
}

export async function fetchTipoCambio(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("configuracion")
      .select("valor")
      .eq("clave", "tipo_cambio_usd_mxn")
      .single();

    if (error) throw error;
    return parseFloat(data.valor);
  } catch {
    return 17.25; // Tipo de cambio default
  }
}
