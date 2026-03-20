/*import { useMemo, useState } from 'react';

import Footer from './components/Footer';
import Header from './components/Header';
import Cart from './pages/Cart';
import CategoryProducts from './pages/CategoryProducts';
import Home from './pages/Home';
import ProductList from './pages/ProductList';

import './App.css';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

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

  const page = useMemo(() => {
    if (activePage === 'category') {
      return <CategoryProducts category={selectedCategory} onBack={handleBackFromCategory} />;
    }
    if (activePage === 'products') return <ProductList />;
    if (activePage === 'cart') return <Cart />;

    return <Home onOpenCategory={handleOpenCategory} />;
  }, [activePage, selectedCategory]);

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
      />

      <main className="main">{page}</main>

      <Footer />
    </div>
  );
}

export default App;*/

import { useMemo, useState } from 'react';

import Footer from './components/Footer';
import Header from './components/Header';
import Cart from './pages/Cart';
import CategoryProducts from './pages/CategoryProducts';
import Home from './pages/Home';
import ProductList from './pages/ProductList';

import './App.css';

function App() {
  // ===== Estados =====
  const [activePage, setActivePage] = useState('home');
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]);

  // ===== Funciones del carrito =====
  const handleAddToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const handleRemoveFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // ===== Navegación =====
  const handleNavigate = (page) => {
    setActivePage(page);
    if (page !== 'category') setSelectedCategory(null);
  };

  const handleOpenCategory = (category) => {
    setSelectedCategory(category);
    setActivePage('category');
  };

  const handleBackFromCategory = () => {
    setSelectedCategory(null);
    setActivePage('home');
  };

  // ===== Autenticación =====
  const handleSignIn = () => setUser({ name: 'Usuario' });
  const handleSignOut = () => setUser(null);

  // ===== Página activa =====
  const page = useMemo(() => {
    switch (activePage) {
      case 'category':
        return (
          <CategoryProducts
            category={selectedCategory}
            onBack={handleBackFromCategory}
            onAddToCart={handleAddToCart} // pasa carrito
          />
        );

      case 'products':
        return <ProductList onAddToCart={handleAddToCart} />;

      case 'cart':
        return <Cart cart={cart} onRemove={handleRemoveFromCart} />;

      default:
        return <Home onOpenCategory={handleOpenCategory} />;
    }
  }, [activePage, selectedCategory, cart]);

  return (
    <div className="app">
      <Header
        activePage={activePage}
        onNavigate={handleNavigate}
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      <main className="main">{page}</main>

      <Footer />
    </div>
  );
}

export default App;