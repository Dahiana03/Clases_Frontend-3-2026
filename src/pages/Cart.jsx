import styles from '../styles/Cart.module.css';
import { calculateOrderTotals } from '../utils/calculateOrderTotals';
import { formatCOP } from '../utils/formatCOP';

function Cart({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onContinueShopping,
  onProceedToCheckout,
}) {
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // 🔥 Usamos helper central (NO duplicamos lógica)
  const { subtotal, tax, shipping, total } = calculateOrderTotals(cartItems);

  if (cartItems.length === 0) {
    return (
      <section className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Carrito</h1>
            <p className={styles.subtitle}>Todavía no tienes productos agregados.</p>
          </div>

          <button className={styles.btnContinue} onClick={onContinueShopping}>
            Seguir comprando
          </button>
        </div>

        <div className={styles.empty}>
          <h2 className={styles.emptyTitle}>Tu carrito está vacío</h2>
          <p className={styles.emptyText}>
            Explora productos y agrega lo que necesites.
          </p>
          <button className={styles.btnContinue} onClick={onContinueShopping}>
            Ir al inicio
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Carrito</h1>
          <p className={styles.subtitle}>
            Gestiona cantidades y revisa tu compra antes de pagar.
          </p>
        </div>

        <button className={styles.btnContinue} onClick={onContinueShopping}>
          Seguir comprando
        </button>
      </div>

      <div className={styles.layout}>
        {/* 🛒 LISTA DE PRODUCTOS */}
        <div className={styles.items}>
          {cartItems.map((item) => {
            const itemSubtotal = item.price * item.quantity;

            return (
              <article key={item.id} className={styles.item}>
                <img src={item.image} alt={item.name} className={styles.image} />

                <div className={styles.itemInfo}>
                  <span className={styles.category}>{item.category}</span>
                  <h2 className={styles.name}>{item.name}</h2>
                  <p>Precio: {formatCOP(item.price)}</p>
                  <p>Stock: {item.stock}</p>
                  <p>
                    Subtotal: <strong>{formatCOP(itemSubtotal)}</strong>
                  </p>
                </div>

                <div className={styles.actions}>
                  <div className={styles.quantityBox}>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>

                  <button onClick={() => onRemoveItem(item.id)}>
                    Eliminar
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* 💰 RESUMEN */}
        <aside className={styles.summary}>
          <h2>Resumen</h2>

          <div className={styles.summaryRow}>
            <span>Productos:</span>
            <span>{cartItems.length}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Unidades:</span>
            <span>{totalItems}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Subtotal:</span>
            <span>{formatCOP(subtotal)}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>IVA:</span>
            <span>{formatCOP(tax)}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Envío:</span>
            <span>{shipping === 0 ? 'Gratis' : formatCOP(shipping)}</span>
          </div>

          <div className={styles.total}>
            <strong>Total:</strong>
            <strong>{formatCOP(total)}</strong>
          </div>

          <button
            className={styles.btnCheckout}
            onClick={onProceedToCheckout}
          >
            Proceder al checkout
          </button>

          <button
            className={styles.btnClear}
            onClick={onClearCart}
          >
            Vaciar carrito
          </button>
        </aside>
      </div>
    </section>
  );
}

export default Cart;