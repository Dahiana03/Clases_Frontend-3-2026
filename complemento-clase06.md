# Complemento Clase 06 — Resumen de Explicaciones

Este material complementa `clase06-estudiantes.md` y resume las explicaciones conceptuales que surgieron después de construir la clase.

---

## 0) Orden recomendado de implementación

Para evitar confusiones, este es el orden más claro para construir la clase y explicar los cambios archivo por archivo:

1. `src/data/products.js`
   Primero se prepara la data base del catálogo agregando o confirmando `category`, `stock` y `rating`.

2. `src/utils/productsStorage.js`
   Después se centraliza la carga de productos desde `localStorage`, la normalización de datos y la protección del `rating`.

3. `src/components/ProductCard.jsx`
   Luego se adapta la tarjeta para que sea reutilizable y soporte acciones opcionales como `onDetails`, `onEdit` y `onDelete`.

4. `src/components/ProductDetailsModal.jsx`
   Después se crea el modal de detalle para mostrar información extendida del producto.

5. `src/pages/CategoryProducts.jsx`
   Con el modal y la tarjeta listos, se construye la página de categoría con filtro por nombre y apertura del modal.

6. `src/pages/Home.jsx`
   Luego se transforma el Home para que muestre una categoría destacada por grupo, usando el producto con mejor rating como portada.

7. `src/App.jsx`
   Después se conecta toda la navegación por estado sin router, usando `activePage` y `selectedCategory`.

8. `src/components/ProductForm.jsx`
   Luego se revisa el formulario para asegurar que preserve `rating` y no rompa la lógica del Home ni del modal.

9. `src/pages/ProductList.jsx`
   Al final se consolida la pantalla administrativa del catálogo, manteniendo crear, editar, eliminar y persistencia.

## 1) Lógica de este orden

Este orden está pensado para que cada archivo nuevo o modificado dependa del anterior de forma natural:

1. Primero se prepara la data.
2. Luego se prepara la infraestructura.
3. Después se crean los componentes reutilizables.
4. Luego se crean las páginas.
5. Finalmente se conecta todo desde `App.jsx` y se consolida el flujo completo.

---

## 2) Idea general del flujo

En esta clase el proyecto queda dividido en dos recorridos claros:

1. Flujo de usuario:
   Home -> CategoryProducts -> Modal de detalle

2. Flujo de administración:
   ProductList -> Crear / Editar / Eliminar

La idea central es que el Home ya no muestra una pantalla vacía. Ahora muestra categorías destacadas, y cada categoría funciona como puerta de entrada al catálogo.

---

## 3) Qué papel cumple `App.jsx`

`App` es el componente que coordina toda la navegación.

Estados principales:

1. `activePage`
   Indica qué pantalla está activa.

2. `user`
   Guarda el usuario autenticado.

3. `selectedCategory`
   Guarda la categoría elegida desde el Home.

Funciones principales:

1. `handleNavigate(page)`
   Cambia de página y limpia `selectedCategory` si ya no estamos en la vista de categoría.

2. `handleOpenCategory(category)`
   Guarda la categoría elegida y cambia la vista a `category`.

3. `handleBackFromCategory()`
   Limpia la categoría seleccionada y vuelve al Home.

Idea clave para clase:

`App` actúa como un director. Los componentes hijos no navegan por sí solos; piden cambios al componente padre.

---

## 4) Qué hace `loadProducts()`

Archivo relacionado:
`src/utils/productsStorage.js`

`loadProducts()` sirve para cargar los productos de forma segura.

Su lógica es:

1. Si no existe `window`, devuelve `seedProducts`.
2. Si no hay nada en `localStorage`, devuelve `seedProducts`.
3. Si sí hay datos guardados, intenta convertirlos desde JSON.
4. Si el JSON está dañado o no es un arreglo, vuelve a `seedProducts`.
5. Si los datos son válidos, los pasa por `normalizeProduct()`.

Idea clave para clase:

La función intenta recuperar productos guardados por el usuario, pero si algo falla, siempre vuelve a una versión segura del catálogo.

---

## 5) Qué hace `normalizeProduct()`

`normalizeProduct(product)` sirve para combinar el producto guardado con el producto original del seed.

Su lógica es:

1. Busca el producto base en el seed por `id`.
2. Mezcla:
   - datos del seed
   - datos del producto guardado
