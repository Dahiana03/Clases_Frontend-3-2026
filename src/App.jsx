import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import Footer from './components/Footer';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

import useAuth from './hooks/useAuth';

import Cart from './pages/Cart';
import CategoryProducts from './pages/CategoryProducts';
import Checkout from './pages/Checkout';
import Home from './pages/Home';
import Login from './pages/Login';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderDetail from './pages/OrderDetail';
import ProductList from './pages/ProductList';
import Register from './pages/Register';
import UserOrders from './pages/UserOrders';
import UserProfile from './pages/UserProfile';

import {
  calculateOrderTotals,
  getPaymentMethodById,
  getShippingOptionById,
} from './utils/calculateOrderTotals';

import { CART_STORAGE_KEY, loadCartItems } from './utils/cartStorage';
import { saveOrder } from './utils/ordersStorage';

// 🔥 productos iniciales (con stock)
import { products as initialProducts } from './data/products';

import './App.css';

function App() {
  const { currentUser } = useAuth();
  const navigate = useNavigate(); // 🔥 IMPORTANTE

  const [cartItems, setCartItems] = useState(loadCartItems);
  const [latestOrder, setLatestOrder] = useState(null);

  // 🔥 estado global de productos
  const [products, setProducts] = useState(initialProducts);

  // ======================
  // 💾 LOCAL STORAGE
  // ======================
  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // ======================
  // 🔢 DERIVADOS
  // ======================
  const cartItemCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  // ======================
  // 🛒 CARRITO + STOCK REAL
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

  const handleUpdateCartItemQuantity = (id, newQty) => {
    setCartItems((items) =>
      items.map((item) => {
        if (item.id !== id) return item;

        const diff = newQty - item.quantity;

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
      id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: currentUser?.id ?? '',
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

  // ======================
  // 🚀 RENDER
  // ======================
  return (
    <div className="app">
      <Header user={currentUser} cartItemCount={cartItemCount} />

      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

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
                products={products}
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
                onProceedToCheckout={() => navigate('/checkout')}
              />
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout
                  cartItems={cartItems}
                  user={currentUser}
                  onCompleteCheckout={handleCompleteCheckout}
                  onSuccess={(order) => {
                    navigate('/order-confirmation'); // 🔥 AQUÍ ESTÁ LA MAGIA
                  }}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order-confirmation"
            element={
              latestOrder ? (
                <OrderConfirmation
                  order={latestOrder}
                  onBackHome={handleBackHomeAfterOrder}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/user/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/orders"
            element={
              <ProtectedRoute>
                <UserOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/orders/:orderId"
            element={
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
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