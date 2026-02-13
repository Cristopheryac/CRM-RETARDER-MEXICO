# Plan de Tareas - CRM Retarder México

## Fase E: Estrategia 🔄
- [x] Responder preguntas de descubrimiento
- [x] Definir esquema de datos
- [ ] Validar con cliente

## Fase T: Tests ✅
- [x] Verificar stack tecnológico (Python 3.11, Node 22, supabase-py 2.28)
- [x] Probar conexión a Supabase (5/5 PASS — credenciales configuradas)

## Fase A: Arquitectura ✅
- [x] Inicializar proyecto Next.js 15 + TypeScript + Tailwind CSS
- [x] Crear cliente Supabase y tipos TypeScript
- [x] Módulo Ventas de Frenos (BrakeSelector, KitConfigurator, ExchangeRateInput, QuotationPreview)
- [x] Build verificado (0 errores)
- [x] Dashboard ejecutivo con Recharts (pipeline, ventas por tipo, top clientes, prioridades)
- [x] Navegación global (NavHeader) y home page con KPIs
- [x] Supabase client resiliente (fallback a demo sin credenciales)
- [ ] Diseñar base de datos (tablas en Supabase)
- [ ] Crear SOPs técnicos

## Fase P: Pulido 🔄
- [x] Home page con KPIs, navegación a módulos, actividad reciente
- [x] Dashboard ejecutivo con 4 gráficas + tabla de cotizaciones
- [x] Navegación global consistente (NavHeader en layout)
- [ ] Responsive fine-tuning
- [ ] Tema oscuro (opcional)

## Fase A: Automatización 🔄
- [x] SessionStart hook para Claude Code web (npm install)
- [x] ESLint configurado (.eslintrc.json)
- [ ] Configurar despliegue (Vercel / similar)
