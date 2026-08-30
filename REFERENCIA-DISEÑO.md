# Estudio de referencia: Whapicommerce + Mantenimiento (AppSheet)

Documento de relevamiento de dos interfaces existentes, para usar como referencia de diseño y funcionalidad al construir una nueva app. Pensado para pasarlo directo a Claude Code como contexto de diseño.

---

## 1. WHAPICOMMERCE (panel de e-commerce vía WhatsApp)

App de gestión de tienda online orientada a venta por WhatsApp. Tiene dos superficies: **panel de administración** (dueño de la tienda) y **storefront público** (cliente final).

### 1.1 Layout general del panel admin

- Sidebar izquierdo fijo, ancho ~250px, fondo casi negro (#0d0f11 aprox).
- Sidebar dividido en dos grupos con label pequeño en mayúsculas gris: **VENDER** y **CUENTA**.
- Dentro de "VENDER": Inicio, Punto de venta, Pedidos, Clientes, Inteligencia, Catálogo (submenú colapsable: Productos, Categorías), Integraciones.
- Dentro de "CUENTA": Configuración (submenú colapsable: Personalizar tienda, Métodos de pago, Envíos, Mis tiendas, Equipo).
- Al final del sidebar, fuera de los grupos: Novedades (ícono de sparkle/rayo).
- Footer del sidebar: versión de la app en gris tenue ("v0.3 · whapicommerce").
- El sidebar es colapsable: al entrar a ciertas vistas (ej. Punto de venta) se oculta y aparece un ícono hamburguesa para volver a mostrarlo — libera espacio horizontal para vistas operativas.
- Logo arriba a la izquierda del sidebar: ícono + wordmark "Whapicommerce" con "commerce" en verde lima, resto en blanco.

### 1.2 Topbar

- Selector de tienda activa (dropdown) con ícono/avatar cuadrado de la tienda + nombre + chevron — permite cambiar entre múltiples tiendas del mismo dueño.
- Badge/pill al lado: "Inventario propio" (indica el modo de inventario de esa tienda).
- Buscador global centrado, placeholder "Buscar productos, órdenes...", fondo gris oscuro con ícono de lupa.
- A la derecha: ícono de notificaciones (campana, verde cuando hay novedades), toggle de tema claro/oscuro (ícono sol/luna — el panel soporta ambos temas, el sidebar se mantiene oscuro pero el contenido cambia a fondo claro), avatar circular de usuario + nombre + chevron (menú de cuenta).

### 1.3 Paleta y estilo visual

- Fondo general: negro/gris muy oscuro.
- Tarjetas: gris oscuro (#1a1d21 aprox) con bordes sutiles 1px, esquinas redondeadas (~8-12px).
- Color de acento primario: **verde lima/lima brillante** (usado en botones primarios, links activos, valores positivos, badges de "conectado"/"activo").
- Color secundario: **azul** (usado en CTA de "agregar al carrito" en la tienda pública, algunos badges).
- Color de alerta/descuento: **rojo** (badges de descuento %, acción eliminar).
- Tipografía sans-serif limpia, jerarquía clara: títulos de página grandes y bold, subtítulos grises pequeños debajo.
- Mucho uso de badges tipo "pill" para estados (Publicado, Borrador, Conectada, Disponible, Pendiente de DNS, etc.).
- Iconografía: íconos de línea simples, con fondo de color suave detrás cuando son "badges de tipo" (ej. ícono de billete en verde para ventas, ícono de caja en azul para productos).

### 1.4 Patrones de componentes recurrentes

- **Header de sección**: título grande + subtítulo descriptivo (gris, una línea) + botón de acción principal (verde) alineado a la derecha. Se repite en TODAS las páginas.
- **Tabs horizontales de sub-vista**: fila de pestañas debajo del header para filtrar/segmentar dentro de una misma sección. Ejemplos: Pedidos (Todas/Por pagar/Pendientes/Pagadas/Completadas/Canceladas), Integraciones (Aplicaciones/Píxeles y marketing/API y MCP), Configuración > Personalizar tienda (Apariencia/Información del negocio/Comportamiento/Avanzado), Configuración > Métodos de pago (Métodos de pago/Caja), Configuración > Envíos (Métodos de envío/Zonas de entrega/Ruta).
- **Estados vacíos**: ícono circular gris centrado + título bold + texto explicativo gris debajo, dentro de un contenedor con borde punteado. Ejemplo: "Sin pedidos todavía — Cuando tus clientes hagan pedidos desde el storefront aparecerán aquí."
- **Tarjetas KPI** (dashboard "Inicio"): grid de 4 tarjetas, cada una con ícono de color a la izquierda (fondo de color suave + ícono), label pequeño gris arriba, valor grande abajo, y a veces un dato secundario chico debajo del valor. Ejemplos: Ventas (completadas) $0.00, Órdenes 0 (0 pendientes), Productos 1 (10 unidades en stock), Tiendas 1 (activa).
- **Panel de "Pedidos recientes"** + panel de **"Primeros pasos"** (checklist de onboarding con íconos de check verde, tachado cuando está completo) uno al lado del otro en el dashboard.
- **Listas de "método" con toggle**: fila con ícono + nombre + descripción a la izquierda, switch on/off a la derecha, y chevron para expandir detalle. Se repite en Métodos de pago y Métodos de envío. Botón "+ Agregar método de X" debajo con dropdown.
- **Tabla de productos**: checkbox por fila, columnas Producto (thumbnail + nombre), Categoría, Marca, Precio, Stock, y acciones de texto (Página / Eliminar) alineadas a la derecha. Buscador arriba de la tabla.
- **Ficha de edición de producto** (patrón de 2 columnas):
  - Columna principal (ancha): secciones colapsables en tarjetas — Multimedia (grid de hasta 6 imágenes + 3 videos, marcador de "Principal" con estrella y de "Bot" con ícono de mensaje, para definir qué imagen/video manda el bot de WhatsApp por defecto), Información básica (nombre, SKU, código de barras, descripción), Precio e inventario (toggle Simple/Con variantes, checkbox "Controlar inventario", checkbox "Vender por peso" con explicación, campos Costo/Precio de venta/Antes-oferta/Stock disponible), SEO y URL (colapsada).
  - Columna lateral (angosta, sticky): panel "Ventas" con métricas del producto (unidades, ingresos, stock actual, pedidos), panel "Ficha del agente" (contador tipo 0/5, colapsable), radio buttons de "Estado" (Borrador/Publicado/Archivado) estilo tarjeta seleccionable, campo de "Etiquetas" tipo tags input, panel "Resumen" con Ganancia $ y %, Descuento mostrado %, Precio venta.
  - Barra inferior fija (footer sticky) con estado actual a la izquierda, atajo de teclado (⌘/Ctrl+S guarda), botones Cancelar / Guardar cambios a la derecha.
  - Botones superiores: "Ver en tienda" y "Duplicar".
- **Categorías**: grid de tarjetas, cada una con ícono de tag de color distinto por categoría, nombre, contador de productos, botones editar/eliminar en la esquina.
- **Punto de venta (POS)**: vista de 2 columnas sin sidebar (modo focus). Izquierda: buscador de producto + grid de tarjetas de producto clickeables ("Toca un producto para agregarlo"). Derecha: panel de "Pedido" fijo con lista de ítems agregados, Subtotal, campo Descuento (con selector de moneda ARS), Total en grande, campos Cliente/Teléfono (requeridos, marcados con asterisco rojo), links "+ Envío/documento" y "+ Comprobante de pago", checkbox "Marcar como cobrado", botón CTA grande verde "Crear pedido - $X".
- **Pedidos**: toggle Lista/Tablero (vista tipo kanban vs lista) en la esquina superior derecha + botón "Nueva venta" verde. Tabs de filtro por estado debajo del header.
- **Inteligencia (analytics)**: selector de rango de fechas (7 días/30 días/90 días/Año) tipo pill-group arriba a la derecha. Tarjeta "hoy" con 3 métricas en línea (Pedidos generados, Entregados, Ganancia). Tarjeta grande de "Ganancia · últimos N días" con badge de "% de margen". Panel de "Ganancia por día" con placeholder de curva/gráfico. 3 tarjetas chicas abajo (Ingresos, Costo productos, Entregados). Mensaje explicativo abajo de todo cuando no hay datos suficientes.
- **Clientes**: tabs de filtro (Todos/Compradores/Sin comprar) + botón "+ Filtro" + buscador + botón "+ Nuevo cliente". Estado vacío con explicación de cómo se generan clientes automáticamente (por compra o por WhatsApp).
- **Integraciones**: tabs (Aplicaciones/Píxeles y marketing/API y MCP). Grid de tarjetas de integración: logo/ícono de la app, nombre, badge de estado (Conectada en verde / Disponible en gris), descripción corta, chevron a la derecha. Ejemplos: Whapify AI, Shopify, WooCommerce, Dropi.
- **Personalizar tienda > Apariencia**: sección "Identidad de la tienda" con selector de Logo (preview cuadrado) y Portada (dropzone grande con specs de tamaño), selector de "Color de marca" (input hex + swatches rápidos de colores predefinidos). Sección "Barra de anuncios" con toggle Mostrar, campo de texto del anuncio, checkbox "Texto deslizante" con selectores de color de fondo/texto y tamaño de fuente, campo de link opcional. Sección "Bloques de la página principal": lista reordenable (drag handle) de bloques tipo Banner/Carrusel con botones para agregar más, cada bloque con flechas subir/bajar, eliminar y expandir.
- **Personalizar tienda > Información del negocio**: datos de contacto (Nombre, WhatsApp, Email, Cédula/RUC/RIF, País, Zona horaria con UTC offset, Moneda), Dirección de origen (para guías de envío).
- **Personalizar tienda > Comportamiento**: toggles con explicación detallada debajo de cada uno (Inventario: ocultar agotados; Carrito: ir al carrito al agregar; Checkout: elegir entre "Abrir WhatsApp del cliente" o "Solo crear el pedido", presentado como dos tarjetas seleccionables lado a lado).
- **Personalizar tienda > Avanzado**: filas expandibles con ícono de color: Dirección de la tienda (subdominio, con badge del dominio actual), Dominio propio (badge "Pendiente de DNS"), Eliminar tienda (fila en rojo, zona de peligro).
- **Mis tiendas**: grid de tarjetas por tienda (logo, nombre, subdominio, fecha de creación, links Detalles/Ver tienda) + botón "+ Nueva tienda".
- **Equipo**: tabla de miembros (avatar, nombre, email, badge de rol tipo "DUEÑO" en amarillo/dorado, columna Permisos, Agregado, Acciones) + botón "+ Invitar miembro".
- **Novedades**: changelog tipo timeline, agrupado por mes (ej. "AGOSTO 2026"), cada entrada con punto verde a la izquierda, badge "NUEVO" + fecha, título bold, descripción y bullets de detalle. Banner destacado arriba: "Mejoramos Whapicommerce constantemente".

### 1.5 Storefront público (lo que ve el cliente final)

- **Tema claro** (contraste deliberado con el admin oscuro).
- Header simple: logo + nombre de tienda a la izquierda, buscador centrado, ícono de carrito con badge de cantidad a la derecha.
- Debajo del header: tarjeta blanca con nombre de la tienda + "N producto(s) disponible(s)".
- Banner/carrusel promocional ancho (imagen con texto superpuesto tipo "50% OFF").
- Chips de filtro por categoría (Todos, Ropa, etc.) estilo pill.
- Grid de productos: tarjetas con imagen, badge de descuento en la esquina (ej. "-30%" en rojo).
- **Página de producto**: breadcrumb (Inicio > Categoría > Producto), galería de imágenes grande con flechas prev/next + fila de miniaturas (incluye videos, marcados con ícono de play), nombre del producto, precio actual grande + precio tachado + badge de descuento, disponibilidad ("N disponibles"), descripción corta, selector de cantidad (− / número / +), dos CTAs: "Agregar al carrito" (azul) y "Comprar por WhatsApp" (verde, con ícono de WhatsApp).
- Botón flotante de WhatsApp fijo abajo a la derecha (verde, siempre visible).
- Banner de "Instalar app" (PWA) fijo abajo a la izquierda.

---

## 2. MANTENIMIENTO (app AppSheet — gestión de tickets multi-tienda)

App interna de gestión de mantenimiento/incidencias en múltiples locales/tiendas. Construida sobre AppSheet (Google), tema oscuro con acento magenta/rosa.

### 2.1 Layout general

- Topbar de color **magenta/rosa pastel fuerte**, contrastando con el resto de la app en oscuro — funciona como identidad visual de marca.
- Contenido del topbar: ícono hamburguesa (toggle menú) a la izquierda, logo circular de la app + nombre "MANTENIMIENTO", buscador centrado cuyo placeholder cambia dinámicamente según la vista activa (ej. "BUSCAR TICKETS DE GRUPOS", "BUSCAR USUARIOS"), ícono de refrescar, selector desplegable (chevron), avatar circular de usuario (letra inicial) con menú (muestra email + Cerrar sesión).
- Sidebar izquierdo con dos modos: **rail angosto de solo íconos** (colapsado, con tooltip al hacer hover mostrando el nombre) o **panel expandido** con ícono + nombre de cada vista. Mismo menú en ambos.
- Ítems del menú (8 vistas + acceso a galería): Carga Tickets, Asignación Tickets, Tickets de Grupos, Estado de las tiendas, Gráficas, Tiendas, Usuarios, Acerca de, y "App Gallery" al final (separado por una línea divisoria).

### 2.2 Paleta y estilo visual

- Fondo general: negro/gris muy oscuro (similar densidad a Whapicommerce).
- Color de marca / acento: **magenta-rosa** (topbar, ítem de menú activo, algunos íconos de estado).
- Codificación de estado por color en todas las listas — patrón central de esta app:
  - Rosa/magenta con ícono de gota o "»»": ticket nuevo / pendiente / sin asignar.
  - Verde con ícono de tilde/check: ticket terminado / asignado / aprobado.
  - En el gráfico de torta: azul claro = Aprobado, naranja fuerte = Cerrado, naranja claro = En espera, verde oscuro = Pendiente, verde claro = Solucionado.
- Tipografía condensada, mayúsculas para títulos de vista y encabezados de fila, texto en negrita para los datos clave (número de ticket, ID de tienda).
- Filas de lista sin bordes marcados, separadas por líneas divisorias muy sutiles; densidad de información alta (dos líneas de dato a la izquierda, dos líneas espejadas a la derecha).

### 2.3 Vistas y patrones de componentes

- **Carga Tickets**: lista simple, cada fila muestra dos datos con ícono de check verde (número de ticket + ID de tienda) a la izquierda y la localidad a la derecha. Botón "+ Añadir" arriba a la derecha, con íconos secundarios de exportar/filtrar/seleccionar. Al hacer click en una fila se abre vista maestro-detalle.
- **Vista detalle de ticket** (split view): panel derecho con label en mayúsculas gris pequeño arriba de cada valor. Campos observados: Fecha CT (fecha+hora), Numero ticket, ID tienda, Motivo (texto largo, formato "T.[id] - [descripción del problema] - [empresa]"), Direccion, Cargado por. Botones arriba: eliminar (basura), Editar, expandir, cerrar (X).
- **Formulario de edición/alta** (modal fullscreen): un campo por fila, label en mayúsculas arriba, campos obligatorios marcados con asterisco rosa. Campos del formulario de ticket: Fecha CT (con datepicker), Numero ticket, Motivo (textarea), ID Tienda (select/dropdown con ícono de check verde del valor elegido), Direccion, Provincia, Localidad, Cargado por (chip/tag), Nombre, Email... (formulario largo, scrolleable). Botones Cancelar / Guardar arriba a la derecha.
- **Asignación Tickets**: mismo layout de lista que Carga Tickets, pero la codificación de color indica si el ticket está o no asignado (rojo = sin asignar con ícono "»»", verde = asignado con ícono de check). Ícono de "enviar" (paper plane) a la derecha de cada fila para asignar/notificar.
- **Tickets de Grupos**: lista **agrupada en secciones colapsables por estado**, cada sección con: ícono de estado + nombre de sección en mayúsculas + contador dentro de un badge gris (ej. "NUEVAS 4", "TERMINADO 38"). Dentro de cada grupo, filas con el mismo patrón de dos columnas de datos. Panel lateral izquierdo adicional en esta vista con filtro rápido "TODO" + sub-categorías con contador (ej. EMERGENCIA 23, PRESUPUESTO 13, con subitem "COTIZAR EN TIEN... 6").
- **Estado de las tiendas**: layout con **panel de filtros lateral** (columna angosta a la izquierda de la lista) que permite filtrar por grupo/operario/lote de pago, cada filtro con su contador (ej. CONRRADO 63, G-JOSE 108, PAGADA-05-06-G-M... 1). Filtro "TODO" arriba para resetear. La lista principal mantiene las mismas secciones agrupadas por estado (NUEVAS, etc.) con contador.
- **Gráficas**: vista de dashboard con un **gráfico de dona (donut chart)** grande, título "ESTADO FINAL", leyenda de colores arriba (chips de color + nombre: [blank], Aprobado, Cerrado, En espera, Pendiente, Solucionado), etiquetas de valor superpuestas en cada segmento del donut. Botones arriba: alternar a vista tabla (ícono grid), exportar (ícono documento), Añadir, filtrar.
- **Tiendas**: vista de **grid de tarjetas** (4 columnas), cada tarjeta con: mini-mapa estático (thumbnail de Google Maps con pin, cuando la tienda tiene geolocalización cargada — si no, la tarjeta queda sin imagen), nombre de la localidad/tienda, número de ID debajo, ícono de teléfono a la derecha para llamada directa. Botón "+ Añadir" arriba.
- **Usuarios**: lista con avatar circular a la izquierda (foto/logo si está cargado, o ícono de alerta triangular gris como placeholder cuando falta), nombre, rol/área debajo (OPERARIO, OPERACIONES, ADMINISTRACION), código de grupo asociado a la derecha (ej. G-ALEXIS, G-NAZA), e iconos de acceso directo a email y teléfono debajo de cada fila.
- **Acerca de**: pantalla simple centrada con ícono/logo de la app, nombre "MANTENIMIENTO", y footer con links Terms/Privacy/Licenses/Version del build. Botón "OK" para cerrar.
- **Menú de usuario** (topbar): muestra el email de la cuenta logueada + opción "Cerrar sesión".

### 2.4 Modelo de datos inferido (para replicar backend/estructura)

- **Tickets**: numero_ticket, fecha_ct (datetime), motivo (texto largo con formato estructurado "T.[id_tienda] - descripción - empresa"), id_tienda (relación a Tiendas), direccion, provincia, localidad, cargado_por (relación a Usuarios), nombre, email, estado (Nuevo/Terminado/Aprobado/Cerrado/En espera/Pendiente/Solucionado), asignado (bool o relación a operario), grupo (agrupador tipo "G-NAZA", "G-JOSE" — parece mapear a operario/cuadrilla).
- **Tiendas**: id, nombre/localidad, dirección (con geolocalización opcional), teléfono, grupo/lote de pago asociado.
- **Usuarios**: nombre, rol (Operario/Operaciones/Administracion), grupo (código único tipo G-XXXX), email, teléfono, avatar/logo.
- Existe un concepto de "grupo" (cuadrilla u operario, ej. G-NAZA, G-MANU, G-JOSE, G-SOKO, G-AGUS) que atraviesa Tickets, Usuarios y Estado de tiendas — es el eje de asignación de trabajo.
- Existe un concepto de "lote de pago" (ej. "PAGADA-05-06-G-M...", "PAGADA-27-08-G-...") que agrupa tickets por fecha de pago y operario — probablemente para liquidaciones.

---

## 3. Diferencias clave a tener en cuenta al fusionar

| Aspecto | Whapicommerce | Mantenimiento |
|---|---|---|
| Color de marca | Verde lima | Magenta/rosa |
| Tema | Dark (admin) + Light (storefront) | Dark único |
| Navegación | Sidebar con grupos + submenús colapsables | Sidebar/rail con íconos, sin submenús |
| Patrón de lista | Tablas y tarjetas grid | Listas deck-view agrupadas por estado con contador |
| Detalle de registro | Página completa de edición (formulario largo, 2 columnas) | Panel split maestro-detalle + modal fullscreen para editar |
| Dashboard/analytics | KPIs + gráfico de línea + rango de fechas | Donut chart con leyenda |
| Codificación de estado | Badges de texto (pill) | Color + ícono en toda la fila (más agresivo visualmente) |
| Filtros | Tabs horizontales | Tabs horizontales + panel lateral de filtros con contador |
| Público final | Sí (storefront + WhatsApp) | No, es 100% interna/operativa |

---

*Documento generado a partir de exploración visual directa de ambas apps (capturas de pantalla y navegación por cada sección del menú).*
