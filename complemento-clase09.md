# Complemento Clase 09 - Orden exacto de implementación

Este material complementa `clase09-estudiantes.md` y resume el orden exacto en que conviene construir la migración a `react-router-dom` para entender con claridad.

---

## 0) Orden recomendado de implementación

Para evitar confusiones, este es el orden más claro para construir la clase y explicarla archivo por archivo:

1. `package.json`
   Primero se instala `react-router-dom`.

2. `src/main.jsx`
   Después se agrega `BrowserRouter` para habilitar el router en toda la app.

3. `src/App.jsx`
   Luego se reemplaza la navegación por estado por un mapa de rutas con `Routes` y `Route`.

4. `src/components/Header.jsx`
   Se simplifica, eliminando props de navegación que ya no necesita.

5. `src/components/Navbar.jsx`
   Se migra para usar `NavLink` en los enlaces principales y la URL actual para marcar la ruta activa.

6. `src/pages/Home.jsx`
   Se cambia el callback de categoría por navegación a URL.

7. `src/pages/CategoryProducts.jsx`
   Se reemplaza la prop `category` por `useParams()`.

8. `src/pages/Cart.jsx`
   Se migra la navegación a inicio y checkout.

9. `src/pages/Checkout.jsx`
   Se migra la navegación a carrito y confirmación.

10. `src/pages/OrderConfirmation.jsx`
    Se migra el retorno al Home.

---

## 1) Lógica de este orden

Este orden funciona porque sigue el flujo correcto de dependencia:

1. Primero se habilita el router.
2. Luego se define el mapa de rutas.
3. Después se migran los componentes que consumen navegación.
4. Al final se revisan las páginas que dependen de rutas o navegación programática.

Si se intenta empezar por las páginas sin haber configurado el router, la explicación queda fragmentada y el código no tiene todavía el contexto que necesita.

---

## 2) Idea general del cambio

Hasta la clase 08, la navegación dependía de estado:

1. `activePage`
2. `selectedCategory`

En la clase 09, la navegación pasa a depender de la URL.

Esto implica un cambio conceptual importante:

1. El negocio no cambia.
2. La persistencia no cambia.
3. El carrito no cambia.
4. El checkout no cambia.
5. Lo que cambia es la fuente de verdad de la vista actual.

---

## 3) Qué explica cada archivo

### `package.json`

Qué explicar:

1. La nueva dependencia es `react-router-dom`.
2. No es una librería de estado.
3. Es una librería de navegación para SPA.

Idea corta para estudiantes:

Instalamos router para que la navegación dependa de rutas reales.

---

### `src/main.jsx`

Qué explicar:

1. `BrowserRouter` se coloca en el entrypoint.
2. Eso permite que todos los componentes hijos usen hooks del router.

Idea corta para estudiantes:

El router envuelve toda la aplicación desde la raíz.

---

### `src/App.jsx`

Qué explicar:

1. `App` deja de usar `activePage`.
2. `App` deja de usar `selectedCategory`.
3. `App` mantiene solo estado de negocio.
4. `Routes` y `Route` sustituyen el renderizado condicional.
5. `Navigate` cubre rutas desconocidas.

Idea corta para estudiantes:

`App` ya no decide la pantalla con un `if`; ahora define rutas.

---

### `src/components/Header.jsx` y `src/components/Navbar.jsx`

Qué explicar:

1. `Header` se simplifica porque ya no necesita props de navegación.
2. `Navbar` usa la URL actual para saber qué enlace marcar como activo.
3. `NavLink` reemplaza los callbacks de navegación del menú principal.

Idea corta para estudiantes:

El navbar ya no pregunta qué página está activa; ahora lo sabe por la ruta actual y navega con enlaces reales.

---

### `src/pages/Home.jsx`

Qué explicar:

1. Antes llamaba un callback para abrir una categoría.
2. Ahora navega a una URL real.

Idea corta para estudiantes:

Hacer click en una categoría ya no cambia un estado; cambia la URL.

---

### `src/pages/CategoryProducts.jsx`

Qué explicar:

1. Antes recibía la categoría por prop.
2. Ahora usa `useParams()`.
3. `decodeURIComponent()` reconstruye el nombre de categoría desde la URL.

Idea corta para estudiantes:

La categoría ahora vive en la ruta, no en `App`.

---

### `src/pages/Cart.jsx`, `src/pages/Checkout.jsx` y `src/pages/OrderConfirmation.jsx`

Qué explicar:

1. Estas páginas ya no reciben callbacks de navegación.
2. Ahora usan `useNavigate()`.
3. La navegación programática sigue existiendo, pero ya no depende del componente padre.

Idea corta para estudiantes:

Cada página sabe a dónde ir después, sin pedirle a `App` que cambie una pantalla.

---

## 4) Orden exacto de explicación en clase

Recomendación de secuencia al explicar:

1. Mostrar el comportamiento final de la app con rutas reales.
2. Explicar por qué la URL debe ser la fuente de verdad.
3. Abrir `main.jsx` y mostrar `BrowserRouter`.
4. Abrir `App.jsx` y explicar `Routes`.
5. Mostrar `Navbar.jsx` para ver navegación y estado activo.
6. Mostrar `Home.jsx` y `CategoryProducts.jsx` para explicar rutas dinámicas.
7. Cerrar con `Cart`, `Checkout` y `OrderConfirmation` para remarcar que el flujo de compra sigue intacto.

Este orden es mejor que comenzar directamente por `Navbar` o por una página aislada, porque primero se entiende el marco general y luego se ven los casos concretos.

---

## 5) Cambios que conviene remarcar a estudiantes

1. `App` ya no tiene que recordar en qué pantalla está el usuario.
2. La URL ahora representa la pantalla actual.
3. La categoría ya no se guarda en estado; se guarda en la ruta.
4. El router no reemplaza el carrito ni el checkout.
5. El router solo cambia el modelo de navegación.

---

## 6) Errores comunes para anticipar en clase

1. Mantener `activePage` y agregar router encima.
   Problema: dos fuentes de verdad para navegación.

2. Mantener `selectedCategory` además de `useParams()`.
   Problema: duplicación innecesaria.

3. Usar rutas para navegar, pero seguir pasando callbacks de pantalla.
   Problema: el refactor queda a medias.

4. Romper el flujo de compra al cambiar navegación.
   Problema: el foco de esta clase no es cambiar negocio, solo navegación.

5. No manejar rutas desconocidas.
   Problema: la app puede quedar en una pantalla en blanco.

---

## 7) Frases cortas útiles para clase

1. La URL es la fuente de verdad de la navegación.
2. El router cambia navegación, no negocio.
3. `App` define rutas.
4. `Navbar` navega con `NavLink` y marca activo según la ruta.
5. `useParams()` reemplaza props de categoría.
6. `useNavigate()` reemplaza callbacks de página.
7. `Navigate` redirige automáticamente; `NavLink` construye el menú visible; `useNavigate()` resuelve navegación desde acciones.

---

## 8) Resumen final

Esta clase es importante porque profesionaliza la estructura de la app:

1. El catálogo sigue funcionando.
2. El carrito sigue funcionando.
3. El checkout sigue funcionando.
4. La navegación ya no depende de estado local improvisado.
5. La app queda mejor preparada para crecer.

Con esta clase, el proyecto ya tiene un flujo de compra completo y una navegación formal con router.
