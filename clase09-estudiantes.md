# Clase 09 (Estudiantes) - Migración a react-router-dom + Rutas reales (Semana 09)

**Punto de partida (BEFORE):** proyecto al cierre de la clase 08  
**Meta (AFTER):** proyecto actual con navegación basada en `react-router-dom`

Esta guía está pensada para que el estudiante la use para entender la clase paso a paso y, al mismo tiempo, sirva como material de copy/paste.

Los bloques están en formato `text` para que el código quede exactamente igual al del proyecto actual.

---

## 0) Preparación

Trabajaremos dentro del proyecto:

```bash
cd frontend-sistema-ventas
npm install
npm install react-router-dom
npm run dev
```

Comandos útiles durante la clase:

```bash
npm run dev
npm run lint
npm run build
```

---

## 1) Qué vamos a construir en esta clase

En esta clase vamos a migrar la navegación de la aplicación a rutas reales:

1. El usuario entra al Home con `/`.
2. Abre una categoría con `/category/:categoryName`.
3. Puede entrar a `/cart` y `/checkout` por URL.
4. La navegación del navbar usa el router.
5. `App.jsx` deja de decidir la pantalla con `activePage`.
6. La lógica del carrito y del checkout permanece funcionando.

---

## 2) Mini-guía: qué cambia con `react-router-dom`

Antes, la aplicación decidía qué pantalla mostrar con estado:

1. `activePage`
2. `selectedCategory`

Ahora, la pantalla la decide la URL.

Ejemplos:

1. `/` -> Home
2. `/products` -> Productos
3. `/cart` -> Carrito
4. `/checkout` -> Checkout
5. `/order-confirmation` -> Confirmación
6. `/category/Accesorios` -> Categoría Accesorios

Idea clave:

La URL pasa a ser la fuente de verdad de la navegación.

---

## 3) Paso 1: Instalar `react-router-dom`

Archivo: `package.json`

### Qué hacer

Instala la dependencia en el proyecto:

```bash
npm install react-router-dom
```

### Explicación

1. `react-router-dom` permite manejar rutas dentro de una app React.
2. No cambia la lógica del negocio.
3. Cambia cómo se decide qué pantalla renderizar.

### Commit sugerido

```bash
git add package.json package-lock.json
git commit -m "feat: install react-router-dom"
```

---

## 4) Paso 2: Envolver la aplicación con `BrowserRouter`

Archivo: `src/main.jsx`

### AFTER

```text
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

### Explicación

1. `BrowserRouter` habilita el uso de rutas dentro de toda la app.
2. Se coloca en el entrypoint para que todos los componentes puedan acceder al router.

### Commit sugerido

```bash
git add src/main.jsx
git commit -m "feat: configure browser router"
```

---

## 5) Paso 3: Migrar `App.jsx` a `Routes`

Archivo: `src/App.jsx`

### Qué queremos lograr

1. Eliminar `activePage`.
2. Eliminar `selectedCategory`.
3. Mantener solo el estado real del negocio.
4. Declarar las rutas de la aplicación.

### AFTER

```text
import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Footer from './components/Footer';
import Header from './components/Header';
import Cart from './pages/Cart';
import CategoryProducts from './pages/CategoryProducts';
import Checkout from './pages/Checkout';
import Home from './pages/Home';
import OrderConfirmation from './pages/OrderConfirmation';
import ProductList from './pages/ProductList';
import {
  calculateOrderTotals,
  getPaymentMethodById,
  getShippingOptionById,
} from './utils/calculateOrderTotals';
import { CART_STORAGE_KEY, loadCartItems } from './utils/cartStorage';
import { saveOrder } from './utils/ordersStorage';

