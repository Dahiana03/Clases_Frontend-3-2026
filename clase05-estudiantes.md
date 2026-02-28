# Clase 05 (Estudiantes) — Semana 05: Categorías + Modal + Rating + Persistencia

**Punto de partida (BEFORE):** `frontend-sistema-ventas semana-04 CRUD Product/`  
**Meta (AFTER):** `frontend-sistema-ventas/`

Esta guía está pensada para copy/paste. Los bloques están en formato `text` para que no se “reformatee” el código y así quede **idéntico** al del proyecto.

---

## 0) Preparación

En el proyecto base (semana-04):

- Carpeta: `frontend-sistema-ventas semana-04 CRUD Product/`
- `npm install`
- `npm run dev`

---

## 1) Agregar `rating` a la data (seed)

Archivo (BEFORE): `src/data/products.js`  
Archivo (AFTER): `src/data/products.js`

### Qué hacer

- En el proyecto base, **reemplaza el archivo completo** por la versión AFTER.

### BEFORE (semana-04)

```text
import webcamLogitechC920Image from '../assets/img-products/webcam-logitech-c920.jpg';

export const products = [
  {
    id: 1,
    name: 'Laptop HP Pavilion',
    category: 'Laptops',
    price: 4999990,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    description: 'Laptop potente con procesador Intel Core i7, 16GB RAM y 512GB SSD',
  },
  {
    id: 2,
    name: 'Mouse Logitech MX Master 3',
    category: 'Accesorios',
    price: 119990,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400',
    description: 'Mouse ergonómico inalámbrico con alta precisión y batería de larga duración',
  },
  {
    id: 3,
    name: 'Teclado Mecánico Keychron K2',
    category: 'Accesorios',
    price: 149990,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400',
    description: 'Teclado mecánico compacto con switches Blue y retroiluminación RGB',
  },
  {
    id: 4,
    name: 'Monitor LG UltraWide 34"',
    category: 'Monitores',
    price: 899990,
    stock: 6,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
    description:
      'Monitor curvo ultra ancho de 34 pulgadas, resolución 3440x1440, ideal para productividad',
  },
  {
    id: 5,
    name: 'Audífonos Sony WH-1000XM5',
    category: 'Audio',
    price: 399990,
    stock: 9,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400',
    description: 'Audífonos premium con cancelación de ruido activa y sonido Hi-Res',
  },
  {
    id: 6,
    name: 'Webcam Logitech C920',
    category: 'Accesorios',
    price: 79990,
    stock: 14,
    image: webcamLogitechC920Image,
    description: 'Webcam Full HD 1080p ideal para videollamadas y streaming',
  },
];
```

### AFTER (semana-05)

```text
import webcamLogitechC920Image from '../assets/img-products/webcam-logitech-c920.jpg';

export const products = [
  {
    id: 1,
    name: 'Laptop HP Pavilion',
    category: 'Laptops',
    rating: 4.6,
    price: 4999990,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    description: 'Laptop potente con procesador Intel Core i7, 16GB RAM y 512GB SSD',
  },
  {
    id: 2,
    name: 'Mouse Logitech MX Master 3',
    category: 'Accesorios',
    rating: 4.8,
    price: 119990,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400',
    description: 'Mouse ergonómico inalámbrico con alta precisión y batería de larga duración',
  },
  {
    id: 3,
    name: 'Teclado Mecánico Keychron K2',
    category: 'Accesorios',
    rating: 4.4,
    price: 149990,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400',
    description: 'Teclado mecánico compacto con switches Blue y retroiluminación RGB',
  },
  {
    id: 4,
    name: 'Monitor LG UltraWide 34"',
    category: 'Monitores',
    rating: 4.7,
    price: 899990,
    stock: 6,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
    description:
      'Monitor curvo ultra ancho de 34 pulgadas, resolución 3440x1440, ideal para productividad',
  },
  {
    id: 5,
    name: 'Audífonos Sony WH-1000XM5',
    category: 'Audio',
    rating: 4.9,
    price: 399990,
    stock: 9,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400',
    description: 'Audífonos premium con cancelación de ruido activa y sonido Hi-Res',
  },
  {
    id: 6,
    name: 'Webcam Logitech C920',
    category: 'Accesorios',
    rating: 4.2,
    price: 79990,
    stock: 14,
    image: webcamLogitechC920Image,
    description: 'Webcam Full HD 1080p ideal para videollamadas y streaming',
  },
];
```

