# Clase 07 (Estudiantes) - Carrito funcional completo + Persistencia + Página Cart (Semana 07)

**Punto de partida (BEFORE):** proyecto al cierre de la clase 06  
**Meta (AFTER):** proyecto actual con carrito funcional, persistencia local, contador en navbar y página `Cart`

Esta guía está pensada para que el estudiante la use como paso a paso.

Los bloques están en formato `text` para que el código quede exactamente igual al del proyecto actual.

---

## 0) Preparación

Trabajaremos dentro del proyecto:

```bash
cd frontend-sistema-ventas
npm install
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

En esta clase vamos a cerrar el flujo de compra básico del catálogo:

1. El usuario entra al Home.
2. Abre una categoría.
3. Agrega productos al carrito.
4. Ve en la barra cuántas unidades ha agregado.
5. Entra a la página `Cart`.
6. Ajusta cantidades, elimina productos o vacía el carrito.
7. Si recarga la página, el carrito se conserva gracias a `localStorage`.

---

## 2) Mini-guía: por qué el carrito vive en `App.jsx`

El carrito no pertenece solo a `CategoryProducts` ni solo a `Cart`.

Pertenece al flujo completo de la aplicación.

Por eso el estado se levanta a `App.jsx`.

La idea es esta:

1. `App` guarda `cartItems`.
2. `CategoryProducts` usa una función para agregar productos.
3. `Navbar` usa el contador total de unidades.
4. `Cart` usa la lista y las funciones para actualizarla.

Esto refuerza tres ideas clave:

1. Estado compartido desde el componente padre.
2. Reutilización de componentes con props.
3. Persistencia local desacoplada de la UI.

---

## 3) Paso 1: Crear la utilidad del carrito en `localStorage`

Archivo nuevo: `src/utils/cartStorage.js`

### Qué hace este archivo

1. Lee los datos del carrito desde `localStorage`.
2. Si no hay nada, devuelve un arreglo vacío.
3. Normaliza la cantidad para que siempre sea válida.
4. Protege el stock y evita datos corruptos.

### AFTER

```text
const STORAGE_KEY = 'cartItems';

const clampQuantity = (value, maxStock) => {
  const parsed = Number(value);
  const normalizedMaxStock =
    Number.isFinite(Number(maxStock)) && Number(maxStock) > 0 ? Number(maxStock) : 1;

  if (!Number.isFinite(parsed)) {
    return 1;
  }

  return Math.min(normalizedMaxStock, Math.max(1, Math.floor(parsed)));
};

const normalizeCartItem = (item) => {
  const stock =
    Number.isFinite(Number(item?.stock)) && Number(item.stock) > 0 ? Number(item.stock) : 1;

  return {
    id: Number(item?.id),
    name: String(item?.name ?? 'Producto'),
    category: String(item?.category ?? 'Sin categoría'),
    price: Number(item?.price) || 0,
    stock,
    image: String(item?.image ?? ''),
    quantity: clampQuantity(item?.quantity, stock),
  };
};

export function loadCartItems() {
  if (typeof window === 'undefined') {
    return [];
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(normalizeCartItem)
      .filter((item) => Number.isFinite(item.id) && item.quantity > 0);
  } catch {
    return [];
  }
}

export const CART_STORAGE_KEY = STORAGE_KEY;
```

### Explicación

1. `clampQuantity()` asegura que la cantidad quede entre `1` y el `stock`.
2. `normalizeCartItem()` limpia y completa cada item.
3. `loadCartItems()` hace que la app siempre arranque con un carrito válido.

### Commit sugerido

```bash
git add src/utils/cartStorage.js
git commit -m "feat: add cart storage utilities"
```

---

## 4) Paso 2: Levantar el estado del carrito a `App.jsx`

Archivo: `src/App.jsx`

### Qué queremos lograr

1. Tener una sola fuente de verdad para el carrito.
2. Persistir cambios en `localStorage`.
3. Pasar funciones y datos a las páginas que lo necesitan.

### AFTER

```text
import { useEffect, useMemo, useState } from 'react';

