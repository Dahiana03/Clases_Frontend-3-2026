# Clase 08 (Estudiantes) - Checkout funcional + Confirmación + Persistencia de órdenes (Semana 08)

**Punto de partida (BEFORE):** proyecto al cierre de la clase 07  
**Meta (AFTER):** proyecto actual con checkout funcional, confirmación de compra y órdenes persistidas

Esta guía está pensada para que el estudiante pueda realizar un paso a paso y, al mismo tiempo, sirva como material de copy/paste.

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

En esta clase vamos a cerrar el flujo de compra iniciado con el carrito:

1. El usuario agrega productos al carrito.
2. Entra a `Cart`.
3. Presiona `Proceder al checkout`.
4. Completa el formulario de compra.
5. Selecciona envío y pago.
6. Confirma el pedido.
7. Ve la pantalla final de confirmación.
8. El carrito se vacía y la orden queda guardada.

---

## 2) Mini-guía: por qué todavía seguimos sin router

Todavía no estamos usando `react-router-dom`.

En vez de eso, la navegación sigue controlada por estado en `App.jsx`.

Ahora el flujo queda así:

1. `home`
2. `category`
3. `products`
4. `cart`
5. `checkout`
6. `order-confirmation`

Esto es útil porque permite explicar cómo una aplicación puede crecer en complejidad antes de formalizar rutas con router.

---

## 3) Paso 1: Crear la utilidad de cálculo de totales

Archivo nuevo: `src/utils/calculateOrderTotals.js`

### Qué hace este archivo

1. Define métodos de envío.
2. Define métodos de pago.
3. Calcula subtotal, IVA, envío y total.
4. Permite reutilizar el mismo cálculo entre carrito, checkout y confirmación.

### AFTER

```text
export const TAX_RATE = 0.19;

export const SHIPPING_OPTIONS = [
  {
    id: 'standard',
    label: 'Envío estándar',
    description: 'Entrega entre 3 y 5 días hábiles.',
    price: 15000,
  },
  {
    id: 'express',
    label: 'Envío express',
    description: 'Entrega prioritaria en 24 horas.',
    price: 25000,
  },
];

export const PAYMENT_METHODS = [
  {
    id: 'card',
    label: 'Tarjeta de crédito',
    description: 'Pago inmediato con validación simulada.',
  },
  {
    id: 'transfer',
    label: 'Transferencia bancaria',
    description: 'Confirmación manual del pago en la orden.',
  },
  {
    id: 'cash',
    label: 'Pago contra entrega',
    description: 'El cobro se realiza cuando recibes el pedido.',
  },
];

export function getShippingOptionById(shippingMethodId) {
  return SHIPPING_OPTIONS.find((option) => option.id === shippingMethodId) ?? SHIPPING_OPTIONS[0];
}

export function getPaymentMethodById(paymentMethodId) {
  return PAYMENT_METHODS.find((option) => option.id === paymentMethodId) ?? PAYMENT_METHODS[0];
}

export function calculateCartSubtotal(cartItems) {
  return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function calculateOrderTotals(cartItems, shippingMethodId = SHIPPING_OPTIONS[0].id) {
  const subtotal = calculateCartSubtotal(cartItems);

  if (subtotal === 0) {
    return {
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
      shippingOption: getShippingOptionById(shippingMethodId),
    };
  }

  const shippingOption = getShippingOptionById(shippingMethodId);
  const tax = Math.round(subtotal * TAX_RATE);
  const shipping = shippingOption.price;

  return {
    subtotal,
    tax,
    shipping,
    total: subtotal + tax + shipping,
    shippingOption,
  };
}
```

### Explicación

1. Esta utilidad evita repetir fórmulas en varias páginas.
2. `calculateCartSubtotal()` sirve cuando solo se necesita el subtotal.
3. `calculateOrderTotals()` completa el cálculo total del pedido.

### Commit sugerido

```bash
git add src/utils/calculateOrderTotals.js
git commit -m "feat: add checkout totals helpers"
```

---

## 4) Paso 2: Crear persistencia de órdenes

Archivo nuevo: `src/utils/ordersStorage.js`

### Qué hace este archivo

1. Guarda órdenes en `localStorage`.
2. Carga órdenes previas.
3. Normaliza la estructura para evitar datos corruptos.

