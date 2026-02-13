import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-2">CRM Retarder México</h1>
      <p className="text-gray-600 mb-8">
        Sistema de gestión de servicios de frenos retarders industriales
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/ventas/frenos"
          className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
        >
          <h2 className="text-xl font-semibold mb-1">Ventas de Frenos</h2>
          <p className="text-gray-500 text-sm">
            Cotizador de kits y piezas para retarders
          </p>
        </Link>
      </div>
    </main>
  );
}