---

## 2) Crear helper de carga + normalización desde `localStorage`

Archivo nuevo (AFTER): `src/utils/productsStorage.js`

### Qué hacer

- En el proyecto base, **crea este archivo** con el contenido exacto.

```text
import { products as seedProducts } from '../data/products';

const STORAGE_KEY = 'products';
const DEFAULT_RATING = 3;

const seedById = new Map(seedProducts.map((product) => [product.id, product]));

const clampRating = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return DEFAULT_RATING;
  return Math.min(5, Math.max(1, parsed));
};

const normalizeProduct = (product) => {
  const seedProduct = seedById.get(product?.id);

  return {
    ...seedProduct,
    ...product,
    rating: clampRating(product?.rating ?? seedProduct?.rating ?? DEFAULT_RATING),
  };
};

export function loadProducts() {
  if (typeof window === 'undefined') {
    return seedProducts;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return seedProducts;
  }

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.map(normalizeProduct) : seedProducts;
  } catch {
    return seedProducts;
  }
}

export const PRODUCTS_STORAGE_KEY = STORAGE_KEY;
export const PRODUCTS_DEFAULT_RATING = DEFAULT_RATING;
```

---

## 3) Actualizar `ProductList` para usar `loadProducts()` y pasar `rating`

Archivo (BEFORE): `src/pages/ProductList.jsx` (semana-04)  
Archivo (AFTER): `src/pages/ProductList.jsx` (semana-05)

### Qué hacer

- En el proyecto base, **reemplaza el archivo completo** por el AFTER.

### BEFORE (semana-04)

```text
import { useEffect, useState } from 'react';

import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';
import { products } from '../data/products';
import styles from '../styles/ProductList.module.css';

const STORAGE_KEY = 'products';

function ProductList() {
  const [productsState, setProductsState] = useState(() => {
    if (typeof window === 'undefined') {
      return products;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return products;
    }

    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : products;
    } catch {
      return products;
    }
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(productsState));
    } catch (error) {
      void error;
    }
  }, [productsState]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingProduct(null);
    setIsFormOpen(false);
  };

  const handleAddProduct = (product) => {
    setProductsState((prev) => {
      const maxId = prev.reduce((acc, item) => Math.max(acc, item.id), 0);
      const nextId = maxId + 1;

      return [...prev, { ...product, id: nextId }];
    });

    handleCloseForm();
  };

  const handleDeleteProduct = (id) => {
    setProductsState((prev) => prev.filter((product) => product.id !== id));

    if (editingProduct?.id === id) {
      handleCloseForm();
    }
  };

  const handleEditStart = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleEditSubmit = (updatedProduct) => {
    setProductsState((prev) =>
      prev.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))
    );
    handleCloseForm();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Productos Informáticos</h1>
        <p className={styles.subtitle}>
          Encuentra los mejores productos de tecnología para tu setup
        </p>
      </header>

      {isFormOpen ? (
        <ProductForm
          initialValues={editingProduct}
          isEditing={Boolean(editingProduct)}
          onCancel={handleCloseForm}
          onSubmit={editingProduct ? handleEditSubmit : handleAddProduct}
        />
      ) : (
        <>
          <div className={styles.toolbar}>
            <button className={styles.btnAdd} type="button" onClick={handleOpenCreate}>
              Agregar producto
            </button>
          </div>

          <div className={styles.grid}>
            {productsState.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                category={product.category}
                price={product.price}
                stock={product.stock}
                image={product.image}
                description={product.description}
                onDelete={() => handleDeleteProduct(product.id)}
                onEdit={() => handleEditStart(product)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ProductList;
```

### AFTER (semana-05)

