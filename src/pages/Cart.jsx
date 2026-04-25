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

  // 🔥 lógica centralizada
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
      {/* 🔹 HEADER */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Carrito</h1>
          <p className={styles.subtitle}>
            Gestiona cantidades, revisa subtotales y prepara el checkout.
          </p>
        </div>

        <button className={styles.btnContinue} onClick={onContinueShopping}>
          Seguir comprando
        </button>
      </div>

      <div className={styles.layout}>
        {/* 🛒 LISTA DE PRODUCTOS */}
        <div className={styles.items}>
          <div className={styles.itemList}>
            {cartItems.map((item) => {
              const itemSubtotal = item.price * item.quantity;

              return (
                <article key={item.id} className={styles.item}>
                  <img
                    className={styles.image}
                    src={item.image}
                    alt={item.name}
                  />

                  <div className={styles.itemInfo}>
                    <span className={styles.category}>{item.category}</span>
                    <h2 className={styles.name}>{item.name}</h2>
                    <p className={styles.price}>
                      Precio unitario: {formatCOP(item.price)}
                    </p>
                    <p className={styles.stock}>
                      Stock disponible: {item.stock}
                    </p>
                    <p className={styles.subtotal}>
                      <span className={styles.subtotalLabel}>Subtotal:</span>{' '}
                      {formatCOP(itemSubtotal)}
                    </p>
                  </div>

                  <div className={styles.actions}>
                    <div className={styles.quantityBox}>
                      <button
                        type="button"
                        className={styles.btnQuantity}
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>

                      <span className={styles.quantityValue}>
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        className={styles.btnQuantity}
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className={styles.btnRemove}
                      onClick={() => onRemoveItem(item.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* 💰 RESUMEN */}
        <aside className={styles.summary}>
          <h2 className={styles.summaryTitle}>Resumen</h2>

          <div className={styles.summaryRows}>
            <div className={styles.summaryRow}>
              <span>Productos</span>
              <span className={styles.summaryValue}>{cartItems.length}</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Unidades</span>
              <span className={styles.summaryValue}>{totalItems}</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span className={styles.summaryValue}>{formatCOP(subtotal)}</span>
            </div>

            <div className={styles.summaryRow}>
              <span>IVA (19%)</span>
              <span className={styles.summaryValue}>{formatCOP(tax)}</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Envío</span>
              <span className={styles.summaryValue}>
                {shipping === 0 ? 'Gratis' : formatCOP(shipping)}
              </span>
            </div>

            <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
              <span>Total</span>
              <span className={styles.summaryValue}>{formatCOP(total)}</span>
            </div>
          </div>

          <button
            className={styles.btnClear}
            onClick={onClearCart}
          >
            Vaciar carrito
          </button>

          <button
            className={styles.btnCheckout}
            onClick={onProceedToCheckout}
          >
            Proceder al checkout
          </button>
        </aside>
      </div>
    </section>
  );
}

export default Cart;