# Gemini - Constitución del Proyecto CRM Retarder México

## Resultado Singular Deseado
CRM operativo que gestione el ciclo completo: **Venta → Instalación → Servicio → Facturación**
para RETARDER MÉXICO (servicios técnicos industriales - frenos retarders).

## Stack Tecnológico
- **Frontend:** Next.js (App Router)
- **Base de Datos:** Supabase (PostgreSQL)
- **Autenticación:** Supabase Auth
- **Storage:** Supabase Storage (fotos, PDFs, OCs)
- **Firma Digital:** En tablet/móvil (canvas)
- **Email:** Automatizado (cotizaciones y seguimientos)

## Roles del Sistema
| Rol | Permisos |
|-----|----------|
| Dueño | Dashboard ejecutivo, reportes financieros, configuración global |
| Admin | Gestión completa de órdenes, inventario, usuarios |
| Ventas | Cotizaciones, seguimiento pipeline, clientes |
| Técnico | Órdenes de trabajo asignadas, fotos, firma |
| Cliente | Portal: ver sus órdenes, aprobar cotizaciones, historial |

## Reglas de Negocio Críticas
1. **NUNCA** avanzar en pipeline sin Orden de Compra (PDF adjunto)
2. **Apartado** de inventario al iniciar servicio (Etapa 7)
3. **Baja** de inventario al concluir servicio (Etapa 9)
4. **Firma digital** obligatoria del cliente al cerrar
5. **Fotos Antes/Después** obligatorias por servicio
6. **Tipo de cambio** USD→MXN editable en tiempo real

## Pipeline de Órdenes de Servicio (11 Etapas)
| # | Etapa | Gate / Acción |
|---|-------|---------------|
| 1 | Contacto Inicial | Se registra prospecto/solicitud |
| 2 | Diagnóstico / Cotización | Se genera cotización con precios |
| 3 | Cotización Enviada | Se envía PDF al cliente |
| 4 | Cotización Aprobada | Cliente acepta formalmente |
| 5 | Orden de Compra Recibida | **GATE: OC en PDF obligatoria para continuar** |
| 6 | Programación | Se asigna fecha y técnico |
| 7 | Servicio Iniciado | **Inventario se APARTA** / Fotos ANTES obligatorias |
| 8 | Servicio en Progreso | Técnico ejecuta trabajo |
| 9 | Servicio Concluido | **Inventario se DA DE BAJA** / Fotos DESPUÉS obligatorias |
| 10 | Firma y Cierre | **Firma digital obligatoria** del cliente |
| 11 | Facturación y Cierre | Se genera factura, orden cerrada |

---

## Esquema de Datos - Entidades Principales

### 1. Empresas (Clientes)

```json
{
  "tabla": "empresas",
  "descripcion": "Clientes corporativos con múltiples sucursales",
  "campos": {
    "id":              "uuid PRIMARY KEY DEFAULT gen_random_uuid()",
    "nombre":          "text NOT NULL — Nombre comercial",
    "razon_social":    "text — Razón social para facturación",
    "rfc":             "text UNIQUE — RFC fiscal",
    "giro":            "text — Giro de la empresa (transporte, construcción, etc.)",
    "telefono":        "text",
    "email":           "text",
    "sitio_web":       "text",
    "notas":           "text",
    "activa":          "boolean DEFAULT true",
    "created_at":      "timestamptz DEFAULT now()",
    "updated_at":      "timestamptz DEFAULT now()"
  },
  "relaciones": {
    "tiene_muchas": ["sucursales", "contactos", "ordenes_servicio", "cotizaciones"]
  }
}
```

#### 1.1 Sucursales

```json
{
  "tabla": "sucursales",
  "descripcion": "Ubicaciones físicas de cada empresa cliente",
  "campos": {
    "id":              "uuid PRIMARY KEY DEFAULT gen_random_uuid()",
    "empresa_id":      "uuid NOT NULL REFERENCES empresas(id)",
    "nombre":          "text NOT NULL — Nombre de la sucursal (ej: 'Planta Monterrey')",
    "direccion":       "text",
    "ciudad":          "text",
    "estado":          "text",
    "codigo_postal":   "text",
    "telefono":        "text",
    "contacto_nombre": "text — Contacto principal en esta sucursal",
    "contacto_tel":    "text",
    "contacto_email":  "text",
    "activa":          "boolean DEFAULT true",
    "created_at":      "timestamptz DEFAULT now()"
  }
}
```

#### 1.2 Contactos

