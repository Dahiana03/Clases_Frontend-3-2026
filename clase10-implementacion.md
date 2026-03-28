# Clase 10 — Guía de implementación

**Resumen breve**
Esta guía describe el orden exacto y los pasos para implementar la sección "Mi cuenta" (perfil, historial y detalle de órdenes) en el proyecto `frontend-sistema-ventas`. Está pensada para usarse en la clase: explicar, implementar y validar sin introducir autenticación ni backend real.

---

**Objetivos de la clase**
- Permitir al usuario consultar las compras guardadas en el navegador (localStorage).
- Reforzar el uso de `react-router-dom` con rutas anidadas y parámetros (`/user/profile`, `/user/orders`, `/user/orders/:orderId`).
- Reutilizar la persistencia ya existente (`src/utils/ordersStorage.js`) y mostrar datos en nuevas vistas.
- Mantener el alcance educativo: sin autenticación real ni backend.

---

## Orden recomendado de implementación (paso a paso)

1) Preparación
- Abrir el proyecto: `cd frontend-sistema-ventas`.
- Instalar dependencias y levantar el dev server si quieres probar en caliente:

```bash
npm install
npm run dev
```

- Abrir DevTools → Application → Local Storage para inspeccionar órdenes actuales (clave `orders`).

2) Revisar la fuente de datos
- Archivo: `src/utils/ordersStorage.js`.
- Objetivo: entender la estructura de una orden (campo `id`, `createdAt`, `items`, `customer`, `shippingMethod`, `paymentMethod`, `totals`) y confirmar las funciones públicas: `loadOrders()`, `saveOrder()`, `loadOrdersByUserId()`.
- Por qué: asegurar compatibilidad con las vistas que mostrarán las órdenes.

3) Añadir rutas (si aún no existen)
- Archivo: `src/App.jsx`.
- Rutas a asegurar/registrar:
  - `/user/profile` → `UserProfile`
  - `/user/orders` → `UserOrders`
  - `/user/orders/:orderId` → `OrderDetail`
- Nota: en esta clase las rutas permanecen públicas (o pueden seguir usando `ProtectedRoute` si el proyecto ya tiene autenticación). No introducir lógica nueva de auth en esta etapa.

4) Ajustar navegación global
- Archivo: `src/components/Navbar.jsx`.
- Acción: añadir acceso visible a "Mi cuenta" en el menú principal que lleve a `/user/profile`.
- Detectar ruta activa: marcar la sección como activa cuando `location.pathname` comience con `/user/`.

5) Implementar `UserProfile`
- Archivo: `src/pages/UserProfile.jsx`.
- Contenido mínimo:
  - Mostrar datos mock del usuario (se puede reutilizar `currentUser` o el `customer` de la última orden si existe).
  - Mostrar resumen: total de órdenes guardadas, id y total de la última orden.
  - Botón/Link para abrir `/user/orders` y para abrir la última orden si existe.
- Por qué: puerta de entrada a la sección de cuenta y demostración de reutilización de datos persistidos.

6) Implementar `UserOrders`
- Archivo: `src/pages/UserOrders.jsx`.
- Contenido mínimo:
  - Cargar órdenes: `loadOrders()` o `orderService.getOrdersByUserIdAsync(currentUser?.id)`.
  - Ordenar por `createdAt` (descendente).
  - Renderizar una lista de tarjetas (`OrderCard`) por orden.
  - Manejar estados: loading, error y vacío (mensaje amigable y CTA para explorar productos o ir al perfil).

7) Crear `OrderCard` (componente)
- Archivo: `src/components/OrderCard.jsx` (si no existe).
- Propósito: mostrar resumen compacto de la orden (id, cliente, fecha, total, items count, envío, pago) y un botón para abrir el detalle (`/user/orders/:orderId`).
- Reutilizable para listas y mini vistas.

8) Implementar `OrderDetail`
- Archivo: `src/pages/OrderDetail.jsx`.
- Contenido mínimo:
  - Usar `useParams()` para obtener `orderId`.
  - Buscar la orden en `loadOrders()` (o `orderService.getOrderByIdForUserAsync`).
  - Mostrar cliente, items, envío, pago y totales.
  - Manejar orden inexistente con un fallback controlado (mensaje y botones para volver al historial o inicio).
- Por qué: enseñar uso de rutas parametrizadas para abrir entidades concretas y soportar recargas.

9) Conectar `OrderConfirmation`
- Archivo: `src/pages/OrderConfirmation.jsx`.
- Acción: añadir CTA/botón para `Ver historial` que navegue a `/user/orders`.
- Por qué: cerrar el flujo de compra hacia la experiencia de consulta.

10) Verificación manual
- Pasos de prueba:
  1. Completar checkout y confirmar que la orden se guarda en `localStorage` (clave `orders`).
  2. Ir a `Mi cuenta` → `Perfil` y verificar resumen de compras.
  3. Abrir `Mis órdenes`, comprobar listado y orden por fecha.
  4. Abrir una orden, recargar la página y confirmar que el detalle persiste.
  5. Probar una ruta con `orderId` inexistente y verificar mensaje de fallback.

11) Calidad y entrega
- Ejecutar lint y build:

```bash
npm run lint
npm run build
```

- Commits sugeridos:

```bash
git add src/App.jsx src/components/Navbar.jsx src/pages/UserProfile.jsx src/pages/UserOrders.jsx src/pages/OrderDetail.jsx src/components/OrderCard.jsx src/pages/OrderConfirmation.jsx src/utils/ordersStorage.js src/styles/UserProfile.module.css src/styles/UserOrders.module.css src/styles/OrderDetail.module.css src/styles/OrderCard.module.css src/styles/OrderConfirmation.module.css
git commit -m "feat: add user account and orders routes"
```

> Opcional: fragmentar commits por funcionalidad: rutas + navbar; perfil; historial; detalle.

---

## Qué archivos se afectan y por qué
- `src/utils/ordersStorage.js`: fuente de verdad para leer/guardar órdenes; no se debe cambiar la shape.
- `src/App.jsx`: registrar rutas de usuario para renderizar las nuevas vistas.
- `src/components/Navbar.jsx`: exponer el acceso `Mi cuenta` desde el menú.
- `src/pages/UserProfile.jsx`: vista de perfil (datos mock + resumen de órdenes).
- `src/pages/UserOrders.jsx`: listado de órdenes persistidas.
- `src/components/OrderCard.jsx`: tarjeta reutilizable para cada orden.
- `src/pages/OrderDetail.jsx`: detalle de cada orden mediante `:orderId`.
- `src/pages/OrderConfirmation.jsx`: añadir enlace al historial desde la confirmación.

---

## Decisiones y supuestos
- La clase NO implementa autenticación completa; las rutas pueden permanecer públicas o usar las protections existentes si el proyecto ya incluye auth.
- El escenario es de un único usuario por navegador: `localStorage` es suficiente para la experiencia de la clase.
- Reutilizamos utilidades y servicios existentes (`orderService`, `ordersStorage`) para evitar duplicación.

---

## Errores comunes y cómo evitarlos
- No manejar el estado vacío del historial → implementar un `empty state` con CTA.
- No validar `orderId` en `OrderDetail` → mostrar fallback controlado.
- Duplicar la persistencia de órdenes desde la clase 10 → reutilizar `saveOrder()` y `loadOrders()`.
- Introducir auth en esta clase → evitar para mantener el alcance.

---