import Footer from './components/Footer';
import Header from './components/Header';
import Cart from './pages/Cart';
import CategoryProducts from './pages/CategoryProducts';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import { CART_STORAGE_KEY, loadCartItems } from './utils/cartStorage';

import './App.css';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cartItems, setCartItems] = useState(loadCartItems);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const handleNavigate = (page) => {
    setActivePage(page);

    if (page !== 'category') {
      setSelectedCategory(null);
    }
  };

  const handleOpenCategory = (category) => {
    setSelectedCategory(category);
    setActivePage('category');
  };

  const handleBackFromCategory = () => {
    setSelectedCategory(null);
    setActivePage('home');
  };

  const handleAddToCart = (product) => {
    if (!product || !Number.isFinite(Number(product.id))) {
      return;
    }

    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);
      const stock =
        Number.isFinite(Number(product.stock)) && Number(product.stock) > 0
          ? Number(product.stock)
          : 1;

      if (!existingItem) {
        return [
          ...currentItems,
          {
            id: Number(product.id),
            name: product.name,
            category: product.category,
            price: Number(product.price) || 0,
            stock,
            image: product.image,
            quantity: 1,
          },
        ];
      }

      return currentItems.map((item) => {
        if (item.id !== product.id) {
          return item;
        }

        return {
          ...item,
          stock,
          quantity: Math.min(item.quantity + 1, stock),
        };
      });
    });
  };

  const handleUpdateCartItemQuantity = (productId, nextQuantity) => {
    setCartItems((currentItems) =>
      currentItems.flatMap((item) => {
        if (item.id !== productId) {
          return [item];
        }

        const stock =
          Number.isFinite(Number(item.stock)) && Number(item.stock) > 0 ? Number(item.stock) : 1;
        const normalizedQuantity = Math.max(
          1,
          Math.min(stock, Math.floor(Number(nextQuantity) || 1))
        );

        return normalizedQuantity > 0 ? [{ ...item, quantity: normalizedQuantity }] : [];
      })
    );
  };

  const handleRemoveCartItem = (productId) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const cartItemCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const page = useMemo(() => {
    if (activePage === 'category') {
      return (
        <CategoryProducts
          category={selectedCategory}
          onBack={handleBackFromCategory}
          cartItems={cartItems}
          onAddToCart={handleAddToCart}
        />
      );
    }
    if (activePage === 'products') return <ProductList />;
    if (activePage === 'cart') {
      return (
        <Cart
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateCartItemQuantity}
          onRemoveItem={handleRemoveCartItem}
          onClearCart={handleClearCart}
          onContinueShopping={() => setActivePage('home')}
        />
      );
    }

    return <Home onOpenCategory={handleOpenCategory} />;
  }, [activePage, cartItems, selectedCategory]);

  const handleSignIn = () => {
    setUser({ name: 'Usuario' });
  };

  const handleSignOut = () => {
    setUser(null);
  };

  return (
    <div className="app">
      <Header
        activePage={activePage}
        onNavigate={handleNavigate}
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        cartItemCount={cartItemCount}
      />

      <main className="main">{page}</main>

      <Footer />
    </div>
  );
}

export default App;
```

### Explicación

1. `cartItems` vive en `App` porque varias pantallas lo necesitan.
2. `useEffect()` guarda el carrito cada vez que cambia.
3. `handleAddToCart()`, `handleUpdateCartItemQuantity()`, `handleRemoveCartItem()` y `handleClearCart()` centralizan toda la lógica.
4. `cartItemCount` se usa para el contador del navbar.

### Commit sugerido

```bash
git add src/App.jsx
git commit -m "feat: lift cart state into app shell"
```

---

## 5) Paso 3: Pasar el contador hacia `Header` y `Navbar`

Archivos:

1. `src/components/Header.jsx`
2. `src/components/Navbar.jsx`
3. `src/styles/Navbar.module.css`

### AFTER de `Header.jsx`

```text
import styles from '../styles/Header.module.css';

import Navbar from './Navbar';

