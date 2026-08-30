# Documento de Diseño — Ticketera Multi-Tienda

Traduce el `prd.md` en specs de UI concretas, fusionando lo mejor de las dos referencias relevadas en `REFERENCIA-DISEÑO.md`: el **pulido visual y los patrones de componentes de Whapicommerce** (sidebar, header de sección, KPIs, estados vacíos, badges pill) con la **lógica operativa de Mantenimiento** (listas agrupadas por estado con contador, panel split maestro-detalle, filtros laterales).

No es una clonación — es una síntesis funcional pensada para este dominio (tickets, no e-commerce).

## 1. Identidad visual

| Elemento | Decisión |
|---|---|
| Tema | Oscuro único (como Mantenimiento), sin toggle claro/oscuro en el MVP — se agrega en v2 si hace falta |
| Color de marca / acento primario | **Azul eléctrico** (`#3B82F6` aprox) — neutral, no compite con los colores de estado de los tickets (que necesitan su propia paleta clara: rosa/verde/naranja/rojo) |
| Fondo general | Negro/gris muy oscuro `#0d0f11` (igual que ambas referencias) |
| Tarjetas/paneles | Gris oscuro `#1a1d21`, borde sutil 1px, radio ~10px |
| Tipografía | Sans-serif limpia (Inter o similar). Títulos de página grandes y bold + subtítulo gris descriptivo debajo — patrón de Whapicommerce, más legible que las mayúsculas condensadas de Mantenimiento |

### 1.1 Paleta de estado (tickets)

Se mantiene el patrón de Mantenimiento (color + ícono en toda la fila, no solo un badge de texto) porque en una lista operativa de alta densidad se escanea más rápido que un pill sutil.

| Estado | Color | Ícono |
|---|---|---|
| Nuevo | Rosa/magenta | Gota / `»»` |
| Asignado | Amarillo/ámbar | Reloj |
| En curso | Azul | Engranaje |
| Terminado | Verde claro | Check |
| Aprobado | Verde oscuro | Check doble |
| Cerrado | Gris | Candado |
| Cancelado | Rojo | X |

Urgencia (campo separado, ver PRD §3.1) se muestra como badge chico aparte, no reemplaza el color de estado: Emergencia = rojo, Alta = naranja, Media = amarillo, Baja = gris.

## 2. Layout general

- **Sidebar izquierdo fijo**, ~240px, fondo casi negro, colapsable a rail de íconos (patrón Whapicommerce + Mantenimiento combinado).
- Logo + nombre de la empresa activa arriba del sidebar (no hay selector de "tienda activa" como Whapicommerce — acá el selector relevante es de **empresa**, solo visible para `super_admin`; el resto de los roles ya está fijo a su empresa).
- Ítems de menú agrupados por sección, con label chico en mayúsculas gris (patrón Whapicommerce):
  - **OPERACIÓN**: Tickets, Compras, Logística
  - **GESTIÓN**: Tiendas, Usuarios / Equipo
  - (Solo si es `super_admin`, se reemplaza todo el sidebar por el del Panel Super Admin — ver §7)
- Cada ítem de menú se muestra u oculta según el rol logueado (un `operario` no ve "Usuarios/Equipo"; `compras` no ve "Logística"; etc. — mapea 1:1 con la tabla de roles del PRD §2).

### 2.1 Topbar

- Buscador global centrado (placeholder cambia según la vista activa, patrón Mantenimiento: "Buscar tickets...", "Buscar tiendas...").
- Derecha: ícono de notificaciones (sin funcionalidad real en MVP, solo el ícono — reservado para v2), avatar circular + nombre + chevron (menú: email, Cerrar sesión).

## 3. Módulo Tickets

### 3.1 Vista lista — "Tickets" (default al entrar)

Fusión del patrón "Tickets de Grupos" de Mantenimiento con el header de sección de Whapicommerce:

