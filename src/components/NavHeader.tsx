"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Inicio" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/ventas/frenos", label: "Ventas" },
  { href: "/servicios", label: "Servicios" },
];

export default function NavHeader() {
  const pathname = usePathname();

  return (
    <nav className="bg-brand-900 text-white">
      <div className="max-w-[1800px] mx-auto px-4">
        <div className="flex items-center h-12 gap-6">
          <Link href="/" className="font-bold text-sm tracking-wide mr-4">
            RETARDER MX
          </Link>
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 text-sm rounded transition-colors ${
                    isActive
                      ? "bg-white/20 text-white font-medium"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
