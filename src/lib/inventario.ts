import { supabase } from "./supabase";
import type { Pieza, Kit, TipoFreno } from "./types";

// ── Datos de demostración (fallback cuando Supabase no responde) ──

const DEMO_PIEZAS: Pieza[] = [
  // Jacobs
  { id: "p1", numero_parte: "JB-340B-VALVE", descripcion: "Válvula maestra Jacobs 340B", tipo_freno: "jacobs", precio_usd: 285.00, stock_total: 12, stock_apartado: 2, stock_disponible: 10, unidad: "pieza", activa: true },
  { id: "p2", numero_parte: "JB-340B-HSG", descripcion: "Housing completo Jacobs 340B", tipo_freno: "jacobs", precio_usd: 420.00, stock_total: 8, stock_apartado: 1, stock_disponible: 7, unidad: "pieza", activa: true },
  { id: "p3", numero_parte: "JB-SLAVE-PST", descripcion: "Pistón esclavo Jacobs", tipo_freno: "jacobs", precio_usd: 95.00, stock_total: 30, stock_apartado: 4, stock_disponible: 26, unidad: "pieza", activa: true },
  { id: "p4", numero_parte: "JB-GASKET-SET", descripcion: "Kit de juntas Jacobs", tipo_freno: "jacobs", precio_usd: 45.00, stock_total: 50, stock_apartado: 0, stock_disponible: 50, unidad: "kit", activa: true },
  { id: "p5", numero_parte: "JB-SOLENOID", descripcion: "Solenoide Jacobs 12V", tipo_freno: "jacobs", precio_usd: 180.00, stock_total: 15, stock_apartado: 3, stock_disponible: 12, unidad: "pieza", activa: true },
  // Escape
  { id: "p6", numero_parte: "EB-BUTTERFLY-V", descripcion: "Válvula mariposa freno de escape", tipo_freno: "escape", precio_usd: 210.00, stock_total: 20, stock_apartado: 0, stock_disponible: 20, unidad: "pieza", activa: true },
  { id: "p7", numero_parte: "EB-ACTUATOR", descripcion: "Actuador neumático freno escape", tipo_freno: "escape", precio_usd: 155.00, stock_total: 18, stock_apartado: 2, stock_disponible: 16, unidad: "pieza", activa: true },
  { id: "p8", numero_parte: "EB-BRACKET-KIT", descripcion: "Kit de montaje freno escape", tipo_freno: "escape", precio_usd: 75.00, stock_total: 25, stock_apartado: 0, stock_disponible: 25, unidad: "kit", activa: true },
  // Electromagnético
  { id: "p9", numero_parte: "EM-ROTOR-480", descripcion: "Rotor retarder electromagnético 480mm", tipo_freno: "electromagnetico", precio_usd: 890.00, stock_total: 5, stock_apartado: 1, stock_disponible: 4, unidad: "pieza", activa: true },
  { id: "p10", numero_parte: "EM-COIL-SET", descripcion: "Set de bobinas retarder electromagnético", tipo_freno: "electromagnetico", precio_usd: 650.00, stock_total: 6, stock_apartado: 0, stock_disponible: 6, unidad: "set", activa: true },
  { id: "p11", numero_parte: "EM-CTRL-MODULE", descripcion: "Módulo de control electrónico retarder", tipo_freno: "electromagnetico", precio_usd: 520.00, stock_total: 8, stock_apartado: 1, stock_disponible: 7, unidad: "pieza", activa: true },
  // Universal
  { id: "p12", numero_parte: "UN-WIRING-KIT", descripcion: "Arnés de cableado universal", tipo_freno: "universal", precio_usd: 65.00, stock_total: 40, stock_apartado: 0, stock_disponible: 40, unidad: "kit", activa: true },
  { id: "p13", numero_parte: "UN-SWITCH-DASH", descripcion: "Switch de tablero ON/OFF", tipo_freno: "universal", precio_usd: 35.00, stock_total: 60, stock_apartado: 0, stock_disponible: 60, unidad: "pieza", activa: true },
];

const DEMO_KITS: Kit[] = [
  { id: "k1", nombre: "Kit Jacobs 340B — Kenworth T680 / Peterbilt 579", tipo_freno: "jacobs", precio_usd: 1250.00, activo: true },
  { id: "k2", nombre: "Kit Jacobs 340B — International LT / ProStar", tipo_freno: "jacobs", precio_usd: 1180.00, activo: true },
  { id: "k3", nombre: "Kit Jacobs 340B — Freightliner Cascadia", tipo_freno: "jacobs", precio_usd: 1320.00, activo: true },
  { id: "k4", nombre: "Kit Freno de Escape — Motor Cummins ISX", tipo_freno: "escape", precio_usd: 680.00, activo: true },
  { id: "k5", nombre: "Kit Freno de Escape — Motor PACCAR MX-13", tipo_freno: "escape", precio_usd: 720.00, activo: true },
  { id: "k6", nombre: "Kit Retarder Electromagnético — Telma", tipo_freno: "electromagnetico", precio_usd: 3200.00, activo: true },
  { id: "k7", nombre: "Kit Retarder Electromagnético — Voith", tipo_freno: "electromagnetico", precio_usd: 3800.00, activo: true },
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
