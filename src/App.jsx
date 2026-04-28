import { useState, useEffect, useMemo } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

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

// 🔥 IMPORTANTE: tus productos iniciales
import { products as initialProducts } from './data/products';

import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState(loadCartItems);
  const [latestOrder, setLatestOrder] = useState(null);

  // 🔥 NUEVO: estado global de productos (stock real)
  const [products, setProducts] = useState(initialProducts);

  const navigate = useNavigate();

  // ===============================
  // 💾 LOCAL STORAGE
  // ===============================
  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // ===============================
  // 🧮 DERIVADOS
  // ===============================
  const cartItemCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  // ===============================
  // 🛒 CARRITO (CON STOCK REAL)
  // ===============================
  const handleAddToCart = (product) => {
    if (!product || !Number.isFinite(Number(product.id))) return;

    // ❌ evitar stock negativo
    if (product.stock <= 0) {
      alert('Producto sin stock');
      return;
    }

    // 🔻 descontar stock global
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, stock: p.stock - 1 } : p
      )
    );

    // ➕ agregar al carrito
    setCartItems((items) => {
      const existing = items.find((i) => i.id === product.id);

      if (!existing) {
        return [...items, { ...product, quantity: 1 }];
      }

      return items.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    });
  };

  const handleUpdateCartItemQuantity = (id, newQty) => {
    setCartItems((items) =>
      items.map((item) => {
        if (item.id !== id) return item;

        const diff = newQty - item.quantity;

        // 🔄 ajustar stock
        setProducts((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, stock: p.stock - diff } : p
          )
        );

        return { ...item, quantity: newQty };
      })
    );
  };

  const handleRemoveCartItem = (id) => {
    const item = cartItems.find((i) => i.id === id);

    if (item) {
      // 🔺 devolver stock
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, stock: p.stock + item.quantity } : p
        )
      );
    }

    setCartItems((items) => items.filter((i) => i.id !== id));
  };

  const handleClearCart = () => {
    // 🔄 devolver todo el stock
    setProducts((prev) =>
      prev.map((p) => {
        const item = cartItems.find((i) => i.id === p.id);
        return item
          ? { ...p, stock: p.stock + item.quantity }
          : p;
      })
    );

    setCartItems([]);
  };

  // ===============================
  // 💳 CHECKOUT
  // ===============================
  const handleStartCheckout = () => {
    if (cartItems.length === 0) return navigate('/cart');
    navigate('/checkout');
  };

  const handleCompleteCheckout = ({ customer, shippingMethodId, paymentMethodId }) => {
    if (cartItems.length === 0) {
      navigate('/cart');
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

    navigate('/order-confirmation');
  };

  const handleBackHome = () => {
    setLatestOrder(null);
    navigate('/');
  };

  // ===============================
  // 👤 USER
  // ===============================
  const handleSignIn = () => setUser({ name: 'Usuario' });
  const handleSignOut = () => setUser(null);

  // ===============================
  // 🚀 RENDER
  // ===============================
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
            path="/products"
            element={
              <ProductList
                products={products} // 🔥 ahora usa stock dinámico
                onAddToCart={handleAddToCart}
              />
            }
          />

          <Route
            path="/category/:categoryName"
            element={
              <CategoryProducts
                products={products} // 🔥 importante
                onAddToCart={handleAddToCart}
              />
            }
          />

          <Route
            path="/cart"
            element={
              <Cart
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateCartItemQuantity}
                onRemoveItem={handleRemoveCartItem}
                onClearCart={handleClearCart}
                onContinueShopping={() => navigate('/')}
                onProceedToCheckout={handleStartCheckout}
              />
            }
          />

          <Route
            path="/checkout"
            element={
              <Checkout
                cartItems={cartItems}
                user={user}
                onBack={() => navigate('/cart')}
                onCompleteCheckout={handleCompleteCheckout}
              />
            }
          />

          <Route
            path="/order-confirmation"
            element={
              <OrderConfirmation
                order={latestOrder}
                onBackHome={handleBackHome}
              />
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