```text
import { useEffect, useState } from 'react';

import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';
import styles from '../styles/ProductList.module.css';
import { loadProducts, PRODUCTS_STORAGE_KEY } from '../utils/productsStorage';

const STORAGE_KEY = PRODUCTS_STORAGE_KEY;

function ProductList() {
  const [productsState, setProductsState] = useState(loadProducts);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(productsState));
    } catch (error) {
      void error;
    }
  }, [productsState]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingProduct(null);
    setIsFormOpen(false);
  };

  const handleAddProduct = (product) => {
    setProductsState((prev) => {
      const maxId = prev.reduce((acc, item) => Math.max(acc, item.id), 0);
      const nextId = maxId + 1;

      return [...prev, { ...product, id: nextId }];
    });

    handleCloseForm();
  };

  const handleDeleteProduct = (id) => {
    setProductsState((prev) => prev.filter((product) => product.id !== id));

    if (editingProduct?.id === id) {
      handleCloseForm();
    }
  };

  const handleEditStart = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleEditSubmit = (updatedProduct) => {
    setProductsState((prev) =>
      prev.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))
    );
    handleCloseForm();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Productos Informáticos</h1>
        <p className={styles.subtitle}>
          Encuentra los mejores productos de tecnología para tu setup
        </p>
      </header>

      {isFormOpen ? (
        <ProductForm
          initialValues={editingProduct}
          isEditing={Boolean(editingProduct)}
          onCancel={handleCloseForm}
          onSubmit={editingProduct ? handleEditSubmit : handleAddProduct}
        />
      ) : (
        <>
          <div className={styles.toolbar}>
            <button className={styles.btnAdd} type="button" onClick={handleOpenCreate}>
              Agregar producto
            </button>
          </div>

          <div className={styles.grid}>
            {productsState.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                category={product.category}
                price={product.price}
                rating={product.rating}
                stock={product.stock}
                image={product.image}
                description={product.description}
                onDelete={() => handleDeleteProduct(product.id)}
                onEdit={() => handleEditStart(product)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ProductList;
```

---

## 4) Asegurar `rating` por defecto al guardar desde `ProductForm`

Archivo (BEFORE): `src/components/ProductForm.jsx` (semana-04)  
Archivo (AFTER): `src/components/ProductForm.jsx` (semana-05)

### Qué hacer

- En el proyecto base, **busca** la función `handleSubmit` y reemplázala por el AFTER.

### BEFORE (solo `handleSubmit`)

```text
  const handleSubmit = (event) => {
    event.preventDefault();

    const name = values.name.trim();
    const category = values.category.trim();
    const image = values.image.trim();
    const description = values.description.trim();

    const price = Number(values.price);
    const stock = Number(values.stock);

    if (!name) return;
    if (!Number.isFinite(price) || price <= 0) return;
    if (!Number.isFinite(stock) || stock < 0) return;

    onSubmit({
      ...initialValues,
      name,
      category,
      price,
      stock,
      image,
      description,
    });

    if (!isEditing) {
      setValues(emptyValues);
    }
  };
```

### AFTER (solo `handleSubmit`)

```text
  const handleSubmit = (event) => {
    event.preventDefault();

    const name = values.name.trim();
    const category = values.category.trim();
    const image = values.image.trim();
    const description = values.description.trim();

    const price = Number(values.price);
    const stock = Number(values.stock);

    const parsedRating = Number(initialValues?.rating ?? 3);
    const rating = Number.isFinite(parsedRating) ? Math.min(5, Math.max(1, parsedRating)) : 3;

    if (!name) return;
    if (!Number.isFinite(price) || price <= 0) return;
    if (!Number.isFinite(stock) || stock < 0) return;

    onSubmit({
      ...initialValues,
      name,
      category,
      price,
      stock,
      image,
      description,
      rating,
    });

    if (!isEditing) {
      setValues(emptyValues);
    }
  };
```

---

## 5) Crear modal de detalle

Archivos nuevos (AFTER):

- `src/components/ProductDetailsModal.jsx`
- `src/styles/ProductDetailsModal.module.css`

### ProductDetailsModal.jsx

```text
import { useEffect } from 'react';

import styles from '../styles/ProductDetailsModal.module.css';
import { formatCOP } from '../utils/formatCOP';

function ProductDetailsModal({ isOpen, product, onClose }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) {
    return null;
  }

  const ratingValue = Number(product.rating);
  const rating = Number.isFinite(ratingValue) ? ratingValue : null;

  const handleOverlayMouseDown = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div className={styles.overlay} onMouseDown={handleOverlayMouseDown}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={`Detalle de ${product.name}`}
      >
        <header className={styles.header}>
          <div>
            <p className={styles.category}>{product.category}</p>
            <h2 className={styles.title}>{product.name}</h2>
          </div>

          <button type="button" className={styles.btnClose} onClick={onClose}>
            Cerrar
          </button>
        </header>

        <div className={styles.content}>
          <img className={styles.image} src={product.image} alt={product.name} />

          <div className={styles.details}>
            <p className={styles.description}>{product.description}</p>

            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Precio</span>
                <span className={styles.metaValue}>{formatCOP(product.price)}</span>
              </div>

              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Stock</span>
                <span className={styles.metaValue}>{product.stock}</span>
              </div>

              {rating !== null ? (
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Calificación</span>
                  <span className={styles.metaValue}>{rating}/5</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsModal;
```

