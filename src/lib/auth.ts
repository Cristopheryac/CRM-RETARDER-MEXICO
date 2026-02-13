import type { Rol, Usuario } from "./types";

// ── Sesión simulada (se reemplazará con Supabase Auth) ──
// En producción: leer de supabase.auth.getUser() + tabla usuarios

let currentUser: Usuario | null = null;

export function setCurrentUser(user: Usuario | null) {
  currentUser = user;
  if (typeof window !== "undefined") {
    if (user) {
      localStorage.setItem("crm_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("crm_user");
    }
  }
}

export function getCurrentUser(): Usuario | null {
  if (currentUser) return currentUser;
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("crm_user");
    if (stored) {
      currentUser = JSON.parse(stored);
      return currentUser;
    }
  }
  return null;
}

// ── Usuarios demo para desarrollo ──

export const DEMO_USERS: Usuario[] = [
  { id: "u1", email: "carlos@retarder.mx", nombre: "Carlos Mendoza", rol: "dueno", activo: true },
  { id: "u2", email: "laura@retarder.mx", nombre: "Laura García", rol: "admin", activo: true },
  { id: "u3", email: "pedro@retarder.mx", nombre: "Pedro Sánchez", rol: "ventas", activo: true },
  { id: "u4", email: "miguel@retarder.mx", nombre: "Miguel Torres", rol: "tecnico", activo: true },
  { id: "u5", email: "ana@transportes.com", nombre: "Ana López (Transportes del Norte)", rol: "cliente", activo: true, empresa_id: "e1" },
];

// ── Permisos por rol ──

const DASHBOARD_ROUTES: Record<Rol, string> = {
  dueno: "/dashboard/owner",
  admin: "/dashboard/admin",
  ventas: "/dashboard/ventas",
  tecnico: "/dashboard/tecnicos",
  cliente: "/dashboard/clientes",
};

export function getDashboardRoute(rol: Rol): string {
  return DASHBOARD_ROUTES[rol];
}

const ROL_LABELS: Record<Rol, string> = {
  dueno: "Dueño",
  admin: "Administrador",
  ventas: "Ventas",
  tecnico: "Técnico",
  cliente: "Cliente",
};

export function getRolLabel(rol: Rol): string {
  return ROL_LABELS[rol];
}
