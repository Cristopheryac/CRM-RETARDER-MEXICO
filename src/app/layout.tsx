import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRM Retarder México",
  description: "CRM para gestión de servicios de frenos retarders industriales",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-50 text-gray-900 min-h-screen">{children}</body>
    </html>
  );
}