- Header de sección: título "Tickets" + subtítulo gris ("Gestioná las incidencias de todas tus tiendas") + botón primario azul "+ Nuevo ticket" alineado a la derecha.
- Tabs horizontales debajo del header, uno por estado + "Todos": `Todos | Nuevo | Asignado | En curso | Terminado | Aprobado | Cerrado`. Cada tab con contador (ej. "Nuevo (4)").
- Debajo de los tabs: fila de filtros rápidos — por tienda, por grupo/cuadrilla, por urgencia — estilo pill-group horizontal (no panel lateral fijo; el panel lateral de Mantenimiento se reserva para cuando la lista de filtros crece mucho, no hace falta en el MVP).
- Lista agrupada por estado con secciones colapsables (si está en tab "Todos") o lista plana (si hay un tab de estado específico seleccionado). Cada fila:
  - Ícono + color de estado a la izquierda.
  - Columna principal: `#[numero_ticket]` en bold + motivo (truncado a 1 línea).
  - Columna secundaria: nombre de tienda + badge de urgencia.
  - Columna derecha: grupo/cuadrilla asignado (o "Sin asignar" en gris si `grupo_asignado_id` es null), fecha relativa ("hace 2h").
  - Badges chicos si `requiere_compra` (ícono carrito) y/o `requiere_logistica` (ícono camión) están en `true`.
- Estado vacío (patrón Whapicommerce): ícono circular gris + "Sin tickets todavía" + texto explicativo, dentro de contenedor con borde punteado.

### 3.2 Vista detalle de ticket (split view / página completa)

Se prioriza **página completa** sobre split-view modal (más cómodo para el timeline y galería de fotos, que necesitan espacio vertical) — layout de 2 columnas como la ficha de producto de Whapicommerce:

- **Columna principal (ancha)**:
  - Header: `#[numero_ticket]` + badge de estado grande + badge de urgencia. Botones "Editar" y "Cancelar ticket" (solo admin) arriba a la derecha.
  - Sección "Detalle": tienda, motivo (texto completo), tipo de trámite, fecha de creación, cargado por.
  - Sección "Fotos" (`ticket_fotos`): grid de miniaturas clickeables (lightbox al abrir), cada una con quién la subió y cuándo.
  - Sección "Timeline" (`ticket_eventos`): lista cronológica tipo Novedades de Whapicommerce (punto de color a la izquierda + texto + fecha), muestra cambios de estado, comentarios y fotos agregadas, con nombre del usuario que hizo cada acción.
  - Campo de comentario nuevo al final del timeline (textarea + botón "Agregar comentario"), visible para todos los roles con acceso al ticket.
- **Columna lateral (angosta, sticky)**:
  - Panel "Estado": estado actual + botón de acción según el rol y la matriz de transición del PRD §2.1 (ej. si sos operario y el ticket está "Asignado", el botón dice "Tomar y empezar" → pasa a "En curso"; si está "En curso", el botón dice "Marcar terminado"). Si el rol no tiene una transición válida disponible, no se muestra botón — solo el estado actual, en modo lectura.
  - Panel "Asignación": grupo/cuadrilla asignado (editable solo por admin, dropdown de grupos de la empresa).
  - Panel "Requiere": dos toggles (Compra / Logística), editable solo por admin — al activarlos, el ticket aparece en el módulo correspondiente.
  - Panel "Compras/Logística vinculadas" (si corresponde): mini-lista de las órdenes de compra o envíos generados desde este ticket, con link directo.

### 3.3 Formulario de alta/edición de ticket

Modal fullscreen (patrón Mantenimiento) en vez de página aparte — es un formulario corto y se usa muy seguido (encargados lo abren muchas veces por día):

- Campos: Tienda (select, filtrado a las tiendas asignadas al usuario si es `encargado`), Motivo (textarea), Urgencia (radio-cards: Baja/Media/Alta/Emergencia), Tipo de trámite (select), Fotos (dropzone múltiple).
- Los campos "requiere_compra"/"requiere_logistica" y "grupo_asignado" **no están en este formulario** — se setean después, desde el panel lateral del detalle, por el admin. Un encargado solo reporta el problema; no decide asignación ni logística.
- Botones Cancelar / Crear ticket arriba a la derecha, sticky.