### ProductDetailsModal.module.css

```text
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 50;
}

.modal {
  width: 100%;
  max-width: 900px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--gray-200);
}

.category {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--gray-500);
}

.title {
  margin: 0.25rem 0 0;
  font-size: 1.4rem;
  font-weight: 900;
  color: var(--gray-900);
}

.btnClose {
  border: none;
  background: var(--gray-100);
  color: var(--gray-900);
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-weight: 800;
}

.btnClose:hover {
  background: var(--gray-200);
}

.content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 1.25rem;
}

.image {
  width: 100%;
  height: 340px;
  object-fit: cover;
  border-radius: 10px;
}

.details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.description {
  color: var(--gray-900);
  line-height: 1.6;
}

.meta {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.metaItem {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 10px;
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
}

.metaLabel {
  color: var(--gray-500);
  font-weight: 800;
}

.metaValue {
  color: var(--gray-900);
  font-weight: 900;
}

@media (max-width: 768px) {
  .content {
    grid-template-columns: 1fr;
  }

  .image {
    height: 240px;
  }
}
```

---

## 6) Actualizar `ProductCard` (rating + botón “Más información”) y su CSS

Archivos (AFTER):

- `src/components/ProductCard.jsx`
- `src/styles/ProductCard.module.css`

### ProductCard.jsx

```text
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

export default ProductCard;
```

### ProductCard.module.css

```text
.productCard {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.productCard:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.productImage {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.productInfo {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.productCategory {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6366f1;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.productName {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.productDescription {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
  flex: 1;
}

.productRating {
  font-size: 0.875rem;
  font-weight: 800;
  color: #374151;
}

.productStock {
  font-size: 0.875rem;
  font-weight: 700;
  color: #374151;
}

.productFooter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.productPrice {
  font-size: 1.5rem;
  font-weight: 800;
  color: #059669;
}

.btnLike {
  background: #f3f4f6;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btnLike:hover {
  background: #e5e7eb;
}

.btnLike:active {
  transform: scale(0.95);
}

.btnLike.liked {
  background: #fee2e2;
  color: #dc2626;
}

.btnLike.liked:hover {
  background: #fecaca;
}

.cardActions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.btnEdit,
.btnDetails,
.btnDelete {
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 800;
  cursor: pointer;
}

.btnDetails {
  background: var(--gray-100);
  color: var(--gray-900);
}

.btnDetails:hover {
  background: var(--gray-200);
}

.btnEdit {
  background: var(--primary);
  color: white;
}

.btnEdit:hover {
  background: var(--primary-dark);
}

.btnDelete {
  background: var(--danger);
  color: white;
}

.btnDelete:hover {
  filter: brightness(0.95);
}
```

---

## 7) Navegación sin router: `App.jsx` con `selectedCategory`

Archivo (AFTER): `src/App.jsx`

### Qué hacer

- En el proyecto base, **reemplaza el archivo completo** por esta versión.

```text
import { useMemo, useState } from 'react';

import Footer from './components/Footer';
import Header from './components/Header';
import Cart from './pages/Cart';
import CategoryProducts from './pages/CategoryProducts';
import Home from './pages/Home';
import ProductList from './pages/ProductList';

import './App.css';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleNavigate = (page) => {
    setActivePage(page);

    if (page !== 'category') {
      setSelectedCategory(null);
    }
  };

  const handleOpenCategory = (category) => {
    setSelectedCategory(category);
    setActivePage('category');
  };

  const handleBackFromCategory = () => {
    setSelectedCategory(null);
    setActivePage('home');
  };

  const page = useMemo(() => {
    if (activePage === 'category') {
      return <CategoryProducts category={selectedCategory} onBack={handleBackFromCategory} />;
    }
    if (activePage === 'products') return <ProductList />;
    if (activePage === 'cart') return <Cart />;

    return <Home onOpenCategory={handleOpenCategory} />;
  }, [activePage, selectedCategory]);

  const handleSignIn = () => {
    setUser({ name: 'Usuario' });
  };

  const handleSignOut = () => {
    setUser(null);
  };

  return (
    <div className="app">
      <Header
        activePage={activePage}
        onNavigate={handleNavigate}
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      <main className="main">{page}</main>

      <Footer />
    </div>
  );
}

export default App;
```