3. Recalcula el `rating` usando `clampRating()`.

Idea clave para clase:

Esta función evita que un producto guardado en `localStorage` quede incompleto o traiga datos inválidos.

---

## 6) Para qué sirve `clampRating()`

`clampRating(value)` garantiza que el rating siempre sea un número válido entre 1 y 5.

Hace esto:

1. Convierte el valor a número.
2. Si no es un número válido, usa `DEFAULT_RATING`.
3. Si es menor que 1, devuelve 1.
4. Si es mayor que 5, devuelve 5.

Ejemplos:

- `clampRating(4.8)` -> `4.8`
- `clampRating(10)` -> `5`
- `clampRating(-2)` -> `1`
- `clampRating('hola')` -> `3`

Idea clave para clase:

No deja que el rating quede roto y afecte la UI.

---

## 7) Qué hace `ProductCard`

Archivo relacionado:
`src/components/ProductCard.jsx`

`ProductCard` es una tarjeta reutilizable.

Parte fija:

1. Imagen
2. Categoría
3. Nombre
4. Rating
5. Descripción
6. Stock
7. Precio
8. Botón de likes

Parte variable:

1. Botón `Más información`
2. Botón `Editar`
3. Botón `Eliminar`

Estos botones aparecen solo si llegan las props:

- `onDetails`
- `onEdit`
- `onDelete`

Idea clave para clase:

La tarjeta no decide sola qué acciones mostrar. Se adapta según las funciones que reciba.

Ejemplos:

1. En `CategoryProducts`, aparece `Más información`.
2. En `ProductList`, aparecen `Editar` y `Eliminar`.
3. Si no recibe callbacks, no muestra acciones extra.

---

## 8) Qué hace `ProductDetailsModal`

Archivo relacionado:
`src/components/ProductDetailsModal.jsx`

Este componente controla la lógica del modal de detalle.

Props principales:

1. `isOpen`
   Dice si el modal está abierto.

2. `product`
   Contiene el producto seleccionado.

3. `onClose`
   Función para cerrar el modal.

Lógica importante:

1. Si `isOpen` es `false`, no registra eventos.
2. Si el usuario presiona `Escape`, ejecuta `onClose`.
3. Si no hay producto o el modal no está abierto, retorna `null`.
4. Si el usuario hace click sobre el overlay, se cierra el modal.
5. Si hace click dentro del contenido, no se cierra.

Idea clave para clase:

El modal no busca productos ni controla la navegación. Solo muestra lo que recibe y se cierra cuando el padre se lo indica o cuando el usuario hace una acción de cierre.

---

## 9) Qué hace `CategoryProducts`

Archivo relacionado:
`src/pages/CategoryProducts.jsx`

Esta página tiene tres responsabilidades:

1. Mostrar solo productos de una categoría.
2. Filtrar por nombre.
3. Abrir el modal de detalle.

Estados principales:

1. `query`
   Texto del buscador.

2. `selectedProduct`
   Producto actualmente seleccionado.

3. `isModalOpen`
   Indica si el modal está abierto.

4. `productsState`
   Lista de productos cargada con `loadProducts()`.

Idea clave para clase:

`CategoryProducts` es la pantalla intermedia entre el Home y el detalle.

---

## 10) Qué hace `filteredProducts`

Bloque relacionado:
`useMemo` dentro de `CategoryProducts`

`filteredProducts` es la lista final que se renderiza en pantalla.

Su lógica es:

1. Si no hay categoría, devuelve `[]`.
2. Toma el texto buscado, le hace `trim()` y `toLowerCase()`.
3. Filtra solo productos cuya categoría coincida.
4. Si el input está vacío, deja pasar todos los productos de esa categoría.
5. Si el input tiene texto, filtra por nombre usando `includes()`.

Idea clave para clase:

La lista original no se modifica. Solo se crea una lista derivada para mostrarla en pantalla.

---

## 11) Qué hace `useMemo`

`useMemo` sirve para memorizar el resultado de un cálculo.

Se usa cuando quieres decirle a React:

"No vuelvas a hacer este cálculo si las dependencias no cambiaron".

En este proyecto se usa en dos lugares importantes:

1. En `CategoryProducts`
   para construir `filteredProducts`

2. En `Home`
   para construir `categoryTiles`

