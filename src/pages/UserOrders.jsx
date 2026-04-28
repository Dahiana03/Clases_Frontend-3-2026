import { useMemo } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

import OrderCard from '../components/OrderCard';
import useAuth from '../hooks/useAuth';
import styles from '../styles/UserOrders.module.css';
import { loadOrders, loadOrdersByUserId } from '../utils/ordersStorage';

function UserOrders() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const orders = useMemo(() => {
    let data = [];

    // 🔐 Si hay usuario → solo sus órdenes
    if (currentUser?.id) {
      data = loadOrdersByUserId(currentUser.id);
    } else {
      // 🌐 fallback → todas (modo local)
      data = loadOrders();
    }

    return data.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [currentUser?.id]);

  // 🔒 protección opcional (recomendado si usas ProtectedRoute)
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (orders.length === 0) {
    return (
      <section className={styles.container}>
        <div className={styles.emptyState}>
          <p className={styles.eyebrow}>Historial</p>
          <h1 className={styles.title}>Mis órdenes</h1>
          <p className={styles.subtitle}>
            Aún no tienes compras registradas. Completa el checkout para ver tus pedidos aquí.
          </p>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => navigate('/user/profile')}
            >
              Ir al perfil
            </button>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => navigate('/')}
            >
              Explorar productos
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Historial</p>
          <h1 className={styles.title}>Historial de órdenes</h1>
          <p className={styles.subtitle}>
            Consulta tus compras y revisa el detalle de cada pedido.
          </p>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => navigate('/user/profile')}
          >
            Mi perfil
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => navigate('/')}
          >
            Volver al inicio
          </button>
        </div>
      </header>

      <div className={styles.list}>
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onOpen={(orderId) => navigate(`/user/orders/${orderId}`)}
          />
        ))}
      </div>
    </section>
  );
}

export default UserOrders;