---

## 8) Crear página `CategoryProducts` (filtro + modal)

Archivos nuevos (AFTER):

- `src/pages/CategoryProducts.jsx`
- `src/styles/CategoryProducts.module.css`

### CategoryProducts.jsx

```text
import { useMemo, useState } from 'react';

import ProductCard from '../components/ProductCard';
import ProductDetailsModal from '../components/ProductDetailsModal';
import styles from '../styles/CategoryProducts.module.css';
import productListStyles from '../styles/ProductList.module.css';
import { loadProducts } from '../utils/productsStorage';

function CategoryProducts({ category, onBack }) {
  const [query, setQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productsState] = useState(loadProducts);

  const filteredProducts = useMemo(() => {
    if (!category) return [];

    const q = query.trim().toLowerCase();

    return productsState.filter((product) => {
      if (product.category !== category) return false;
      if (!q) return true;

      return String(product.name ?? '')
        .toLowerCase()
        .includes(q);
    });
  }, [category, productsState, query]);

  const handleOpenDetails = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <button type="button" className={styles.btnBack} onClick={onBack}>
          Volver
        </button>

        <div className={styles.headerInfo}>
          <h1 className={styles.title}>{category ?? 'Categoría'}</h1>
          <p className={styles.subtitle}>Filtra por nombre para encontrar un producto</p>
        </div>
      </header>

      <div className={styles.toolbar}>
        <input
          className={styles.input}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por nombre..."
        />
      </div>

      {!category ? (
        <p className={styles.empty}>Selecciona una categoría desde Inicio.</p>
      ) : filteredProducts.length === 0 ? (
        <p className={styles.empty}>No hay productos para mostrar.</p>
      ) : (
        <div className={productListStyles.grid}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              category={product.category}
              rating={product.rating}
              price={product.price}
              stock={product.stock}
              image={product.image}
              description={product.description}
              onDetails={() => handleOpenDetails(product)}
            />
          ))}
        </div>
      )}

      <ProductDetailsModal
        isOpen={isModalOpen}
        product={selectedProduct}
        onClose={handleCloseDetails}
      />
    </section>
  );
}

export default CategoryProducts;
```

### CategoryProducts.module.css

```text
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0 1rem;
}

.headerInfo {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.btnBack {
  border: none;
  background: var(--gray-100);
  color: var(--gray-900);
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-weight: 900;
}

.btnBack:hover {
  background: var(--gray-200);
}

.title {
  color: white;
  font-weight: 900;
  font-size: 1.6rem;
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 700;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin: 1rem 0 1.5rem;
}

.input {
  width: 100%;
  max-width: 420px;
  padding: 0.75rem 0.9rem;
  border-radius: 10px;
  border: 1px solid var(--gray-200);
  outline: none;
}

.input:focus {
  border-color: var(--primary);
}

.empty {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 800;
}
```

---

## 9) Actualizar Inicio: grilla de categorías (producto con mejor rating)

Archivos (AFTER):

- `src/pages/Home.jsx`
- `src/styles/Home.module.css`

### Home.jsx

