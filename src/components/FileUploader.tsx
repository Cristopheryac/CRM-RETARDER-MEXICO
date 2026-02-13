"use client";

import { useRef, useState } from "react";

interface FileUploaderProps {
  ordenId: string;
  tipo: "pdf_oc" | "foto_evidencia";
  onUpload: (file: { nombre: string; url: string }) => void;
  accept?: string;
  multiple?: boolean;
}

export default function FileUploader({
  ordenId,
  tipo,
  onUpload,
  accept,
  multiple = false,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState<string[]>([]);

  const isPdf = tipo === "pdf_oc";
  const acceptDefault = isPdf ? ".pdf" : "image/*";
  const label = isPdf ? "Subir PDF de Orden de Compra" : "Subir Evidencias Fotográficas";
  const icon = isPdf ? "📄" : "📸";

  function handleClick() {
    inputRef.current?.click();
  }

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    // Simulación de upload (en producción: supabase.storage.upload)
    for (const file of Array.from(files)) {
      await new Promise((r) => setTimeout(r, 500));
      const fakeUrl = `https://storage.supabase.co/crm/${ordenId}/${file.name}`;
      onUpload({ nombre: file.name, url: fakeUrl });
      setUploaded((prev) => [...prev, file.name]);
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept={accept || acceptDefault}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />

      <button
        onClick={handleClick}
        disabled={uploading}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed transition-colors ${
          uploading
            ? "border-gray-300 bg-gray-50 text-gray-400 cursor-wait"
            : "border-brand-500 bg-brand-50 text-brand-700 hover:bg-brand-100 cursor-pointer"
        }`}
      >
        <span className="text-lg">{icon}</span>
        <span className="font-medium text-sm">
          {uploading ? "Subiendo..." : label}
        </span>
      </button>

      {uploaded.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Archivos subidos:
          </p>
          {uploaded.map((name, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded px-3 py-1.5"
            >
              <span>✓</span>
              <span className="truncate">{name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