function Header({ activePage, onNavigate, user, onSignIn, onSignOut, cartItemCount }) {
  return (
    <header className={styles.header}>
      <Navbar
        activePage={activePage}
        onNavigate={onNavigate}
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
import logo from '../assets/img-logos/logo-Cesde-2023.svg';
import styles from '../styles/Navbar.module.css';

function Navbar({ activePage, onNavigate, user, onSignIn, onSignOut, cartItemCount = 0 }) {
  const userLabel = user?.name ?? 'Invitado';
  const isLoggedIn = Boolean(user);

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <img className={styles.logo} src={logo} alt="Logo" />
        <span className={styles.brandName}>Sistema Ventas</span>
      </div>

      <div className={styles.links}>
        <button
          type="button"
          className={`${styles.link} ${activePage === 'home' ? styles.active : ''}`}
          onClick={() => onNavigate('home')}
        >
          Inicio
        </button>
        <button
          type="button"
          className={`${styles.link} ${activePage === 'products' ? styles.active : ''}`}
          onClick={() => onNavigate('products')}
        >
          Productos
        </button>
        <button
          type="button"
          className={`${styles.link} ${activePage === 'cart' ? styles.active : ''}`}
          onClick={() => onNavigate('cart')}
        >
          Carrito
          {cartItemCount > 0 ? <span className={styles.cartBadge}>{cartItemCount}</span> : null}
        </button>
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

### AFTER de estilos

```text
.link {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-weight: 700;
  color: var(--gray-900);
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.cartBadge {
  min-width: 1.35rem;
  height: 1.35rem;
  padding: 0 0.35rem;
  border-radius: 999px;
  background: var(--primary);
  color: white;
  font-size: 0.75rem;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

### Explicación

1. `Header` solo reenvía el dato.
2. `Navbar` muestra el badge solo si el carrito tiene unidades.
3. El contador da feedback global sin tener que entrar a la página `Cart`.

### Commit sugerido

```bash
git add src/components/Header.jsx src/components/Navbar.jsx src/styles/Navbar.module.css
git commit -m "feat: show cart item count in navbar"
```

---

## 6) Paso 4: Hacer que `ProductCard` soporte compra

Archivos:

1. `src/components/ProductCard.jsx`
2. `src/styles/ProductCard.module.css`

### AFTER de `ProductCard.jsx`

```text
import { useState } from 'react';

import styles from '../styles/ProductCard.module.css';
import { formatCOP } from '../utils/formatCOP';

function ProductCard({
  id,
  name,
  category,
  price,
  stock,
  image,
  description,
  rating,
  onAddToCart,
  onDetails,
  onEdit,
  onDelete,
  disableAddToCart = false,
}) {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
    }
  };

  return (
    <article className={styles.productCard}>
      <img src={image} alt={name} className={styles.productImage} />
      <div className={styles.productInfo}>
        <span className={styles.productCategory}>{category}</span>
        <h3 className={styles.productName}>{name}</h3>
        {Number.isFinite(Number(rating)) ? (
          <p className={styles.productRating}>Calificación: {Number(rating)}/5</p>
        ) : null}
        <p className={styles.productDescription}>{description}</p>
        <p className={styles.productStock}>Stock: {stock}</p>
        <div className={styles.productFooter}>
          <span className={styles.productPrice}>{formatCOP(price)}</span>
          <button
            className={`${styles.btnLike} ${isLiked ? styles.liked : ''}`}
            onClick={handleLike}
          >
            {isLiked ? '❤️' : '🤍'} {likes} Me gusta
          </button>
        </div>

        {onAddToCart || onDetails || onEdit || onDelete ? (
          <div className={styles.cardActions}>
            {onAddToCart ? (
              <button
                type="button"
                className={styles.btnAddToCart}
                onClick={() => onAddToCart({ id, name, category, price, stock, image })}
                disabled={disableAddToCart}
              >
                {disableAddToCart ? 'Stock agotado en carrito' : 'Agregar al carrito'}
              </button>
            ) : null}

            {onDetails ? (
              <button type="button" className={styles.btnDetails} onClick={onDetails}>
                Más información
              </button>
            ) : null}

            {onEdit ? (
              <button type="button" className={styles.btnEdit} onClick={onEdit}>
                Editar
              </button>
            ) : null}

            {onDelete ? (
              <button type="button" className={styles.btnDelete} onClick={onDelete}>
                Eliminar
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default ProductCard;
```

### AFTER de estilos

```text
.btnEdit,
.btnAddToCart,
.btnDetails,
.btnDelete {
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 800;
  cursor: pointer;
}

.btnAddToCart {
  background: #d1fae5;
  color: #065f46;
}

.btnAddToCart:hover:not(:disabled) {
  background: #a7f3d0;
}

.btnAddToCart:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
```

### Explicación

1. `ProductCard` sigue siendo reutilizable.
2. El botón de compra solo aparece si existe `onAddToCart`.
3. `disableAddToCart` evita pasarse del stock.

### Commit sugerido

```bash
git add src/components/ProductCard.jsx src/styles/ProductCard.module.css
git commit -m "feat: add cart action to product card"
```

---

## 7) Paso 5: Conectar la compra desde `CategoryProducts`

Archivo: `src/pages/CategoryProducts.jsx`

### Qué queremos lograr

1. Reutilizar la tarjeta de producto.
2. Permitir agregar productos al carrito.
3. Deshabilitar el botón cuando ya se alcanzó el stock en carrito.

### AFTER

```text
import { useMemo, useState } from 'react';

import ProductCard from '../components/ProductCard';
import ProductDetailsModal from '../components/ProductDetailsModal';
import styles from '../styles/CategoryProducts.module.css';
import productListStyles from '../styles/ProductList.module.css';
import { loadProducts } from '../utils/productsStorage';

function CategoryProducts({ category, onBack, cartItems, onAddToCart }) {
  const [query, setQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productsState] = useState(loadProducts);

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
        <button type="button" className={styles.btnBack} onClick={onBack}>
          Volver
        </button>

        <div className={styles.headerInfo}>
          <h1 className={styles.title}>{category ?? 'Categoría'}</h1>
          <p className={styles.subtitle}>Filtra por nombre para encontrar un producto</p>
        </div>
      </header>

      <div className={styles.toolbar}>
        <input
          className={styles.input}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por nombre..."
        />
      </div>

      {!category ? (
        <p className={styles.empty}>Selecciona una categoría desde Inicio.</p>
      ) : filteredProducts.length === 0 ? (
        <p className={styles.empty}>No hay productos para mostrar.</p>
      ) : (
        <div className={productListStyles.grid}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              category={product.category}
              rating={product.rating}
              price={product.price}
              stock={product.stock}
              image={product.image}
              description={product.description}
              onAddToCart={onAddToCart}
              disableAddToCart={(cartQuantityByProductId.get(product.id) ?? 0) >= product.stock}
              onDetails={() => handleOpenDetails(product)}
            />
          ))}
        </div>
      )}

      <ProductDetailsModal
        isOpen={isModalOpen}
        product={selectedProduct}
        onClose={handleCloseDetails}
      />
    </section>
  );
}

export default CategoryProducts;
```

### Explicación

1. `cartQuantityByProductId` permite saber cuánto lleva el usuario por producto.
2. El botón de compra se controla con `disableAddToCart`.
3. La vista conserva el modal de detalle sin perder el flujo anterior.

### Commit sugerido

```bash
git add src/pages/CategoryProducts.jsx
git commit -m "feat: allow category products to add items to cart"
```

---

## 8) Paso 6: Reemplazar el placeholder de `Cart`

Archivos:

1. `src/pages/Cart.jsx`
2. `src/styles/Cart.module.css`

### Qué hace esta página

1. Muestra los items agregados.
2. Permite sumar o restar cantidad.
3. Permite eliminar un producto.
4. Permite vaciar el carrito.
5. Muestra el total acumulado.

### AFTER de `Cart.jsx`

```text
import styles from '../styles/Cart.module.css';
import { formatCOP } from '../utils/formatCOP';

function Cart({ cartItems, onUpdateQuantity, onRemoveItem, onClearCart, onContinueShopping }) {
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <section className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Carrito</h1>
            <p className={styles.subtitle}>Todavía no tienes productos agregados.</p>
          </div>

          <button type="button" className={styles.btnContinue} onClick={onContinueShopping}>
            Seguir comprando
          </button>
        </div>

        <div className={styles.empty}>
          <h2 className={styles.emptyTitle}>Tu carrito está vacío</h2>
          <p className={styles.emptyText}>
            Vuelve al catálogo, entra a una categoría y agrega productos para continuar.
          </p>
          <button type="button" className={styles.btnContinue} onClick={onContinueShopping}>
            Ir al inicio
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Carrito</h1>
          <p className={styles.subtitle}>
            Gestiona cantidades, revisa subtotales y prepara el checkout.
          </p>
        </div>

        <button type="button" className={styles.btnContinue} onClick={onContinueShopping}>
          Seguir comprando
        </button>
      </div>

      <div className={styles.layout}>
        <div className={styles.items}>
          <div className={styles.itemList}>
            {cartItems.map((item) => {
              const itemSubtotal = item.price * item.quantity;

              return (
                <article key={item.id} className={styles.item}>
                  <img className={styles.image} src={item.image} alt={item.name} />

                  <div className={styles.itemInfo}>
                    <span className={styles.category}>{item.category}</span>
                    <h2 className={styles.name}>{item.name}</h2>
                    <p className={styles.price}>Precio unitario: {formatCOP(item.price)}</p>
                    <p className={styles.stock}>Stock disponible: {item.stock}</p>
                    <p className={styles.subtotal}>
                      <span className={styles.subtotalLabel}>Subtotal:</span>{' '}
                      {formatCOP(itemSubtotal)}
                    </p>
                  </div>

                  <div className={styles.actions}>
                    <div className={styles.quantityBox}>
                      <button
                        type="button"
                        className={styles.btnQuantity}
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className={styles.quantityValue}>{item.quantity}</span>
                      <button
                        type="button"
                        className={styles.btnQuantity}
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className={styles.btnRemove}
                      onClick={() => onRemoveItem(item.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <aside className={styles.summary}>
          <h2 className={styles.summaryTitle}>Resumen</h2>

          <div className={styles.summaryRows}>
            <div className={styles.summaryRow}>
              <span>Productos</span>
              <span className={styles.summaryValue}>{cartItems.length}</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Unidades</span>
              <span className={styles.summaryValue}>{totalItems}</span>
            </div>

            <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
              <span>Total</span>
              <span className={styles.summaryValue}>{formatCOP(subtotal)}</span>
            </div>
          </div>

          <button type="button" className={styles.btnClear} onClick={onClearCart}>
            Vaciar carrito
          </button>
        </aside>
      </div>
    </section>
  );
}

export default Cart;
```

### AFTER de `Cart.module.css`

```text
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin: 2rem 0 1.5rem;
}

.title {
  margin: 0;
  color: white;
  font-size: 2rem;
  font-weight: 900;
}

.subtitle {
  margin: 0.5rem 0 0;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 700;
}

.btnContinue,
.btnClear,
.btnRemove,
.btnQuantity {
  border: none;
  border-radius: 10px;
  font-weight: 800;
  cursor: pointer;
}

.btnContinue {
  padding: 0.75rem 1rem;
  background: white;
  color: var(--primary-dark);
}

.btnContinue:hover {
  background: var(--gray-100);
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) minmax(280px, 0.9fr);
  gap: 1.5rem;
}

.items,
.summary,
.empty {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 18px;
  box-shadow: 0 18px 50px rgba(22, 30, 84, 0.16);
}

.items {
  padding: 1rem;
}

.itemList {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr) auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  border-radius: 14px;
  background: var(--gray-50);
}

.image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 14px;
}

.itemInfo {
  min-width: 0;
}

.category {
  display: inline-block;
  margin-bottom: 0.4rem;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--primary-dark);
}

.name {
  margin: 0;
  color: var(--gray-900);
  font-size: 1.1rem;
  font-weight: 900;
}

.price,
.stock,
.subtotalLabel,
.summaryRow span:first-child {
  color: var(--gray-500);
  font-weight: 700;
}

.price,
.stock,
.subtotal {
  margin: 0.45rem 0 0;
}

.actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
}

.quantityBox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btnQuantity {
  width: 36px;
  height: 36px;
  background: var(--gray-100);
  color: var(--gray-900);
}

.btnQuantity:hover:not(:disabled) {
  background: var(--gray-200);
}

.btnQuantity:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.quantityValue {
  min-width: 2ch;
  text-align: center;
  font-weight: 900;
  color: var(--gray-900);
}

.subtotal {
  color: var(--gray-900);
  font-size: 1.05rem;
  font-weight: 900;
}

.btnRemove {
  padding: 0.6rem 0.9rem;
  background: var(--danger);
  color: white;
}

.btnRemove:hover {
  filter: brightness(0.95);
}

.summary {
  padding: 1.25rem;
  align-self: start;
}

.summaryTitle {
  margin: 0 0 1rem;
  color: var(--gray-900);
  font-size: 1.25rem;
  font-weight: 900;
}

.summaryRows {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.summaryRow {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.summaryValue {
  color: var(--gray-900);
  font-weight: 900;
}

.summaryTotal {
  padding-top: 1rem;
  border-top: 1px solid var(--gray-200);
}

.summaryTotal span {
  font-size: 1.1rem;
}

.btnClear {
  width: 100%;
  margin-top: 1.25rem;
  padding: 0.85rem 1rem;
  background: var(--gray-900);
  color: white;
}

.btnClear:hover:not(:disabled) {
  background: #101828;
}

.btnClear:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty {
  padding: 2rem;
  text-align: center;
}

.emptyTitle {
  margin: 0;
  color: var(--gray-900);
  font-size: 1.6rem;
  font-weight: 900;
}

.emptyText {
  margin: 0.75rem 0 1.5rem;
  color: var(--gray-500);
  font-weight: 700;
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .summary {
    align-self: stretch;
  }
}

@media (max-width: 700px) {
  .header {
    flex-direction: column;
    align-items: stretch;
  }

  .item {
    grid-template-columns: 1fr;
  }

  .image {
    width: 100%;
    height: 220px;
  }

  .actions {
    align-items: stretch;
  }
}
```

### Explicación

1. La página maneja un caso vacío y un caso con productos.
2. Los subtotales se calculan por item.
3. El total final se deriva de la suma de subtotales.
4. El botón `Vaciar carrito` resetea toda la colección.

### Commit sugerido

```bash
git add src/pages/Cart.jsx src/styles/Cart.module.css
git commit -m "feat: implement cart page interactions"
```

---

## 9) Verificación funcional final

Al terminar, verifica lo siguiente:

- Desde una categoría se pueden agregar productos al carrito.
- El botón se deshabilita cuando se alcanza el stock disponible.
- El navbar muestra el total de unidades.
- La página `Cart` lista los productos agregados.
- El botón `+` incrementa solo hasta el stock.
- El botón `-` no deja bajar de 1.
- El botón `Eliminar` remueve un item.
- El botón `Vaciar carrito` limpia toda la lista.
- Al recargar, el carrito se conserva en `localStorage`.

Comandos de validación:

```bash
npm run lint
npm run build
```

---

## 10) Cierre conceptual

Esta clase es importante porque junta varias ideas de React en un flujo real:

1. Estado global levantado al padre.
2. Persistencia local con `localStorage`.
3. Props para compartir datos y callbacks.
4. Reutilización de componentes.
5. Datos derivados como contador, subtotales y total.
6. Separación entre navegación, catálogo y compra.

Si esta clase queda clara, el siguiente salto natural es construir el checkout mock y el historial de órdenes en la semana 08.
