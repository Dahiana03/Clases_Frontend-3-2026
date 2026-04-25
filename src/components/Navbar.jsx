import styles from '../styles/Navbar.module.css';
import { Link, useLocation } from 'react-router-dom';

function Navbar({ user, onSignIn, onSignOut, cartItemCount = 0 }) {
  const userLabel = user?.name ?? 'Invitado';
  const isLoggedIn = Boolean(user);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <span className={styles.brandName}>Sistema Ventas</span>
      </div>

      <div className={styles.links}>
        <Link className={`${styles.link} ${isActive('/') ? styles.active : ''}`} to="/">
          Inicio
        </Link>

        <Link className={`${styles.link} ${isActive('/products') ? styles.active : ''}`} to="/products">
          Productos
        </Link>

        <Link className={`${styles.link} ${isActive('/cart') ? styles.active : ''}`} to="/cart">
          Carrito
          {cartItemCount > 0 && (
            <span className={styles.cartBadge}>{cartItemCount}</span>
          )}
        </Link>
      </div>

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