```json
{
  "tabla": "contactos",
  "descripcion": "Personas de contacto asociadas a una empresa",
  "campos": {
    "id":              "uuid PRIMARY KEY DEFAULT gen_random_uuid()",
    "empresa_id":      "uuid NOT NULL REFERENCES empresas(id)",
    "sucursal_id":     "uuid REFERENCES sucursales(id) — Opcional",
    "nombre":          "text NOT NULL",
    "cargo":           "text",
    "telefono":        "text",
    "email":           "text",
    "es_principal":    "boolean DEFAULT false",
    "created_at":      "timestamptz DEFAULT now()"
  }
}
```

### 2. Órdenes de Servicio (Core del Sistema)

```json
{
  "tabla": "ordenes_servicio",
  "descripcion": "Entidad central del CRM — gestiona el pipeline completo",
  "campos": {
    "id":                  "uuid PRIMARY KEY DEFAULT gen_random_uuid()",
    "folio":               "text UNIQUE NOT NULL — Auto: 'OS-2026-0001'",
    "empresa_id":          "uuid NOT NULL REFERENCES empresas(id)",
    "sucursal_id":         "uuid REFERENCES sucursales(id)",
    "contacto_id":         "uuid REFERENCES contactos(id)",

    "tipo_servicio":       "text NOT NULL CHECK (tipo_servicio IN ('instalacion', 'preventivo', 'correctivo')) — Tipo de servicio",
    "tipo_freno":          "text NOT NULL CHECK (tipo_freno IN ('jacobs', 'escape', 'electromagnetico')) — Tipo de retarder",

    "etapa":               "integer NOT NULL DEFAULT 1 CHECK (etapa BETWEEN 1 AND 11) — Etapa del pipeline",
    "etapa_nombre":        "text — Nombre legible de la etapa actual",

    "vehiculo_marca":      "text",
    "vehiculo_modelo":     "text",
    "vehiculo_anio":       "integer",
    "vehiculo_placas":     "text",
    "vehiculo_eco":        "text — Número económico de la unidad",
    "vehiculo_vin":        "text — Número de serie",

    "orden_compra_url":    "text — URL del PDF de la OC en Storage",
    "orden_compra_numero": "text — Número de la OC del cliente",

    "tecnico_id":          "uuid REFERENCES usuarios(id)",
    "vendedor_id":         "uuid REFERENCES usuarios(id)",

    "fecha_programada":    "date",
    "fecha_inicio":        "timestamptz",
    "fecha_fin":           "timestamptz",

    "notas":               "text",
    "prioridad":           "text DEFAULT 'normal' CHECK (prioridad IN ('baja', 'normal', 'alta', 'urgente'))",
    "activa":              "boolean DEFAULT true",
    "created_at":          "timestamptz DEFAULT now()",
    "updated_at":          "timestamptz DEFAULT now()"
  },
  "relaciones": {
    "pertenece_a": ["empresas", "sucursales"],
    "tiene_muchas": ["cotizaciones", "ordenes_trabajo", "fotos_servicio", "historial_etapas"]
  },
  "folio_formato": "OS-{AÑO}-{SECUENCIAL_4_DIGITOS}",
  "reglas": [
    "No puede pasar de etapa 4→5 sin orden_compra_url",
    "Al entrar a etapa 7: apartar inventario de piezas vinculadas",
    "Al entrar a etapa 9: dar de baja inventario apartado",
    "No puede pasar de etapa 9→10 sin fotos antes Y después",
    "No puede pasar de etapa 10→11 sin firma digital del cliente"
  ]
}
```

#### 2.1 Fotos de Servicio

```json
{
  "tabla": "fotos_servicio",
  "descripcion": "Evidencia fotográfica antes/después del servicio",
  "campos": {
    "id":                "uuid PRIMARY KEY DEFAULT gen_random_uuid()",
    "orden_servicio_id": "uuid NOT NULL REFERENCES ordenes_servicio(id)",
    "tipo":              "text NOT NULL CHECK (tipo IN ('antes', 'despues')) — Momento de la foto",
    "url":               "text NOT NULL — URL en Supabase Storage",
    "descripcion":       "text",
    "subida_por":        "uuid REFERENCES usuarios(id)",
    "created_at":        "timestamptz DEFAULT now()"
  }
}
```

#### 2.2 Historial de Etapas

```json
{
  "tabla": "historial_etapas",
  "descripcion": "Log de cada cambio de etapa en el pipeline",
  "campos": {
    "id":                "uuid PRIMARY KEY DEFAULT gen_random_uuid()",
    "orden_servicio_id": "uuid NOT NULL REFERENCES ordenes_servicio(id)",
    "etapa_anterior":    "integer",
    "etapa_nueva":       "integer NOT NULL",
    "usuario_id":        "uuid REFERENCES usuarios(id) — Quién hizo el cambio",
    "notas":             "text",
    "created_at":        "timestamptz DEFAULT now()"
  }
}
```

