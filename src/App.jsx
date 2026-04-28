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

import { products as initialProducts } from './data/products';

import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState(loadCartItems);
  const [latestOrder, setLatestOrder] = useState(null);
  const [products, setProducts] = useState(initialProducts);

  const navigate = useNavigate();

  // 💾 persistencia
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // 🔢 contador carrito
  const cartItemCount = useMemo(
    () => cartItems.reduce((t, i) => t + i.quantity, 0),
    [cartItems]
  );

  // ======================
  // 🛒 CARRITO CON STOCK
  // ======================
  const handleAddToCart = (product) => {
    if (!product || product.stock <= 0) return;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, stock: p.stock - 1 } : p
      )
    );

    setCartItems((items) => {
      const existing = items.find((i) => i.id === product.id);

      if (!existing) return [...items, { ...product, quantity: 1 }];

      return items.map((i) =>
        i.id === product.id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      );
    });
  };

  const handleRemoveCartItem = (id) => {
    const item = cartItems.find((i) => i.id === id);

    if (item) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, stock: p.stock + item.quantity } : p
        )
      );
    }

    setCartItems((items) => items.filter((i) => i.id !== id));
  };

  const handleClearCart = () => {
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

  // ======================
  // 💳 CHECKOUT
  // ======================
  const handleCompleteCheckout = ({ customer, shippingMethodId, paymentMethodId }) => {
    if (cartItems.length === 0) return null;

    const totals = calculateOrderTotals(cartItems, shippingMethodId);

    const order = {
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      items: cartItems,
      customer,
      shippingMethod: getShippingOptionById(shippingMethodId),
      paymentMethod: getPaymentMethodById(paymentMethodId),
      totals,
    };

    saveOrder(order);
    setLatestOrder(order);
    setCartItems([]);

    return order; // 🔥 importante (no navega aquí)
  };

  const handleSuccessCheckout = () => {
    navigate('/order-confirmation');
  };

  const handleBackHome = () => {
    setLatestOrder(null);
    navigate('/');
  };

  // ======================
  // 👤 USER
  // ======================
  const handleSignIn = () => setUser({ name: 'Usuario' });
  const handleSignOut = () => setUser(null);

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
          <Route path="/" element={<Home onOpenCategory={(c) => navigate(`/category/${c}`)} />} />

          <Route
            path="/products"
            element={
              <ProductList
                products={products}
                onAddToCart={handleAddToCart}
              />
            }
          />

          <Route
            path="/category/:categoryName"
            element={
              <CategoryProducts
                cartItems={cartItems}
                onAddToCart={handleAddToCart}
              />
            }
          />

          <Route
            path="/cart"
            element={
              <Cart
                cartItems={cartItems}
                onRemoveItem={handleRemoveCartItem}
                onClearCart={handleClearCart}
                onContinueShopping={() => navigate('/')}
                onProceedToCheckout={() => navigate('/checkout')}
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
                onSuccess={handleSuccessCheckout}
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