# Clase 10 (Estudiantes) - Perfil de usuario + Historial de ordenes (Semana 10)

**Punto de partida (BEFORE):** proyecto al cierre de la clase 09  
**Meta (AFTER):** proyecto actual con seccion de cuenta, historial y detalle de compras

Esta guia esta pensada para que el estudiante la use como material de apoyo y, al mismo tiempo, permita reconstruir la clase paso a paso.

---

## 0) Preparacion

Trabajaremos dentro del proyecto:

```bash
cd frontend-sistema-ventas
npm install
npm run dev
```

Comandos utiles durante la clase:

```bash
npm run lint
npm run build
```

---

## 1) Que vamos a construir en esta clase

En esta clase vamos a completar la experiencia de compra agregando una seccion de cuenta:

1. El usuario podra abrir `Mi cuenta` desde el navbar.
2. Veremos un perfil mock con datos basicos.
3. Recuperaremos las ordenes guardadas en `localStorage`.
4. Abriremos el detalle de una orden con `react-router-dom`.
5. Mantendremos intacto el flujo de carrito y checkout.

---

## 2) Idea central de la clase

Hasta semana 09, la app ya podia:

1. Agregar productos al carrito.
2. Completar checkout.
3. Confirmar una compra.
4. Guardar ordenes localmente.

Pero faltaba algo importante:

El usuario no podia volver a consultar sus compras.

Esta clase resuelve justamente eso.

---

## 3) Paso 1: agregar nuevas rutas de cuenta

Archivo: `src/App.jsx`

### Objetivo

Agregar estas rutas:

1. `/user/profile`
2. `/user/orders`
3. `/user/orders/:orderId`

### Idea clave

`App.jsx` sigue siendo el shell principal, pero ahora incorpora una seccion de usuario dentro del mismo sistema de rutas que ya se construyo en semana 09.

En esta semana esas rutas todavia son publicas: no existe `ProtectedRoute` ni autenticacion real.

### Resultado esperado

La app debe poder renderizar tres nuevas vistas sin romper Home, Productos, Carrito ni Checkout.

---

## 4) Paso 2: reutilizar las ordenes ya persistidas

Archivo: `src/utils/ordersStorage.js`

### Que recordar

El proyecto ya guarda ordenes con esta informacion:

1. `id`
2. `createdAt`
3. `items`
4. `customer`
5. `shippingMethod`
6. `paymentMethod`
7. `totals`

### Idea clave

No hay que inventar una nueva estructura. Esta clase se apoya en la persistencia que ya existe.

La lectura se hace con `loadOrders()`, porque el escenario sigue siendo un unico usuario por navegador.

---

## 5) Paso 3: crear el perfil de usuario

Archivo: `src/pages/UserProfile.jsx`

### Que hace esta vista

1. Muestra los datos del usuario mock.
2. Si existe una compra previa, reutiliza datos del cliente de la ultima orden.
3. Resume cuantas ordenes hay guardadas.
4. Permite navegar al historial.

### Idea clave

Todavia no hay autenticacion real. El objetivo es crear una seccion de cuenta coherente usando el estado y la ultima compra disponible.

---

## 6) Paso 4: crear el historial de ordenes

Archivo: `src/pages/UserOrders.jsx`

### Que hace esta vista

1. Lee las ordenes desde `loadOrders()`.
2. Las ordena de mas reciente a mas antigua.
3. Renderiza una tarjeta por compra.
4. Maneja estado vacio si no hay compras.

### Idea clave

Esta es la primera pantalla de lectura de datos persistidos del proyecto. Ya no solo guardamos informacion: ahora tambien la presentamos.

---

## 7) Paso 5: crear el detalle de orden

Archivo: `src/pages/OrderDetail.jsx`

### Que hace esta vista

1. Lee `orderId` desde la URL.
2. Busca la orden correspondiente en `localStorage`.
3. Muestra cliente, items, envio, pago y totales.
4. Si la orden no existe, muestra un fallback controlado.

### Idea clave

Esta parte refuerza uno de los conceptos mas importantes de `react-router-dom`: usar parametros de ruta para abrir una entidad concreta.

---

## 8) Paso 6: ajustar la navegacion global

Archivo: `src/components/Navbar.jsx`

### Que cambia

1. Se agrega el acceso `Mi cuenta`.
2. Se detecta la ruta activa `/user/*`.
3. Se mantienen las rutas anteriores del proyecto.

### Idea clave

La seccion de cuenta no reemplaza el flujo de compra; lo complementa.

En `semana-10`, `Mi cuenta` entra directo a `/user/profile` desde el menu principal.

---

## 9) Paso 7: mejorar la confirmacion de compra

Archivo: `src/pages/OrderConfirmation.jsx`

### Que cambia

1. Se agrega un acceso directo al historial.
2. El usuario puede revisar la compra inmediatamente despues de confirmarla.

### Idea clave

Esto conecta mejor semana 08 con semana 10: la compra no termina solo en una pantalla de exito, tambien se vuelve consultable.

---

## 10) Verificaciones finales

1. Completar una compra desde checkout.
2. Entrar a `Mi cuenta` y verificar que abra `/user/profile`.
3. Abrir `Mis ordenes`.
4. Entrar al detalle de una compra.
5. Recargar el navegador en el detalle y verificar que siga funcionando.
6. Probar una orden inexistente.
7. Ejecutar:

```bash
npm run lint
npm run build
```

---

## 11) Commits sugeridos

```bash
git add src/App.jsx src/components/Navbar.jsx src/pages/UserProfile.jsx src/pages/UserOrders.jsx src/pages/OrderDetail.jsx src/components/OrderCard.jsx src/pages/OrderConfirmation.jsx src/styles/UserProfile.module.css src/styles/UserOrders.module.css src/styles/OrderDetail.module.css src/styles/OrderCard.module.css src/styles/OrderConfirmation.module.css
git commit -m "feat: add user account and orders routes"
```

Si quieren fragmentarlo aun mas:

```bash
git commit -m "feat: add account routes and navbar entry"
git commit -m "feat: add user profile page"
git commit -m "feat: add orders history page"
git commit -m "feat: add order detail page"
```

---

## 12) Resumen final

Con la clase 10 el proyecto deja de ser solo una demo de compra puntual y pasa a mostrar continuidad del usuario:

1. Compra.
2. Confirma.
3. Consulta historial.
4. Revisa detalle.

Eso completa mucho mejor la narrativa del ecommerce construida desde semana 07.