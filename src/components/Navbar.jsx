import { NavLink, useLocation } from 'react-router-dom';

import logo from '../assets/img-logos/logo-Cesde-2023.svg';
import styles from '../styles/Navbar.module.css';

function Navbar({ user, onSignIn, onSignOut, cartItemCount = 0 }) {
  const userLabel = user?.name ?? 'Invitado';
  const isLoggedIn = Boolean(user);
  const location = useLocation();

  // 🔹 Para marcar activo "Carrito" en todo el flujo
  const isCartSection =
    location.pathname.startsWith('/cart') ||
    location.pathname.startsWith('/checkout') ||
    location.pathname.startsWith('/order-confirmation');

  // 🔹 Para marcar activo "Inicio" incluyendo categorías
  const isHomeSection =
    location.pathname === '/' || location.pathname.startsWith('/category/');

  return (
    <nav className={styles.navbar}>
      {/* 🔹 Logo */}
      <div className={styles.brand}>
        <img className={styles.logo} src={logo} alt="Logo" />
        <span className={styles.brandName}>Sistema Ventas</span>
      </div>

      {/* 🔹 Links */}
      <div className={styles.links}>
        {/* Inicio */}
        <NavLink
          to="/"
          end
          className={() =>
            `${styles.link} ${isHomeSection ? styles.active : ''}`
          }
        >
          Inicio
        </NavLink>

        {/* Productos */}
        <NavLink
          to="/products"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ''}`
          }
        >
          Productos
        </NavLink>

        {/* Carrito */}
        <NavLink
          to="/cart"
          className={() =>
            `${styles.link} ${isCartSection ? styles.active : ''}`
          }
        >
          Carrito
          {cartItemCount > 0 && (
            <span className={styles.cartBadge}>{cartItemCount}</span>
          )}
        </NavLink>
      </div>

      {/* 🔹 Usuario */}
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