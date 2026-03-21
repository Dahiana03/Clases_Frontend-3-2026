# Complemento Clase 08 - Orden exacto de implementación

Este material complementa `clase08-estudiantes.md` y resume el orden exacto en que conviene construir la etapa de checkout para entenderla con claridad.

---

## 0) Orden recomendado de implementación

Para evitar confusiones, este es el orden más claro para construir la clase y entenderla archivo por archivo:

1. `src/utils/calculateOrderTotals.js`
   Primero se crea la infraestructura de cálculo del pedido: subtotal, IVA, envío y total.

2. `src/utils/ordersStorage.js`
   Después se agrega la persistencia de órdenes con el mismo patrón que ya existe para productos y carrito.

3. `src/pages/Cart.jsx`
   Luego se agrega la salida natural hacia el checkout con el botón `Proceder al checkout`.

4. `src/styles/Cart.module.css`
   Se agregan los estilos del nuevo botón.

5. `src/pages/Checkout.jsx`
   Después se construye el formulario controlado con validaciones básicas.

6. `src/styles/Checkout.module.css`
   Se da forma visual al formulario y al resumen del pedido.

7. `src/pages/OrderConfirmation.jsx`
   Luego se construye la vista final de la compra.

8. `src/styles/OrderConfirmation.module.css`
   Se completa la parte visual de la confirmación.

9. `src/App.jsx`
   Al final se conecta toda la navegación y la lógica global del checkout.

---

## 1) Lógica de este orden

Este orden funciona porque sigue una dependencia natural:

1. Primero se crean las utilidades.
2. Luego se crea la salida desde carrito.
3. Después se crea la pantalla intermedia del checkout.
4. Luego se crea la pantalla final de confirmación.
5. Finalmente se conecta todo desde `App`.

Si se empieza por `App.jsx` demasiado pronto, su entendimiento se vuelve abstracto porque todavía no existen las piezas concretas que va a orquestar.

---

## 2) Idea general del flujo

En esta etapa el proyecto queda así:

1. Flujo de catálogo:
   Home -> CategoryProducts -> Cart

2. Flujo de compra:
   Cart -> Checkout -> OrderConfirmation

La idea central es que el carrito ya no es el final del proceso.
Ahora el usuario realmente puede cerrar una compra.

---

## 3) Qué explica cada archivo

### `src/utils/calculateOrderTotals.js`

Explicación:

1. La fórmula de la compra no debe estar dispersa en varias páginas.
2. Las opciones de envío y pago se modelan como arreglos reutilizables.
3. `calculateCartSubtotal()` resuelve un cálculo parcial.
4. `calculateOrderTotals()` resuelve el cálculo final.

La matemática del checkout vive en una utilidad, no en la UI.

---

### `src/utils/ordersStorage.js`

Explicación:

1. Igual que con productos y carrito, las órdenes necesitan persistencia segura.
2. `normalizeOrder()` protege la estructura.
3. `saveOrder()` agrega la orden al historial local.
4. `loadOrders()` recupera el historial si luego se quiere mostrar.

La compra confirmada no debe desaparecer al recargar.

---

### `src/pages/Cart.jsx`

Explicación:

1. El carrito ya existía, pero faltaba su salida natural.
2. El botón `Proceder al checkout` marca el cambio de etapa.
3. El carrito deja de ser el final del flujo.

`Cart` ahora no solo resume; también conecta con la compra final.

---

### `src/pages/Checkout.jsx`

Explicación:

1. La página usa formulario controlado.
2. La validación es local y suficiente para un checkout mock.
3. `useMemo()` recalcula el resumen si cambia el envío.
4. La página no guarda la orden; solo recopila y entrega información.

`Checkout` junta datos y calcula el pedido, pero no es el dueño final de la orden.

---

### `src/pages/OrderConfirmation.jsx`

Explicación:

1. Esta página representa el cierre de la compra.
2. Si no hay orden, la UI se protege con un fallback.
3. La información mostrada depende de la orden creada en `App`.

La confirmación muestra un resultado ya procesado, no vuelve a calcular la compra.

---

### `src/App.jsx`

Explicación:

1. `App` sigue siendo el orquestador de la navegación por estado.
2. Se agregan nuevas vistas: `checkout` y `order-confirmation`.
3. `handleStartCheckout()` abre la etapa de pago.
4. `handleCompleteCheckout()` arma la orden final, la guarda y vacía el carrito.
5. `handleBackHomeAfterOrder()` limpia la orden actual y vuelve al inicio.

`App` conecta todas las piezas y convierte formularios y pantallas en un flujo real.

---

## 4) Orden exacto para entender la clase

Recomendación de secuencia:

1. Mostrar el flujo final en el navegador.
2. Recordar que semana 07 terminaba en carrito.
3. Abrir `calculateOrderTotals.js` para entender el cálculo del pedido.
4. Abrir `ordersStorage.js` para entender persistencia.
5. Mostrar el nuevo botón en `Cart.jsx`.
6. Entender `Checkout.jsx` y su validación.
7. Mostrar `OrderConfirmation.jsx` como cierre de compra.
8. Terminar con `App.jsx` entendiendo cómo se conecta todo.

Este orden es mejor que empezar desde `App.jsx` como al comienzo porque primero se entienden las piezas concretas y después la coordinación general.

---

## 5) Cambios que conviene remarcar

1. El carrito ya existía, pero todavía no completaba una compra.
2. El checkout es una etapa nueva, no un reemplazo del carrito.
3. La orden se arma una sola vez al confirmar.
4. La confirmación muestra el resultado, no vuelve a pedir datos.
5. `localStorage` permite que la orden persista.
6. `App` sigue resolviendo la navegación sin router.

---

## 6) Errores comunes para anticipar en clase

1. Calcular el total directamente en cada página.
   Problema: duplicación de lógica.

2. Guardar la orden dentro de `Checkout.jsx`.
   Problema: se pierde el control global del flujo.

3. No vaciar el carrito al confirmar.
   Problema: la compra queda duplicable sin sentido.

4. No validar campos obligatorios.
   Problema: se pueden generar órdenes vacías o incompletas.

5. Usar `Cart` como confirmación final.
   Problema: se mezclan dos etapas distintas del flujo.

---

## 7) Frases cortas útiles para clase

1. El carrito prepara la compra.
2. El checkout recoge datos y calcula el pedido.
3. La confirmación muestra el resultado final.
4. `App` coordina el flujo completo.
5. La orden queda persistida en `localStorage`.
6. Esta etapa cierra la compra sin necesidad de router.

---

## 8) Resumen final

Esta clase es importante porque cierra el flujo comercial del proyecto:

1. El usuario navega productos.
2. Agrega al carrito.
3. Completa datos en checkout.
4. Confirma la compra.
5. Recibe una confirmación persistida.

Con esto, el proyecto ya no queda pendiente de funcionalidad principal de compra.
Lo siguiente ya es otra etapa: mejoras y migración a `react-router-dom`.
