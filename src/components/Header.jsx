import styles from '../styles/Header.module.css';
import Navbar from './Navbar';

function Header({ cartItemCount }) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Navbar cartItemCount={cartItemCount} />
      </div>
    </header>
  );
}

export default Header;