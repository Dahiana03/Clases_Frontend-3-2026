import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

import logo from '../assets/logo.jpg';
import useAuth from '../hooks/useAuth';
import styles from '../styles/Navbar.module.css';

function Navbar({ cartItemCount = 0 }) {
  const { currentUser, logout } = useAuth();

  const isLoggedIn = Boolean(currentUser);
  const userLabel = currentUser?.name ?? 'Invitado';

  const navigate = useNavigate();
  const location = useLocation();

  const linksRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  // ===============================
  // 📍 SECCIONES ACTIVAS
  // ===============================
  const isHomeSection =
    location.pathname === '/' || location.pathname.startsWith('/category/');

  const isCartSection =
    location.pathname.startsWith('/cart') ||
    location.pathname.startsWith('/checkout') ||
    location.pathname.startsWith('/order-confirmation');

  const isAccountSection =
    location.pathname.startsWith('/user/') ||
    location.pathname === '/login' ||
    location.pathname === '/register';

  const getLinkClass = (isActive) =>
    `${styles.link} ${isActive ? styles.active : ''}`;

  // ===============================
  // 🔥 INDICADOR ANIMADO
  // ===============================
  useEffect(() => {
    const activeLink = linksRef.current?.querySelector(`.${styles.active}`);

    if (activeLink) {
      setIndicatorStyle({
        width: activeLink.offsetWidth,
        left: activeLink.offsetLeft,
      });
    }
  }, [location.pathname]);

  // ===============================
  // 🔐 ACCIONES
  // ===============================
  const handleAccountNavigation = () => {
    navigate(isLoggedIn ? '/user/profile' : '/login');
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  // ===============================
  // 🚀 UI
  // ===============================
  return (
    <nav className={styles.navbar}>
      {/* LOGO */}
      <div className={styles.brand}>
        <img className={styles.logo} src={logo} alt="Logo" />
        <span className={styles.brandName}>Sistema Ventas</span>
      </div>

      {/* LINKS */}
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

        <button
          type="button"
          className={getLinkClass(isAccountSection)}
          onClick={handleAccountNavigation}
        >
          Mi cuenta
        </button>
      </div>

      {/* USUARIO */}
      <div className={styles.auth}>
        <span className={styles.userName}>{userLabel}</span>

        {isLoggedIn ? (
          <button
            type="button"
            className={styles.authBtn}
            onClick={handleLogout}
          >
            Salir
          </button>
        ) : (
          <div className={styles.guestActions}>
            <button
              type="button"
              className={styles.authBtn}
              onClick={() => navigate('/login')}
            >
              Ingresar
            </button>
            <button
              type="button"
              className={styles.secondaryAuthBtn}
              onClick={() => navigate('/register')}
            >
              Registrarse
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;