import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState(loadCartItems);
  const [latestOrder, setLatestOrder] = useState(null);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  /* lógica existente del carrito */

  const handleCompleteCheckout = ({ customer, shippingMethodId, paymentMethodId }) => {
    if (cartItems.length === 0) {
      return null;
    }

    const totals = calculateOrderTotals(cartItems, shippingMethodId);
    const order = {
      id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      items: cartItems.map((item) => ({ ...item })),
      customer,
      shippingMethod: getShippingOptionById(shippingMethodId),
      paymentMethod: getPaymentMethodById(paymentMethodId),
      totals,
    };

    saveOrder(order);
    setLatestOrder(order);
    setCartItems([]);
    return order;
  };

  const handleBackHomeAfterOrder = () => {
    setLatestOrder(null);
  };

  const cartItemCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const handleSignIn = () => {
    setUser({ name: 'Usuario' });
  };

  const handleSignOut = () => {
    setUser(null);
  };

  return (
    <div className="app">
      <Header
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        cartItemCount={cartItemCount}
      />

      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/category/:categoryName"
            element={<CategoryProducts cartItems={cartItems} onAddToCart={handleAddToCart} />}
          />
          <Route path="/products" element={<ProductList />} />
          <Route
            path="/cart"
            element={
              <Cart
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateCartItemQuantity}
                onRemoveItem={handleRemoveCartItem}
                onClearCart={handleClearCart}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <Checkout
                cartItems={cartItems}
                user={user}
                onCompleteCheckout={handleCompleteCheckout}
              />
            }
          />
          <Route
            path="/order-confirmation"
            element={
              <OrderConfirmation order={latestOrder} onBackHome={handleBackHomeAfterOrder} />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
```

### Explicación

1. `App` ya no decide la pantalla usando estado de navegación.
2. Las rutas quedan declaradas de forma explícita.
3. `App` conserva solo estado de negocio: usuario, carrito y última orden.

### Commit sugerido

```bash
git add src/App.jsx
git commit -m "refactor: migrate app navigation to router"
```

---

## 6) Paso 4: Simplificar `Header` y migrar `Navbar`

Archivos:

1. `src/components/Header.jsx`
2. `src/components/Navbar.jsx`

### AFTER de `Header.jsx`

```text
import styles from '../styles/Header.module.css';

import Navbar from './Navbar';

function Header({ user, onSignIn, onSignOut, cartItemCount }) {
  return (
    <header className={styles.header}>
      <Navbar
        user={user}
        onSignIn={onSignIn}
        onSignOut={onSignOut}
        cartItemCount={cartItemCount}
      />
    </header>
  );
}

export default Header;
```

### AFTER de `Navbar.jsx`

```text
import { NavLink, useLocation } from 'react-router-dom';

import logo from '../assets/img-logos/logo-Cesde-2023.svg';
import styles from '../styles/Navbar.module.css';

function Navbar({ user, onSignIn, onSignOut, cartItemCount = 0 }) {
  const userLabel = user?.name ?? 'Invitado';
  const isLoggedIn = Boolean(user);
  const location = useLocation();

  const isHomeActive = location.pathname === '/' || location.pathname.startsWith('/category/');
  const isCartActive =
    location.pathname === '/cart' ||
    location.pathname === '/checkout' ||
    location.pathname === '/order-confirmation';

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <img className={styles.logo} src={logo} alt="Logo" />
        <span className={styles.brandName}>Sistema Ventas</span>
      </div>

      <div className={styles.links}>
        <NavLink to="/" end className={() => `${styles.link} ${isHomeActive ? styles.active : ''}`}>
          Inicio
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
        >
          Productos
        </NavLink>
        <NavLink to="/cart" className={() => `${styles.link} ${isCartActive ? styles.active : ''}`}>
          Carrito
          {cartItemCount > 0 ? <span className={styles.cartBadge}>{cartItemCount}</span> : null}
        </NavLink>
      </div>

      <div className={styles.auth}>
        <span className={styles.userName}>{userLabel}</span>

        {isLoggedIn ? (
          <button type="button" className={styles.authBtn} onClick={onSignOut}>
            Sign out
          </button>
        ) : (
          <button type="button" className={styles.authBtn} onClick={onSignIn}>
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
```

### Explicación

1. `Navbar` deja de depender de `activePage`.
2. Ahora decide el estado visual según la URL actual.
3. `Inicio`, `Productos` y `Carrito` se renderizan como enlaces reales con `NavLink`.
4. `Header` ya no necesita props para cambiar de pantalla.
5. Regla práctica: `NavLink` para enlaces visibles del navbar, `Navigate` para redirecciones automáticas por condición y `useNavigate` para acciones dentro de páginas.

### Commit sugerido

```bash
git add src/components/Header.jsx src/components/Navbar.jsx
git commit -m "refactor: migrate header and navbar to router"
```

---

## 7) Paso 5: Migrar `Home` y `CategoryProducts`

Archivos:

1. `src/pages/Home.jsx`
2. `src/pages/CategoryProducts.jsx`

### Qué queremos lograr

1. Reemplazar `selectedCategory` por un parámetro de ruta.
2. Navegar a la categoría usando URL.
3. Leer la categoría con `useParams()`.

### AFTER de `Home.jsx`

```text
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import homeStyles from '../styles/Home.module.css';
import { loadProducts } from '../utils/productsStorage';

function Home() {
  const [productsState] = useState(loadProducts);
  const navigate = useNavigate();

  const categoryTiles = useMemo(() => {
    const bestByCategory = new Map();
    /* lógica existente */
  }, [productsState]);

  return (
    <div className={homeStyles.container}>
      <header className={homeStyles.header}>
        <h1 className={homeStyles.title}>Inicio</h1>
        <p className={homeStyles.subtitle}>Selecciona una categoría para ver sus productos</p>
      </header>

      <div className={homeStyles.categoryGrid}>
        {categoryTiles.map(({ category, product }) => (
          <button
            key={category}
            type="button"
            className={homeStyles.categoryTile}
            onClick={() => navigate(`/category/${encodeURIComponent(category)}`)}
            aria-label={`Ver productos de ${category}`}
          >
            <img className={homeStyles.categoryImage} src={product.image} alt={product.name} />
            <span className={homeStyles.categoryLabel} aria-hidden="true">
              <span className={homeStyles.categoryLabelText}>{category}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Home;
```

### AFTER de `CategoryProducts.jsx`

```text
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ProductCard from '../components/ProductCard';
import ProductDetailsModal from '../components/ProductDetailsModal';
import styles from '../styles/CategoryProducts.module.css';
import productListStyles from '../styles/ProductList.module.css';
import { loadProducts } from '../utils/productsStorage';

function CategoryProducts({ cartItems, onAddToCart }) {
  const [query, setQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productsState] = useState(loadProducts);
  const navigate = useNavigate();
  const { categoryName } = useParams();

  const category = useMemo(
    () => (categoryName ? decodeURIComponent(categoryName) : null),
    [categoryName]
  );

  const cartQuantityByProductId = useMemo(
    () => new Map(cartItems.map((item) => [item.id, item.quantity])),
    [cartItems]
  );

  const filteredProducts = useMemo(() => {
    if (!category) return [];

    const q = query.trim().toLowerCase();

    return productsState.filter((product) => {
      if (product.category !== category) return false;
      if (!q) return true;

      return String(product.name ?? '')
        .toLowerCase()
        .includes(q);
    });
  }, [category, productsState, query]);

  const handleOpenDetails = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <button type="button" className={styles.btnBack} onClick={() => navigate('/')}>
          Volver
        </button>
        /* resto del contenido */
      </header>
    </section>
  );
}

export default CategoryProducts;
```

### Explicación

1. `Home` ya no informa la categoría por callback.
2. `CategoryProducts` la obtiene directamente desde la URL.
3. `useParams()` reemplaza por completo a `selectedCategory`.

### Commit sugerido

```bash
git add src/pages/Home.jsx src/pages/CategoryProducts.jsx
git commit -m "refactor: migrate category navigation to route params"
```

---

## 8) Paso 6: Migrar `Cart`, `Checkout` y `OrderConfirmation`

Archivos:

1. `src/pages/Cart.jsx`
2. `src/pages/Checkout.jsx`
3. `src/pages/OrderConfirmation.jsx`

### Idea clave

Estas páginas ya no reciben callbacks de navegación.

Ahora navegan directamente por rutas usando `useNavigate()`.

### Explicación

1. `Cart` navega a `/` y `/checkout`.
2. `Checkout` navega a `/cart` y `/order-confirmation`.
3. `OrderConfirmation` vuelve a `/`.
4. La lógica del pedido sigue viviendo en `App`.

### Commit sugerido

```bash
git add src/pages/Cart.jsx src/pages/Checkout.jsx src/pages/OrderConfirmation.jsx
git commit -m "refactor: migrate purchase flow pages to router"
```

---

## 9) Verificación funcional final

Al terminar, verifica lo siguiente:

- El Home carga en `/`.
- Las categorías abren `/category/:categoryName`.
- El navbar funciona con rutas reales.
- `/cart` abre correctamente.
- `/checkout` abre correctamente.
- Al confirmar compra, se abre `/order-confirmation`.
- El carrito sigue funcionando igual.
- La compra sigue funcionando igual.
- La recarga del navegador ya no rompe la navegación básica.

Comandos de validación:

```bash
npm run lint
npm run build
```

---

## 10) Cierre conceptual

Esta clase es importante porque cambia la arquitectura de navegación del proyecto sin cambiar la lógica del negocio:

1. Antes la vista dependía del estado.
2. Ahora depende de la URL.
3. El carrito sigue funcionando.
4. El checkout sigue funcionando.
5. La app queda lista para crecer de forma más profesional.

Esta migración marca el paso desde una app React básica a una app SPA con navegación formal.