### AFTER

```text
const STORAGE_KEY = 'orders';

const normalizeOrderItem = (item) => ({
  id: Number(item?.id),
  name: String(item?.name ?? 'Producto'),
  category: String(item?.category ?? 'Sin categoría'),
  price: Number(item?.price) || 0,
  stock: Number(item?.stock) || 0,
  image: String(item?.image ?? ''),
  quantity: Math.max(1, Math.floor(Number(item?.quantity) || 1)),
});

const normalizeOrder = (order) => ({
  id: String(order?.id ?? ''),
  createdAt: String(order?.createdAt ?? new Date().toISOString()),
  items: Array.isArray(order?.items) ? order.items.map(normalizeOrderItem) : [],
  customer: {
    fullName: String(order?.customer?.fullName ?? ''),
    email: String(order?.customer?.email ?? ''),
    phone: String(order?.customer?.phone ?? ''),
    address: String(order?.customer?.address ?? ''),
    city: String(order?.customer?.city ?? ''),
    postalCode: String(order?.customer?.postalCode ?? ''),
  },
  shippingMethod: {
    id: String(order?.shippingMethod?.id ?? 'standard'),
    label: String(order?.shippingMethod?.label ?? 'Envío estándar'),
    description: String(order?.shippingMethod?.description ?? ''),
    price: Number(order?.shippingMethod?.price) || 0,
  },
  paymentMethod: {
    id: String(order?.paymentMethod?.id ?? 'card'),
    label: String(order?.paymentMethod?.label ?? 'Tarjeta de crédito'),
    description: String(order?.paymentMethod?.description ?? ''),
  },
  totals: {
    subtotal: Number(order?.totals?.subtotal) || 0,
    tax: Number(order?.totals?.tax) || 0,
    shipping: Number(order?.totals?.shipping) || 0,
    total: Number(order?.totals?.total) || 0,
  },
});

export function loadOrders() {
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

    return parsed.map(normalizeOrder).filter((order) => order.id);
  } catch {
    return [];
  }
}

export function saveOrder(order) {
  if (typeof window === 'undefined') {
    return;
  }

  const normalizedOrder = normalizeOrder(order);
  const currentOrders = loadOrders();

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([normalizedOrder, ...currentOrders]));
}

export const ORDERS_STORAGE_KEY = STORAGE_KEY;
```

### Explicación

1. La orden también necesita persistencia, igual que productos y carrito.
2. `saveOrder()` inserta la nueva orden al principio.
3. `loadOrders()` protege la app frente a datos inválidos.

### Commit sugerido

```bash
git add src/utils/ordersStorage.js
git commit -m "feat: add order storage utilities"
```

---

## 5) Paso 3: Agregar el CTA desde `Cart`

Archivos:

1. `src/pages/Cart.jsx`
2. `src/styles/Cart.module.css`

### Qué queremos lograr

1. Mantener el carrito funcional.
2. Agregar una salida clara hacia el checkout.
3. Reutilizar la utilidad de subtotal.

### AFTER de `Cart.jsx`

```text
import styles from '../styles/Cart.module.css';
import { calculateCartSubtotal } from '../utils/calculateOrderTotals';
import { formatCOP } from '../utils/formatCOP';

function Cart({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onContinueShopping,
  onProceedToCheckout,
}) {
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = calculateCartSubtotal(cartItems);

  if (cartItems.length === 0) {
    return (
      <section className={styles.container}>
        /* estado vacío existente */
      </section>
    );
  }

  return (
    <section className={styles.container}>
      /* contenido existente */
      <aside className={styles.summary}>
        /* resumen existente */
        <button type="button" className={styles.btnClear} onClick={onClearCart}>
          Vaciar carrito
        </button>

        <button type="button" className={styles.btnCheckout} onClick={onProceedToCheckout}>
          Proceder al checkout
        </button>
      </aside>
    </section>
  );
}

export default Cart;
```

### AFTER de estilos

```text
.btnContinue,
.btnClear,
.btnCheckout,
.btnRemove,
.btnQuantity {
  border: none;
  border-radius: 10px;
  font-weight: 800;
  cursor: pointer;
}

.btnCheckout {
  width: 100%;
  margin-top: 0.75rem;
  padding: 0.95rem 1rem;
  background: var(--primary);
  color: white;
}

.btnCheckout:hover {
  background: var(--primary-dark);
}
```

