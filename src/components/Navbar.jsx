import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

import logo from '../assets/img-logos/logo-Cesde-2023.svg';
import styles from '../styles/Navbar.module.css';

function Navbar({ user, onSignIn, onSignOut, cartItemCount = 0 }) {
  const userLabel = user?.name ?? 'Invitado';
  const isLoggedIn = Boolean(user);
  const location = useLocation();

  const linksRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  const isCartSection =
    location.pathname.startsWith('/cart') ||
    location.pathname.startsWith('/checkout') ||
    location.pathname.startsWith('/order-confirmation');

  const isHomeSection =
    location.pathname === '/' || location.pathname.startsWith('/category/');

  const getLinkClass = (isActive) =>
    `${styles.link} ${isActive ? styles.active : ''}`;

  // 🔥 mover indicador
  useEffect(() => {
    const activeLink = linksRef.current?.querySelector(`.${styles.active}`);

    if (activeLink) {
      setIndicatorStyle({
        width: activeLink.offsetWidth,
        left: activeLink.offsetLeft,
      });
    }
  }, [location.pathname]);

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <div className={styles.brand}>
        <img className={styles.logo} src={logo} alt="Logo" />
        <span className={styles.brandName}>Sistema Ventas</span>
      </div>

      {/* Links */}
      <div className={styles.links} ref={linksRef}>
        {/* 🔥 indicador */}
        <span
          className={styles.indicator}
          style={{
            width: indicatorStyle.width,
            transform: `translateX(${indicatorStyle.left}px)`,
          }}
        />

        <NavLink to="/" end className={() => getLinkClass(isHomeSection)}>
          Inicio
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) => getLinkClass(isActive)}
        >
          Productos
        </NavLink>

        <NavLink to="/cart" className={() => getLinkClass(isCartSection)}>
          Carrito
          {cartItemCount > 0 && (
            <span className={styles.cartBadge}>{cartItemCount}</span>
          )}
        </NavLink>
      </div>

      {/* Usuario */}
      <div className={styles.auth}>
        <span className={styles.userName}>{userLabel}</span>

        {isLoggedIn ? (
          <button className={styles.authBtn} onClick={onSignOut}>
            Sign out
          </button>
        ) : (
          <button className={styles.authBtn} onClick={onSignIn}>
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;