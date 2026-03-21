# Complemento Clase 07 - Orden exacto de implementación

Este material complementa `clase07-estudiantes.md` y resume el orden exacto en que conviene construir la aplicación.

---

## 0) Orden recomendado de implementación

Para evitar confusiones, este es el orden más claro para construir la clase archivo por archivo:

1. `src/utils/cartStorage.js`
   Primero se crea la infraestructura del carrito: lectura desde `localStorage`, normalización de cantidades y protección contra datos inválidos.

2. `src/App.jsx`
   Después se levanta el estado global del carrito y se centralizan todas las operaciones principales.

3. `src/components/Header.jsx`
   Se actualiza para pasar el contador del carrito hacia `Navbar`.

4. `src/components/Navbar.jsx`
   Se añade la visualización del contador de unidades.

5. `src/styles/Navbar.module.css`
   Se agregan los estilos del badge del carrito.

6. `src/components/ProductCard.jsx`
   Se vuelve a adaptar la tarjeta para soportar un nuevo tipo de acción opcional: compra.

7. `src/styles/ProductCard.module.css`
   Se agregan los estilos del botón `Agregar al carrito`.

8. `src/pages/CategoryProducts.jsx`
   Se conecta el flujo de compra desde la página de categoría usando el callback del padre.

9. `src/pages/Cart.jsx`
   Se reemplaza el placeholder por la pantalla funcional del carrito.

10. `src/styles/Cart.module.css`
    Se completa la presentación visual del carrito y su resumen.

---

## 1) Lógica de este orden

Este orden funciona porque cada paso depende naturalmente del anterior:

1. Primero se crea la infraestructura.
2. Luego se crea el estado global.
3. Después se reparte ese estado a componentes de navegación y catálogo.
4. Al final se implementa la pantalla que consume todo ese flujo.

Si se intenta empezar por `Cart.jsx` antes de tener `App.jsx` listo, queda forzada porque todavía no existe el origen del estado.

---

## 2) Idea general del flujo

En esta etapa el proyecto queda así:

1. Flujo de catálogo:
   Home -> CategoryProducts -> Modal

2. Flujo de compra:
   CategoryProducts -> Agregar al carrito -> Navbar -> Cart

La clave pedagógica es que el carrito no es una página aislada.
Es un estado compartido que atraviesa varias partes de la interfaz.

---

## 3) Qué explica cada archivo

### `src/utils/cartStorage.js`

Explicación:

1. El carrito también necesita una capa de persistencia, igual que los productos.
2. `loadCartItems()` recupera los datos guardados.
3. `normalizeCartItem()` evita datos corruptos.
4. `clampQuantity()` limita la cantidad entre `1` y `stock`.

`cartStorage.js` hace que el carrito siempre arranque con datos válidos.

---

### `src/App.jsx`

Explicación:

1. `cartItems` vive en el padre porque varias vistas lo necesitan.
2. `useEffect()` guarda el carrito cada vez que cambia.
3. `handleAddToCart()` agrega o incrementa productos.
4. `handleUpdateCartItemQuantity()` ajusta cantidades sin salir del rango válido.
5. `handleRemoveCartItem()` borra una sola línea.
6. `handleClearCart()` vacía todo.
7. `cartItemCount` deriva el total de unidades.

`App` se convierte en el centro de control del carrito.

---

### `src/components/Header.jsx` y `src/components/Navbar.jsx`

Explicación:

1. `Header` no tiene lógica de negocio; solo reenvía props.
2. `Navbar` muestra el estado resumido del carrito.
3. El badge aparece solo si hay unidades agregadas.

No toda prop nueva implica nueva lógica; a veces solo hace falta pasarla al componente correcto.

---

### `src/components/ProductCard.jsx`

Explicación:

1. La tarjeta vuelve a ganar reutilización.
2. Ahora puede mostrar `onAddToCart`, `onDetails`, `onEdit` y `onDelete`.
3. `disableAddToCart` controla si el botón debe bloquearse.

La misma tarjeta sirve para vender, editar o informar, según las props que reciba.

---

### `src/pages/CategoryProducts.jsx`

Explicación:

1. Esta página no guarda el carrito.
2. Solo recibe `cartItems` y `onAddToCart`.
3. Usa un `Map` para saber cuántas unidades tiene cada producto dentro del carrito.
4. Deshabilita el botón cuando se alcanza el stock.

La página de categoría no es dueña del carrito; solo se conecta al flujo global.

---

### `src/pages/Cart.jsx`

Explicación:

1. La página tiene dos estados visuales: vacío y con productos.
2. Cada línea muestra precio unitario, cantidad y subtotal.
3. El resumen usa datos derivados: número de productos, unidades totales y total general.
4. Los botones `+` y `-` solo invocan callbacks del padre.

`Cart` renderiza y dispara acciones, pero la lógica real sigue en `App`.

---

## 4) Orden exacto para entender la clase

Recomendación de secuencia para entender el ciclo

1. Mostrar la experiencia final en el navegador.
2. Preguntarse: si recargo la página, ¿cómo hace React para recordar el carrito?
3. Abrir `src/utils/cartStorage.js`.
4. Después abrir `src/App.jsx`  mirar el estado global.
5. Mostrar `Header` y `Navbar` para ver cómo viaja el contador.
6. Abrir `ProductCard` y observar que la tarjeta sigue siendo reutilizable.
7. Abrir `CategoryProducts` y probar el bloqueo por stock.
8. Terminar con `Cart.jsx` y su resumen.
9. Cerrar con `Cart.module.css` solo si hace falta justificar el layout.

Este orden es mejor la mejor forma de entender el flujo real del producto.

---

## 5) Cambios que conviene remarcar

1. Antes no existía carrito persistente.
2. Ahora el carrito vive en `App`.
3. `ProductCard` no fue duplicado; fue extendido.
4. `CategoryProducts` no administra el carrito; solo dispara acciones.
5. `Navbar` da feedback inmediato del estado compartido.
6. `Cart` no inventa datos; solo deriva subtotales y total desde `cartItems`.
7. `localStorage` permite recuperar el carrito después de recargar.

---

## 6) Errores comunes para anticipar en clase

1. Guardar el carrito dentro de `Cart.jsx`.
   Problema: el navbar no se entera del cambio.

2. Guardar el carrito dentro de `CategoryProducts.jsx`.
   Problema: se pierde al salir de esa página.

3. No limitar la cantidad contra el `stock`.
   Problema: el usuario puede agregar más unidades de las disponibles.

4. No normalizar el carrito al leer `localStorage`.
   Problema: la UI puede romperse con datos viejos o corruptos.

5. Hacer que `ProductCard` decida sola cuándo vender o editar.
   Problema: pierde reutilización y mezcla responsabilidades.

---

## 7) Componentes que son útiles para lo implementado

1. `App` es el dueño del carrito.
2. `Navbar` solo refleja el estado global.
3. `ProductCard` se adapta según las props.
4. `CategoryProducts` dispara la compra, pero no guarda el carrito.
5. `Cart` deriva subtotales y total.
6. `localStorage` conserva la compra al recargar.
7. `stock` limita la cantidad máxima.

---

## 8) Resumen final

Esta clase es importante porque transforma el catálogo en una experiencia de compra real:

1. El usuario ya no solo navega productos.
2. Ahora puede construir una compra.
3. El estado se comparte entre varias pantallas.
4. La persistencia local mantiene el flujo después de recargar.
5. La semana 08 puede enfocarse en checkout mock, confirmación e historial de órdenes sin volver a tocar la base del carrito.
