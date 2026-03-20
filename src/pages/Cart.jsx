import React from 'react';
import { formatCOP } from '../utils/formatCOP'; // si tienes una función para formatear precios

function Cart({ cart = [], onRemove }) {
  // Calcular total del carrito de manera segura
  const total = cart.reduce((acc, product) => acc + (Number(product.price) || 0), 0);

  return (
    <section className="cart">
      <h1>Carrito</h1>

      {/* Si el carrito está vacío */}
      {cart.length === 0 ? (
        <p>El carrito está vacío 🛒</p>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map((product, index) => (
              <li key={index} className="cart-item">
                <img
                  src={product.image}
                  alt={product.name}
                  width="80"
                  className="cart-item-image"
                />
                <div className="cart-item-info">
                  <h3 className="cart-item-name">{product.name}</h3>
                  <p className="cart-item-price">
                    {formatCOP ? formatCOP(product.price) : `$${product.price}`}
                  </p>
                </div>
                <button
                  className="cart-item-remove"
                  onClick={() => onRemove(index)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>

          <h2 className="cart-total">
            Total: {formatCOP ? formatCOP(total) : `$${total}`}
          </h2>
        </>
      )}
    </section>
  );
}

export default Cart;