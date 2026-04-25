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

import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState(loadCartItems);
  const [latestOrder, setLatestOrder] = useState(null);

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
  // 🛒 CARRITO
  // ===============================
  const handleAddToCart = (product) => {
    if (!product || !Number.isFinite(Number(product.id))) return;

    setCartItems((items) => {
      const existing = items.find((i) => i.id === product.id);

      const stock =
        Number.isFinite(Number(product.stock)) && Number(product.stock) > 0
          ? Number(product.stock)
          : 1;

      if (!existing) {
        return [
          ...items,
          {
            ...product,
            id: Number(product.id),
            price: Number(product.price) || 0,
            stock,
            quantity: 1,
          },
        ];
      }

      return items.map((item) =>
        item.id === product.id
          ? {
              ...item,
              stock,
              quantity: Math.min(item.quantity + 1, stock),
            }
          : item
      );
    });
  };

  const handleUpdateCartItemQuantity = (id, qty) => {
    setCartItems((items) =>
      items.flatMap((item) => {
        if (item.id !== id) return [item];

        const stock = item.stock || 1;
        const newQty = Math.max(1, Math.min(stock, Math.floor(qty)));

        return newQty > 0 ? [{ ...item, quantity: newQty }] : [];
      })
    );
  };

  const handleRemoveCartItem = (id) => {
    setCartItems((items) => items.filter((i) => i.id !== id));
  };

  const handleClearCart = () => setCartItems([]);

  // ===============================
  // 💳 CHECKOUT
  // ===============================
  const handleStartCheckout = () => {
    navigate('/checkout');
  };

  const handleCompleteCheckout = ({ customer, shippingMethodId, paymentMethodId }) => {
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }

    const totals = calculateOrderTotals(cartItems, shippingMethodId);

    const order = {
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),

      // 🔹 copia segura (recomendado)
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
            element={<ProductList onAddToCart={handleAddToCart} />}
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