```text
import { useMemo, useState } from 'react';

import homeStyles from '../styles/Home.module.css';
import { loadProducts } from '../utils/productsStorage';

function Home({ onOpenCategory }) {
  const [productsState] = useState(loadProducts);

  const categoryTiles = useMemo(() => {
    const bestByCategory = new Map();

    for (const product of productsState) {
      const category = product.category ?? 'Sin categoría';
      const rating = Number(product.rating);
      const current = bestByCategory.get(category);

      if (!current) {
        bestByCategory.set(category, { product, rating });
        continue;
      }

      const currentRating = Number(current.rating);
      const isBetter =
        (Number.isFinite(rating) ? rating : 0) >
        (Number.isFinite(currentRating) ? currentRating : 0);

      if (isBetter) {
        bestByCategory.set(category, { product, rating });
      }
    }

    return Array.from(bestByCategory.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, data]) => ({ category, product: data.product }));
  }, [productsState]);

  return (
    <div className={homeStyles.container}>
      <header className={homeStyles.header}>
        <h1 className={homeStyles.title}>Inicio</h1>
        <p className={homeStyles.subtitle}>Selecciona una categoría para ver sus productos</p>
      </header>

      <div className={homeStyles.categoryGrid}>
        {categoryTiles.map(({ category, product }) => (
          <button
            key={category}
            type="button"
            className={homeStyles.categoryTile}
            onClick={() => onOpenCategory?.(category)}
            aria-label={`Ver productos de ${category}`}
          >
            <img className={homeStyles.categoryImage} src={product.image} alt={product.name} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default Home;
```

### Home.module.css

```text
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header {
  text-align: center;
  margin: 2rem 0;
}

.title {
  font-size: 2.5rem;
  font-weight: 900;
  color: white;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
}

.categorySection {
  margin: 2rem 0;
}

.categoryHeader {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.categoryTitle {
  font-size: 1.25rem;
  font-weight: 900;
  color: white;
}

.categoryCount {
  font-weight: 800;
  color: rgba(255, 255, 255, 0.85);
}

.categoryGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  padding-bottom: 2rem;
}

.categoryTile {
  border: none;
  padding: 0;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.categoryTile:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
}

.categoryTile:active {
  transform: translateY(-1px);
}

.categoryImage {
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
}
```

---

## 10) README (documentación)

En `frontend-sistema-ventas/README.md` (semana-05) hay un fence suelto al final del archivo (una línea con ```).
Para que tu README quede válido y puedas copiar/pegar sin problemas, usa esta versión (misma que semana-05 pero **sin** ese fence final):

```text
# Sistema de Ventas (React + Vite)

Proyecto didáctico para practicar React (componentes, props, estado, formularios controlados) con una app simple de catálogo/ventas.

## Requisitos

- Node.js 18+ (recomendado)

## Instalar y ejecutar

- Instalar: npm install
- Desarrollo: npm run dev
- Lint: npm run lint
- Build: npm run build
- Preview: npm run preview

## Notas

- La carpeta clases/ existe en el workspace como documentación del curso, pero no forma parte del repo del proyecto.

---

## Estructura principal

src/
components/
Header.jsx
Navbar.jsx
Footer.jsx
ProductCard.jsx
ProductForm.jsx
ProductDetailsModal.jsx
pages/
Home.jsx
ProductList.jsx
Cart.jsx
data/
products.js
styles/
\*.module.css
utils/
formatCOP.js

## Navegación (sin router)

La app no usa react-router-dom todavía. En su lugar, se navega por estado local en src/App.jsx:

- home: Inicio
- products: Productos (CRUD)
- cart: Carrito
- category: Productos por categoría

## Funcionalidades por pantalla

### Inicio

En src/pages/Home.jsx:

- Una sola grilla de categorías.
- Cada categoría muestra solo la imagen del producto destacado (mejor rating; en empate se conserva el primero).
- Al hacer clic en una categoría, navega a la página de productos de esa categoría.

### Categoría

En src/pages/CategoryProducts.jsx:

- Lista los productos de la categoría seleccionada.
- Permite filtrar por nombre (input de búsqueda).
- Botón "Más información" abre un modal con el detalle del producto.

### Productos (CRUD en memoria + persistencia)

En src/pages/ProductList.jsx:

- Agregar / editar / eliminar productos con src/components/ProductForm.jsx.
- Persistencia en localStorage bajo la clave products.
- Compatibilidad: si hay productos guardados sin rating, se normaliza con un valor por defecto.

## Datos

El seed inicial está en src/data/products.js. Incluye rating para ordenar en Inicio.

## Referencia (template)

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
```

---

## 11) Verificación final

- `npm run dev`

Checklist:

- Inicio muestra una grilla de categorías (solo imagen del destacado).
- Click en categoría abre productos de esa categoría.
- Filtro por nombre funciona.
- El modal abre/cierra con ESC y clic en overlay.
- CRUD de productos sigue funcionando y persiste en `localStorage` (clave `products`).
- Productos viejos sin `rating` quedan con `rating` por defecto (3).