### 3. Cotizaciones

```json
{
  "tabla": "cotizaciones",
  "descripcion": "Propuestas económicas vinculadas a órdenes de servicio",
  "campos": {
    "id":                "uuid PRIMARY KEY DEFAULT gen_random_uuid()",
    "folio":             "text UNIQUE NOT NULL — Auto: 'COT-2026-0001'",
    "orden_servicio_id": "uuid REFERENCES ordenes_servicio(id) — Puede crearse sin OS",
    "empresa_id":        "uuid NOT NULL REFERENCES empresas(id)",
    "sucursal_id":       "uuid REFERENCES sucursales(id)",
    "contacto_id":       "uuid REFERENCES contactos(id)",

    "tipo_cambio":       "numeric(10,4) NOT NULL — USD→MXN al momento de cotizar",
    "moneda":            "text DEFAULT 'MXN' CHECK (moneda IN ('MXN', 'USD'))",

    "subtotal":          "numeric(12,2) DEFAULT 0",
    "descuento":         "numeric(12,2) DEFAULT 0",
    "iva":               "numeric(12,2) DEFAULT 0",
    "total":             "numeric(12,2) DEFAULT 0",

    "vigencia_dias":     "integer DEFAULT 15",
    "fecha_vigencia":    "date — Calculada: created_at + vigencia_dias",

    "status":            "text DEFAULT 'borrador' CHECK (status IN ('borrador', 'enviada', 'aprobada', 'rechazada', 'vencida'))",

    "notas":             "text",
    "condiciones":       "text — Términos y condiciones",
    "pdf_url":           "text — URL del PDF generado en Storage",

    "creado_por":        "uuid REFERENCES usuarios(id)",
    "created_at":        "timestamptz DEFAULT now()",
    "updated_at":        "timestamptz DEFAULT now()"
  },
  "relaciones": {
    "tiene_muchas": ["cotizacion_items"]
  },
  "folio_formato": "COT-{AÑO}-{SECUENCIAL_4_DIGITOS}"
}
```

#### 3.1 Items de Cotización

```json
{
  "tabla": "cotizacion_items",
  "descripcion": "Líneas individuales de cada cotización (piezas o kits)",
  "campos": {
    "id":              "uuid PRIMARY KEY DEFAULT gen_random_uuid()",
    "cotizacion_id":   "uuid NOT NULL REFERENCES cotizaciones(id) ON DELETE CASCADE",
    "tipo":            "text NOT NULL CHECK (tipo IN ('pieza', 'kit', 'mano_obra', 'otro'))",
    "pieza_id":        "uuid REFERENCES inventario(id) — Si aplica",
    "kit_id":          "uuid REFERENCES kits(id) — Si aplica",
    "descripcion":     "text NOT NULL",
    "cantidad":        "integer NOT NULL DEFAULT 1",
    "precio_unitario_usd": "numeric(12,2) — Precio base en USD",
    "precio_unitario_mxn": "numeric(12,2) — Precio convertido en MXN",
    "subtotal":        "numeric(12,2)",
    "created_at":      "timestamptz DEFAULT now()"
  }
}
```

### 4. Órdenes de Trabajo

```json
{
  "tabla": "ordenes_trabajo",
  "descripcion": "Documento final de ejecución — requiere firma digital",
  "campos": {
    "id":                "uuid PRIMARY KEY DEFAULT gen_random_uuid()",
    "folio":             "text UNIQUE NOT NULL — Auto: 'OT-2026-0001'",
    "orden_servicio_id": "uuid NOT NULL REFERENCES ordenes_servicio(id)",
    "tecnico_id":        "uuid NOT NULL REFERENCES usuarios(id)",

    "fecha_inicio":      "timestamptz",
    "fecha_fin":         "timestamptz",

    "trabajo_realizado": "text — Descripción del trabajo ejecutado",
    "observaciones":     "text — Notas del técnico",
    "diagnostico":       "text — Diagnóstico técnico inicial",

    "firma_cliente_url":  "text — URL de imagen de firma en Storage",
    "firma_tecnico_url":  "text — URL de imagen de firma en Storage",
    "firma_cliente_nombre": "text — Nombre de quien firma",
    "firma_cliente_fecha":  "timestamptz — Momento de la firma",

    "pdf_url":           "text — URL del PDF final generado",

    "status":            "text DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'en_progreso', 'completada', 'cancelada'))",
    "created_at":        "timestamptz DEFAULT now()",
    "updated_at":        "timestamptz DEFAULT now()"
  },
  "relaciones": {
    "tiene_muchas": ["orden_trabajo_piezas"]
  },
  "folio_formato": "OT-{AÑO}-{SECUENCIAL_4_DIGITOS}",
  "reglas": [
    "No se puede marcar como 'completada' sin firma_cliente_url",
    "No se puede marcar como 'completada' sin firma_tecnico_url",
    "Al completarse, se dispara baja de inventario en la OS asociada"
  ]
}
```