### Explicación

1. `Cart` ya no termina en sí mismo.
2. Ahora es la puerta de entrada al checkout.
3. El subtotal deja de calcularse manualmente en la página.

### Commit sugerido

```bash
git add src/pages/Cart.jsx src/styles/Cart.module.css
git commit -m "feat: add checkout entry point from cart"
```

---

## 6) Paso 4: Crear la página `Checkout`

Archivos:

1. `src/pages/Checkout.jsx`
2. `src/styles/Checkout.module.css`

### Qué hace esta página

1. Renderiza un formulario controlado.
2. Valida campos obligatorios.
3. Permite seleccionar envío y pago.
4. Muestra un resumen del pedido.
5. Envía la información a `App` para completar la compra.

### AFTER de `Checkout.jsx`

```text
import { useMemo, useState } from 'react';

import styles from '../styles/Checkout.module.css';
import {
  calculateOrderTotals,
  PAYMENT_METHODS,
  SHIPPING_OPTIONS,
} from '../utils/calculateOrderTotals';
import { formatCOP } from '../utils/formatCOP';

const EMAIL_REGEX = /^[^@]+@[^@]+\.[^@]+$/;

function Checkout({ cartItems, user, onBack, onCompleteCheckout }) {
  const [values, setValues] = useState({
    fullName: user?.name ?? '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    shippingMethod: SHIPPING_OPTIONS[0].id,
    paymentMethod: PAYMENT_METHODS[0].id,
  });
  const [errors, setErrors] = useState({});

  const totals = useMemo(
    () => calculateOrderTotals(cartItems, values.shippingMethod),
    [cartItems, values.shippingMethod]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }));
  };

  const validateValues = () => {
    const nextErrors = {};

    if (!values.fullName.trim()) nextErrors.fullName = 'Ingresa el nombre completo.';
    if (!values.email.trim()) nextErrors.email = 'Ingresa un correo electrónico.';
    if (values.email.trim() && !EMAIL_REGEX.test(values.email.trim())) {
      nextErrors.email = 'Ingresa un correo electrónico válido.';
    }
    if (!values.phone.trim()) nextErrors.phone = 'Ingresa un número de contacto.';
    if (!values.address.trim()) nextErrors.address = 'Ingresa la dirección de entrega.';
    if (!values.city.trim()) nextErrors.city = 'Ingresa la ciudad.';
    if (!values.postalCode.trim()) nextErrors.postalCode = 'Ingresa el código postal.';
    if (!values.shippingMethod) nextErrors.shippingMethod = 'Selecciona un método de envío.';
    if (!values.paymentMethod) nextErrors.paymentMethod = 'Selecciona un método de pago.';

    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateValues();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onCompleteCheckout({
      customer: {
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        address: values.address.trim(),
        city: values.city.trim(),
        postalCode: values.postalCode.trim(),
      },
      shippingMethodId: values.shippingMethod,
      paymentMethodId: values.paymentMethod,
    });
  };

  if (cartItems.length === 0) {
    return (
      <section className={styles.container}>
        <div className={styles.emptyState}>
          <h1 className={styles.title}>Checkout</h1>
          <p className={styles.emptyText}>
            No hay productos en el carrito. Regresa para agregar artículos antes de continuar.
          </p>
          <button type="button" className={styles.secondaryButton} onClick={onBack}>
            Volver al carrito
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      /* header, formulario, opciones y resumen */
    </section>
  );
}

export default Checkout;
```

### Explicación

1. `Checkout` no guarda la orden directamente: delega a `App`.
2. El formulario está controlado por estado local.
3. La validación es suficiente para este flujo mock.
4. Los totales se recalculan cuando cambia el método de envío.

### Commit sugerido

```bash
git add src/pages/Checkout.jsx src/styles/Checkout.module.css
git commit -m "feat: implement checkout page"
```

---

## 7) Paso 5: Crear la confirmación de orden

Archivos:

1. `src/pages/OrderConfirmation.jsx`
2. `src/styles/OrderConfirmation.module.css`

### Qué hace esta página

