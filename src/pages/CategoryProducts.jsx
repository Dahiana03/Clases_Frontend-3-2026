import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ProductCard from '../components/ProductCard';
import ProductDetailsModal from '../components/ProductDetailsModal';
import styles from '../styles/CategoryProducts.module.css';
import productListStyles from '../styles/ProductList.module.css';

function CategoryProducts({ products, cartItems, onAddToCart }) {
  const [query, setQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { categoryName } = useParams();

  // 📦 Decodificar categoría
  const category = useMemo(
    () => (categoryName ? decodeURIComponent(categoryName) : null),
    [categoryName]
  );

  // 🛒 Cantidad en carrito por producto
  const cartQuantityByProductId = useMemo(
    () => new Map(cartItems.map((item) => [item.id, item.quantity])),
    [cartItems]
  );

  // 🔎 Filtro por categoría + búsqueda
  const filteredProducts = useMemo(() => {
    if (!category) return [];

    const q = query.trim().toLowerCase();

    return products.filter((product) => {
      if (product.category !== category) return false;
      if (!q) return true;

      return String(product.name ?? '')
        .toLowerCase()
        .includes(q);
    });
  }, [category, products, query]);

  // 🔍 Modal detalles
  const handleOpenDetails = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // 🔙 Navegación inteligente (PRO)
  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <section className={styles.container}>
      {/* HEADER */}
      <header className={styles.header}>
        <button
          type="button"
          className={styles.btnBack}
          onClick={handleGoBack}
        >
          Volver
        </button>

        <div className={styles.headerInfo}>
          <h1 className={styles.title}>{category ?? 'Categoría'}</h1>
          <p className={styles.subtitle}>
            Filtra por nombre para encontrar un producto
          </p>
        </div>
      </header>

      {/* 🔎 BUSCADOR */}
      <div className={styles.toolbar}>
        <input
          className={styles.input}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por nombre..."
        />
      </div>

      {/* 📦 CONTENIDO */}
      {!category ? (
        <p className={styles.empty}>
          Selecciona una categoría desde Inicio.
        </p>
      ) : filteredProducts.length === 0 ? (
        <p className={styles.empty}>
          No hay productos para mostrar.
        </p>
      ) : (
        <div className={productListStyles.grid}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              category={product.category}
              rating={product.rating}
              price={product.price}
              stock={product.stock}
              image={product.image}
              description={product.description}
              onAddToCart={onAddToCart}
              disableAddToCart={
                (cartQuantityByProductId.get(product.id) ?? 0) >= product.stock
              }
              onDetails={() => handleOpenDetails(product)}
            />
          ))}
        </div>
      )}

      {/* 🔍 MODAL */}
      <ProductDetailsModal
        isOpen={isModalOpen}
        product={selectedProduct}
        onClose={handleCloseDetails}
      />
    </section>
  );
}

export default CategoryProducts;