#### 4.1 Piezas Utilizadas en OT

```json
{
  "tabla": "orden_trabajo_piezas",
  "descripcion": "Piezas/kits consumidos durante la orden de trabajo",
  "campos": {
    "id":               "uuid PRIMARY KEY DEFAULT gen_random_uuid()",
    "orden_trabajo_id": "uuid NOT NULL REFERENCES ordenes_trabajo(id) ON DELETE CASCADE",
    "pieza_id":         "uuid REFERENCES inventario(id)",
    "kit_id":           "uuid REFERENCES kits(id)",
    "descripcion":      "text NOT NULL",
    "cantidad":         "integer NOT NULL DEFAULT 1",
    "numero_serie":     "text — Trazabilidad",
    "created_at":       "timestamptz DEFAULT now()"
  }
}
```

---

## Entidades de Soporte (Referenciadas arriba)

Estas tablas complementan las 4 entidades principales:

### Usuarios
```json
{
  "tabla": "usuarios",
  "campos": {
    "id":         "uuid PRIMARY KEY REFERENCES auth.users(id)",
    "email":      "text UNIQUE NOT NULL",
    "nombre":     "text NOT NULL",
    "rol":        "text NOT NULL CHECK (rol IN ('dueno', 'admin', 'ventas', 'tecnico', 'cliente'))",
    "telefono":   "text",
    "activo":     "boolean DEFAULT true",
    "empresa_id": "uuid REFERENCES empresas(id) — Solo para rol 'cliente'",
    "avatar_url": "text",
    "created_at": "timestamptz DEFAULT now()"
  }
}
```

### Inventario (Piezas individuales)
```json
{
  "tabla": "inventario",
  "campos": {
    "id":              "uuid PRIMARY KEY DEFAULT gen_random_uuid()",
    "numero_parte":    "text UNIQUE NOT NULL",
    "descripcion":     "text NOT NULL",
    "tipo_freno":      "text CHECK (tipo_freno IN ('jacobs', 'escape', 'electromagnetico', 'universal'))",
    "precio_usd":      "numeric(12,2) NOT NULL",
    "stock_total":     "integer DEFAULT 0",
    "stock_apartado":  "integer DEFAULT 0 — Reservado por OS en etapa 7+",
    "stock_disponible":"integer GENERATED ALWAYS AS (stock_total - stock_apartado) STORED",
    "unidad":          "text DEFAULT 'pieza'",
    "activa":          "boolean DEFAULT true",
    "created_at":      "timestamptz DEFAULT now()"
  }
}
```

### Kits (Configuraciones predefinidas)
```json
{
  "tabla": "kits",
  "campos": {
    "id":          "uuid PRIMARY KEY DEFAULT gen_random_uuid()",
    "nombre":      "text NOT NULL — Ej: 'Kit Jacobs 340B para Kenworth T680'",
    "tipo_freno":  "text NOT NULL",
    "precio_usd":  "numeric(12,2) — Precio del kit completo",
    "activo":      "boolean DEFAULT true",
    "created_at":  "timestamptz DEFAULT now()"
  }
}
```

### Configuración Global
```json
{
  "tabla": "configuracion",
  "campos": {
    "id":              "uuid PRIMARY KEY DEFAULT gen_random_uuid()",
    "clave":           "text UNIQUE NOT NULL — Ej: 'tipo_cambio_usd_mxn'",
    "valor":           "text NOT NULL — Ej: '17.25'",
    "descripcion":     "text",
    "updated_at":      "timestamptz DEFAULT now()",
    "updated_by":      "uuid REFERENCES usuarios(id)"
  }
}
```

---

## Diagrama de Relaciones (Simplificado)

```
configuracion (tipo_cambio, etc.)

empresas ──┬── sucursales
            ├── contactos
            └── ordenes_servicio ──┬── cotizaciones ── cotizacion_items ── inventario/kits
                                   ├── ordenes_trabajo ── orden_trabajo_piezas ── inventario/kits
                                   ├── fotos_servicio
                                   └── historial_etapas

usuarios (auth) ── roles: dueno | admin | ventas | tecnico | cliente
```