1. Muestra el número de orden.
2. Muestra fecha, envío y pago.
3. Muestra datos del cliente.
4. Muestra los items comprados.
5. Muestra el total final.

### AFTER de `OrderConfirmation.jsx`

```text
import styles from '../styles/OrderConfirmation.module.css';
import { formatCOP } from '../utils/formatCOP';

function OrderConfirmation({ order, onBackHome }) {
  if (!order) {
    return (
      <section className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>No hay una orden reciente</h1>
          <p className={styles.subtitle}>
            El checkout ya se cerró o no existe una compra para mostrar en esta vista.
          </p>
          <button type="button" className={styles.primaryButton} onClick={onBackHome}>
            Volver al inicio
          </button>
        </div>
      </section>
    );
  }

  const formattedDate = new Date(order.createdAt).toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <section className={styles.container}>
      /* resumen de la orden */
    </section>
  );
}

export default OrderConfirmation;
```

### Explicación

1. Esta pantalla representa el cierre del flujo de compra.
2. Si no existe una orden reciente, la vista protege la UI.
3. La confirmación reutiliza los datos generados en `App`.

### Commit sugerido

```bash
git add src/pages/OrderConfirmation.jsx src/styles/OrderConfirmation.module.css
git commit -m "feat: add order confirmation page"
```

---

## 8) Paso 6: Conectar todo desde `App.jsx`

Archivo: `src/App.jsx`

### Qué hace este paso

`App` pasa a coordinar todo el flujo de checkout.

### AFTER

```text
import { useEffect, useMemo, useState } from 'react';

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
  const [activePage, setActivePage] = useState('home');
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cartItems, setCartItems] = useState(loadCartItems);
  const [latestOrder, setLatestOrder] = useState(null);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  /* lógica existente del carrito */

  const handleStartCheckout = () => {
    setActivePage('checkout');
  };

  const handleCompleteCheckout = ({ customer, shippingMethodId, paymentMethodId }) => {
    if (cartItems.length === 0) {
      setActivePage('cart');
      return;
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
    setActivePage('order-confirmation');
  };

  const handleBackHomeAfterOrder = () => {
    setLatestOrder(null);
    setSelectedCategory(null);
    setActivePage('home');
  };

  let page = <Home onOpenCategory={handleOpenCategory} />;

  if (activePage === 'category') {
    page = <CategoryProducts /* props */ />;
  } else if (activePage === 'products') {
    page = <ProductList />;
  } else if (activePage === 'cart') {
    page = <Cart /* props */ />;
  } else if (activePage === 'checkout') {
    page = <Checkout /* props */ />;
  } else if (activePage === 'order-confirmation') {
    page = <OrderConfirmation /* props */ />;
  }

  return (
    <div className="app">
      <Header /* props */ />
      <main className="main">{page}</main>
      <Footer />
    </div>
  );
}

export default App;
```

### Explicación

1. `App` sigue siendo el orquestador principal.
2. `handleCompleteCheckout()` genera la orden final.
3. La orden se guarda, se vacía el carrito y se navega a confirmación.
4. El router todavía no es necesario para cerrar esta etapa.

### Commit sugerido

```bash
git add src/App.jsx
git commit -m "feat: connect checkout flow in app shell"
```

---

## 9) Verificación funcional final

Al terminar, verifica lo siguiente:

- Desde `Cart` aparece el botón `Proceder al checkout`.
- El checkout se abre correctamente.
- Los campos vacíos muestran errores.
- El email inválido muestra error.
- Se puede elegir envío y método de pago.
- El total cambia según el método de envío.
- Al confirmar la compra se guarda una orden.
- La pantalla de confirmación muestra el resumen completo.
- El carrito queda vacío después de confirmar.
- Al recargar, la orden sigue persistida en `localStorage`.

Comandos de validación:

```bash
npm run lint
npm run build
```

---

## 10) Cierre conceptual

Esta clase es importante porque transforma la tienda en un flujo completo de compra:

1. Catálogo.
2. Carrito.
3. Checkout.
4. Confirmación.
5. Persistencia de órdenes.

Después de esta clase, la siguiente etapa ya no es construir la compra, sino mejorar la experiencia y migrar la navegación a `react-router-dom`.