Idea clave para clase:

`useMemo` calcula y recuerda.

---

## 12) Diferencia entre `useMemo` y `useEffect`

`useMemo`:

1. Se usa para obtener un valor.
2. Memoriza el resultado de un cálculo.
3. No ejecuta efectos externos.

`useEffect`:

1. Se usa para ejecutar una acción secundaria.
2. Sirve para interactuar con el navegador o con APIs externas.
3. Puede registrar eventos, guardar en `localStorage` o limpiar recursos.

Ejemplos del proyecto:

1. `useMemo`
   - filtrar productos
   - agrupar productos por categoría

2. `useEffect`
   - escuchar la tecla `Escape` en el modal
   - guardar productos en `localStorage`

Frase simple para estudiantes:

- `useMemo` piensa
- `useEffect` actúa

---

## 13) Qué hace `Home`

Archivo relacionado:
`src/pages/Home.jsx`

`Home` toma toda la lista de productos y construye una lista de categorías destacadas.

La lógica es:

1. Carga productos con `loadProducts()`.
2. Recorre todos los productos.
3. Usa un `Map` para agrupar por categoría.
4. Conserva solo el producto con mejor rating en cada categoría.
5. Ordena las categorías alfabéticamente.
6. Genera `categoryTiles` para renderizarlas.

Idea clave para clase:

El Home no muestra todos los productos. Muestra una sola tarjeta por categoría, usando como portada el producto con mejor rating.

---

## 14) Qué hace `categoryTiles`

`categoryTiles` es una lista derivada.

No contiene todos los productos.
Contiene solo esto:

1. nombre de la categoría
2. producto elegido para representar esa categoría

Ejemplo mental:

Si en `Accesorios` hay tres productos, el Home se queda solo con el de mejor rating para usar su imagen como portada.

Idea clave para clase:

El Home funciona como una puerta de entrada al catálogo, no como el catálogo completo.

---

## 15) Cómo se conecta todo

Flujo completo:

1. `Home` renderiza categorías.
2. El usuario hace click en una categoría.
3. `Home` ejecuta `onOpenCategory(category)`.
4. `App` guarda `selectedCategory`.
5. `App` cambia `activePage` a `category`.
6. Se renderiza `CategoryProducts`.
7. `CategoryProducts` filtra productos.
8. El usuario abre `Más información`.
9. Se guarda `selectedProduct`.
10. Se abre `ProductDetailsModal`.

Flujo administrativo:

1. El usuario entra a `ProductList`.
2. Puede crear, editar o eliminar productos.
3. Los cambios se guardan en `localStorage`.
4. `loadProducts()` los recupera después.

---

## 16) Ideas pedagógicas para explicar en clase

1. Primero mostrar la experiencia final en el navegador.
2. Luego explicar que no estamos usando router todavía.
3. Después mostrar cómo `App` centraliza la navegación.
4. Explicar por qué `Home` muestra categorías en vez de todos los productos.
5. Mostrar cómo `CategoryProducts` deriva la lista con filtros.
6. Explicar que el modal es un componente controlado por props.
7. Cerrar con la idea de reutilización de `ProductCard`.

---

## 17) Frases cortas útiles para explicar a estudiantes

1. `App` decide qué pantalla mostrar.
2. `Home` muestra categorías destacadas.
3. `CategoryProducts` muestra productos filtrados.
4. `ProductCard` se adapta según las props que reciba.
5. `ProductDetailsModal` solo se muestra si está abierto y tiene producto.
6. `loadProducts()` recupera la data de forma segura.
7. `normalizeProduct()` corrige y completa productos.
8. `clampRating()` protege el rating.
9. `useMemo` memoriza cálculos.
10. `useEffect` ejecuta efectos secundarios.

---

## 18) Resumen final

Esta clase es importante porque junta varios conceptos de React en un flujo real:

1. Estado local
2. Estado levantado al padre
3. Navegación por estado sin router
4. Renderizado condicional
5. Componentes reutilizables
6. Persistencia con `localStorage`
7. Derivación de datos con `useMemo`
8. Efectos secundarios con `useEffect`

Si el estudiante entiende este complemento, va a comprender mejor la lógica interna de `clase06-estudiantes.md` y va a tener más claridad para pasar luego a una navegación formal con router.
