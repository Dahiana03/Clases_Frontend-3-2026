import styles from '../styles/Header.module.css';
import Navbar from './Navbar';

function Header({ user, onSignIn, onSignOut, cartItemCount }) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Navbar
          user={user}
          onSignIn={onSignIn}
          onSignOut={onSignOut}
          cartItemCount={cartItemCount}
        />
      </div>
    </header>
  );
}

export default Header;