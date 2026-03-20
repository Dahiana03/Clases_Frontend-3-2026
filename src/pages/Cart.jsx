import styles from '../styles/Cart.module.css';
import { formatCOP } from '../utils/formatCOP';

function Cart({ cartItems, onUpdateQuantity, onRemoveItem, onContinueShopping }) {
 

  if (cartItems.length === 0) {
    return (
      <section className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Carrito</h1>
            <p className={styles.subtitle}>Todavía no tienes productos agregados.</p>
          </div>

          <button type="button" className={styles.btnContinue} onClick={onContinueShopping}>
            Seguir comprando
          </button>
        </div>

        <div className={styles.empty}>
          <h2 className={styles.emptyTitle}>Tu carrito está vacío</h2>
          <p className={styles.emptyText}>
            Vuelve al catálogo, entra a una categoría y agrega productos para continuar.
          </p>
          <button type="button" className={styles.btnContinue} onClick={onContinueShopping}>
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
            Gestiona cantidades, revisa subtotales y prepara el checkout.
          </p>
        </div>

        <button type="button" className={styles.btnContinue} onClick={onContinueShopping}>
          Seguir comprando
        </button>
      </div>

      <div className={styles.layout}>
        <div className={styles.items}>
          <div className={styles.itemList}>
            {cartItems.map((item) => {
              const itemSubtotal = item.price * item.quantity;

              return (
                <article key={item.id} className={styles.item}>
                  <img className={styles.image} src={item.image} alt={item.name} />

                  <div className={styles.itemInfo}>
                    <span className={styles.category}>{item.category}</span>
                    <h2 className={styles.name}>{item.name}</h2>
                    <p className={styles.price}>Precio unitario: {formatCOP(item.price)}</p>
                    <p className={styles.stock}>Stock disponible: {item.stock}</p>
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
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className={styles.quantityValue}>{item.quantity}</span>
                      <button
                        type="button"
                        className={styles.btnQuantity}
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
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

      </div>
    </section>
  );
}

export default Cart;