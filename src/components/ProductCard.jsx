/*import { useState } from 'react';

import styles from '../styles/ProductCard.module.css';
import { formatCOP } from '../utils/formatCOP';

function ProductCard({
  name,
  category,
  price,
  stock,
  image,
  description,
  rating,
  onDetails,
  onEdit,
  onDelete,
}) {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
    }
  };

  return (
    <article className={styles.productCard}>
      <img src={image} alt={name} className={styles.productImage} />
      <div className={styles.productInfo}>
        <span className={styles.productCategory}>{category}</span>
        <h3 className={styles.productName}>{name}</h3>
        {Number.isFinite(Number(rating)) ? (
          <p className={styles.productRating}>Calificación: {Number(rating)}/5</p>
        ) : null}
        <p className={styles.productDescription}>{description}</p>
        <p className={styles.productStock}>Stock: {stock}</p>
        <div className={styles.productFooter}>
          <span className={styles.productPrice}>{formatCOP(price)}</span>
          <button
            className={`${styles.btnLike} ${isLiked ? styles.liked : ''}`}
            onClick={handleLike}
          >
            {isLiked ? '❤️' : '🤍'} {likes} Me gusta
          </button>
        </div>

        {onDetails || onEdit || onDelete ? (
          <div className={styles.cardActions}>
            {onDetails ? (
              <button type="button" className={styles.btnDetails} onClick={onDetails}>
                Más información
              </button>
            ) : null}

            {onEdit ? (
              <button type="button" className={styles.btnEdit} onClick={onEdit}>
                Editar
              </button>
            ) : null}

            {onDelete ? (
              <button type="button" className={styles.btnDelete} onClick={onDelete}>
                Eliminar
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default ProductCard;*/

import { useState } from 'react';
import styles from '../styles/ProductCard.module.css';
import { formatCOP } from '../utils/formatCOP';

function ProductCard({
  name,
  category,
  price,
  stock,
  image,
  description,
  rating,
  onDetails,
  onEdit,
  onDelete,
  onAddToCart, // opcional, si no se pasa, el botón sigue apareciendo
}) {
  // ===== Estado de "me gusta" =====
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
    }
  };

  // ===== Función para agregar al carrito (simulada si no hay prop) =====
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({ name, category, price, image });
    } else {
      console.log(`Producto agregado al carrito: ${name}`);
      alert(`${name} agregado al carrito (simulado)`);
    }
  };

  // ===== Renderizado =====
  return (
    <article className={styles.productCard}>
      {/* Imagen del producto */}
      <img src={image} alt={name} className={styles.productImage} />

      <div className={styles.productInfo}>
        {/* Categoría y nombre */}
        <span className={styles.productCategory}>{category}</span>
        <h3 className={styles.productName}>{name}</h3>

        {/* Calificación */}
        {Number.isFinite(Number(rating)) && (
          <p className={styles.productRating}>Calificación: {Number(rating)}/5</p>
        )}

        {/* Descripción y stock */}
        <p className={styles.productDescription}>{description}</p>
        <p className={styles.productStock}>Stock: {stock}</p>

        {/* Precio y botones */}
        <div className={styles.productFooter}>
          <span className={styles.productPrice}>{formatCOP(price)}</span>

          {/* Botón "Me gusta" */}
          <button
            className={`${styles.btnLike} ${isLiked ? styles.liked : ''}`}
            onClick={handleLike}
          >
            {isLiked ? '❤️' : '🤍'} {likes} Me gusta
          </button>

          {/* Botón siempre visible para agregar al carrito */}
          <button className={styles.btnAddToCart} onClick={handleAddToCart}>
            🛒 Agregar al carrito
          </button>
        </div>

        {/* Acciones adicionales */}
        {(onDetails || onEdit || onDelete) && (
          <div className={styles.cardActions}>
            {onDetails && (
              <button type="button" className={styles.btnDetails} onClick={onDetails}>
                Más información
              </button>
            )}
            {onEdit && (
              <button type="button" className={styles.btnEdit} onClick={onEdit}>
                Editar
              </button>
            )}
            {onDelete && (
              <button type="button" className={styles.btnDelete} onClick={onDelete}>
                Eliminar
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default ProductCard;