## 4. Módulo Compras

- Header de sección + botón "+ Nueva orden" (solo disponible desde el detalle de un ticket marcado `requiere_compra`, no suelto).
- Tabs por estado: `Pendiente | Comprado | Entregado`.
- Lista de órdenes: proveedor, ticket vinculado (`#numero_ticket`, clickeable), fecha, badge de estado.
- Vista de Proveedores como sub-tab dentro del mismo módulo (`Órdenes | Proveedores`), con alta simple (nombre + contacto) en modal chico.

## 5. Módulo Logística

- Mismo patrón que Compras: Header + tabs por estado (`Pendiente | En tránsito | Entregado`).
- Lista de envíos: origen → destino (tienda), ticket vinculado, fecha estimada, badge de estado.
- Sin proveedor propio — el envío pertenece 100% a la operación interna de la empresa.

## 6. Módulo Tiendas

- Grid de tarjetas (patrón Mantenimiento + Whapicommerce combinados): mini-mapa si tiene `lat/lng`, nombre, dirección debajo, ícono de teléfono clickeable a la derecha.
- Botón "+ Nueva tienda" arriba, modal de alta (nombre, dirección, teléfono, selector de ubicación en mapa para `lat/lng`).
- Click en una tarjeta abre detalle simple: datos + lista de tickets recientes de esa tienda + lista de encargados asignados (vía `usuario_tiendas`).

## 7. Módulo Usuarios / Equipo

Tabla de miembros (patrón "Equipo" de Whapicommerce):
- Columnas: avatar, nombre, email, badge de rol (color distinto por rol), grupo (si es operario) o tiendas asignadas (si es encargado, chips), Agregado (fecha), Acciones.
- Botón "+ Invitar miembro" → modal: email, rol, y campo condicional según el rol elegido (si `operario` → selector de grupo; si `encargado` → selector múltiple de tiendas). Dispara `inviteUserByEmail` de Supabase Auth.
- Sub-tab "Grupos/Cuadrillas" dentro del mismo módulo: lista simple de grupos con sus miembros, alta/edición/baja de grupo.

## 8. Panel Super Admin

Layout completamente separado (sidebar propio, sin las secciones de empresa):

- Vista "Empresas": tabla (nombre, fecha de alta, cantidad de tiendas, cantidad de usuarios, cantidad de tickets, badge estado activa/suspendida, acciones suspender/activar).
- Dashboard simple arriba con 3-4 tarjetas KPI (patrón Whapicommerce): Empresas activas, Tickets totales en la plataforma, Usuarios totales, Empresas nuevas este mes.
- Sin acceso a datos operativos de ninguna empresa individual (tickets, compras, etc.) — solo métricas agregadas y gestión de alta/baja, tal como define el PRD §2.

## 9. Componentes compartidos (reutilizables en todos los módulos)

- **Header de sección**: título + subtítulo + acción primaria a la derecha.
- **Badge de estado**: color + ícono + texto, mismo componente reutilizado en tickets, compras y logística (cada módulo define su propio mapa de color/estado).
- **Estado vacío**: ícono circular + título + texto + borde punteado.
- **Modal fullscreen de formulario**: header con Cancelar/Guardar sticky arriba a la derecha.
- **Tarjeta KPI**: ícono con fondo de color suave + label chico + valor grande.
- **Toast de confirmación**: esquina inferior derecha, para acciones como "Ticket creado", "Orden marcada como comprada".

## 10. Responsive

MVP prioriza **desktop/tablet** (es una herramienta operativa de oficina/backoffice) pero el sidebar colapsable a rail y las listas en columna única en mobile deben funcionar como fallback razonable — no se optimiza mobile a fondo en esta primera versión, salvo el formulario de alta de ticket (un encargado puede querer cargarlo desde el celular parado en la tienda).

---

*Generado en el Paso 2 (Diseño) de la metodología de 6 pasos, a partir del `prd.md` revisado y de `REFERENCIA-DISEÑO.md`. Próximo paso: Reglas Técnicas (Tech Stack).*
