# Clase 06 (Estudiantes) — Home by Category + Página por Categoría + Modal de Detalle (Semana 06)

**Punto de partida (BEFORE):** proyecto al cierre de la clase 05  
**Meta (AFTER):** proyecto actual con Home by Category, página de categoría, modal de detalle y catálogo consolidado

Esta guía está pensada para que el profesor la use para explicar la clase paso a paso y, al mismo tiempo, sirva como material de copy/paste para los estudiantes.

Los bloques están en formato `text` para que el código quede exactamente igual al del proyecto actual.

---

## 0) Preparación

Trabajaremos dentro del proyecto:

```bash
cd frontend-sistema-ventas
npm install
npm run dev
```

Comandos útiles durante la clase:

```bash
npm run dev
npm run lint
npm run build
```

---

## 1) Qué vamos a construir en esta clase

En esta clase vamos a dejar el flujo principal del catálogo mucho más claro:

1. El usuario entra al Home.
2. El Home muestra categorías, no una pantalla vacía.
3. Al hacer click en una categoría, se abre una página con solo los productos de esa categoría.
4. En esa página, el usuario puede buscar por nombre.
5. Desde cada tarjeta, puede abrir un modal con el detalle.
6. La página de productos sigue funcionando como pantalla de administración del catálogo.

---

## 2) Mini-guía: por qué seguimos sin router

Todavía no estamos usando `react-router-dom`.

En vez de eso, la navegación se controla con estado en `App.jsx`.

La idea es esta:

1. `activePage` define qué vista se está mostrando.
2. `selectedCategory` guarda qué categoría eligió el usuario.
3. Según esos dos valores, React decide qué componente renderizar.

Esto es muy útil para explicar tres conceptos básicos:

1. Levantar estado al componente padre.
2. Pasar callbacks a componentes hijos.
3. Renderizar condicionalmente según el estado.

---

## 3) Mini-guía: qué papel cumple `selectedCategory`

`selectedCategory` es la pieza que conecta el Home con la página de categoría.

Flujo mental:

1. El usuario hace click en `Accesorios`.
2. `Home` llama una función que vive en `App`.
3. `App` guarda `selectedCategory = 'Accesorios'`.
4. `App` cambia `activePage = 'category'`.
5. Se renderiza `CategoryProducts` con esa categoría como prop.

---

## 4) Paso 1: Confirmar la data base del catálogo

Antes de construir el Home por categorías, necesitamos que la data ya tenga:

1. `category`
2. `stock`
3. `rating`

Archivo: `src/data/products.js`

### Qué hacer

Si el proyecto de clase 05 no coincide exactamente, reemplaza el archivo completo por esta versión.

### AFTER

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

### Explicación clave para clase

1. La categoría es la base del nuevo Home.
2. El rating nos permite decidir qué producto representa mejor una categoría.
3. El stock y el precio siguen siendo importantes tanto en la lista como en el modal.

### Commit sugerido

```bash
git add src/data/products.js
git commit -m "feat: preparar seed con category stock y rating"
```

---

## 5) Paso 2: Centralizar la carga de productos desde `localStorage`

Archivo nuevo: `src/utils/productsStorage.js`

### Qué hace este archivo

1. Lee los productos guardados en `localStorage`.
2. Si no encuentra nada, usa el seed.
3. Si encuentra datos viejos, los normaliza.
4. Garantiza que siempre exista un `rating` válido.

### AFTER

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

### Explicación

1. `loadProducts()` nos evita repetir la lógica de lectura en cada página.
2. `normalizeProduct()` resuelve un problema muy común: que el `localStorage` tenga datos incompletos o antiguos.
3. `clampRating()` fuerza el valor a un rango válido entre 1 y 5.

### Commit sugerido

```bash
git add src/utils/productsStorage.js
git commit -m "feat: centralizar carga y normalizacion de productos"
```

---

## 6) Paso 3: Actualizar `ProductCard` para que sea reutilizable

Archivo: `src/components/ProductCard.jsx`

### Qué queremos lograr

Queremos usar la misma tarjeta en varios contextos:

1. En `ProductList`, con botones de editar y eliminar.
2. En `CategoryProducts`, con botón de más información.
3. En cualquier otra vista, incluso sin botones extra.

La solución es hacer que los botones dependan de callbacks opcionales.

### AFTER

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

### AFTER de estilos

Archivo: `src/styles/ProductCard.module.css`

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

### Explicación

1. La tarjeta no decide sola qué botones mostrar.
2. La tarjeta pregunta: “¿me pasaron `onDetails`? ¿me pasaron `onEdit`? ¿me pasaron `onDelete`?”
3. Eso la vuelve mucho más reutilizable.

### Commit sugerido

```bash
git add src/components/ProductCard.jsx src/styles/ProductCard.module.css
git commit -m "feat: hacer product card reutilizable con acciones opcionales"
```

---

## 7) Paso 4: Crear el modal de detalle

Archivos nuevos:

1. `src/components/ProductDetailsModal.jsx`
2. `src/styles/ProductDetailsModal.module.css`

### Qué queremos lograr

Cuando el usuario esté viendo productos de una categoría, debe poder abrir un modal con más información, sin salir de la misma pantalla.

### AFTER de `ProductDetailsModal.jsx`

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

### AFTER de `ProductDetailsModal.module.css`

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

### Explicación

Hay tres ideas importantes aquí:

1. Si el modal no está abierto, retorna `null` y no renderiza nada.
2. El modal se puede cerrar por botón, por click en el overlay o con `Escape`.
3. El modal no busca productos por sí mismo: recibe el producto como prop.

### Commit sugerido

```bash
git add src/components/ProductDetailsModal.jsx src/styles/ProductDetailsModal.module.css
git commit -m "feat: agregar modal de detalle de producto"
```

---

## 8) Paso 5: Crear la página `CategoryProducts`

Archivos:

1. `src/pages/CategoryProducts.jsx`
2. `src/styles/CategoryProducts.module.css`

### Qué hace esta página

1. Recibe una categoría.
2. Carga productos desde `loadProducts()`.
3. Filtra por categoría.
4. Permite buscar por nombre.
5. Abre el modal de detalle.

### AFTER de `CategoryProducts.jsx`

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

### AFTER de `CategoryProducts.module.css`

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

### Explicación

1. Aquí aparece por primera vez la idea de pantalla intermedia: Home -> Categoría -> Detalle.
2. `useMemo()` evita recalcular el filtro en cada render sin necesidad.
3. El modal está completamente controlado por estado local.

### Commit sugerido

```bash
git add src/pages/CategoryProducts.jsx src/styles/CategoryProducts.module.css
git commit -m "feat: crear pagina de productos por categoria"
```

---

## 9) Paso 6: Rehacer el `Home` como grilla de categorías

Archivos:

1. `src/pages/Home.jsx`
2. `src/styles/Home.module.css`

### Idea pedagógica

El Home no debe listar todos los productos. Eso sería repetir `ProductList`.

El Home debe ayudar a entrar al catálogo por una categoría.

Para eso vamos a mostrar una sola tarjeta por categoría, usando el producto mejor calificado de esa categoría como imagen representativa.

### AFTER de `Home.jsx`

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
            <span className={homeStyles.categoryLabel} aria-hidden="true">
              <span className={homeStyles.categoryLabelText}>{category}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Home;
```

### AFTER de `Home.module.css`

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
  position: relative;
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

.categoryLabel {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0.7rem 0.85rem;
  text-align: left;
  pointer-events: none;
}

.categoryLabel::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--gray-900);
  opacity: 0.65;
}

.categoryLabelText {
  position: relative;
  z-index: 1;
  color: white;
  font-weight: 900;
  font-size: 1rem;
  letter-spacing: 0.2px;
}
```

### Explicación

1. `Map` permite quedarnos con una sola entrada por categoría.
2. Si aparece otro producto de la misma categoría con mejor rating, reemplaza al anterior.
3. El Home no tiene que saber cómo renderizar la página de categoría. Solo dispara `onOpenCategory(category)`.

### Commit sugerido

```bash
git add src/pages/Home.jsx src/styles/Home.module.css
git commit -m "feat: transformar home en grilla de categorias"
```

---

## 10) Paso 7: Actualizar `App.jsx` para navegar sin router

Archivo: `src/App.jsx`

### Qué hace este paso

`App` pasa a ser el orquestador del flujo:

1. Guarda la página activa.
2. Guarda la categoría seleccionada.
3. Decide qué pantalla mostrar.

### AFTER

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

### Explicación

Hay dos funciones clave:

1. `handleOpenCategory(category)`
   Guarda la categoría y cambia de pantalla.

2. `handleBackFromCategory()`
   Limpia la categoría y vuelve al Home.

Esta es la parte más importante para explicar cómo dos componentes que no están uno dentro del otro directamente pueden coordinarse a través de `App`.

### Commit sugerido

```bash
git add src/App.jsx
git commit -m "feat: agregar navegacion por categoria sin router"
```

---

## 11) Paso 8: Revisar `ProductForm` para conservar `rating`

Archivo: `src/components/ProductForm.jsx`

### Por qué revisarlo

Aunque esta clase está enfocada en Home by Category, el formulario sigue participando del flujo del catálogo.

Si editamos o creamos productos, necesitamos conservar un `rating` válido para no romper la lógica del Home y del modal.

### AFTER

```text
import { useEffect, useState } from 'react';

import styles from '../styles/ProductForm.module.css';

const emptyValues = {
  name: '',
  category: '',
  price: '',
  stock: '',
  image: '',
  description: '',
};

function ProductForm({ initialValues, onSubmit, onCancel, isEditing = false }) {
  const [values, setValues] = useState(emptyValues);

  useEffect(() => {
    if (initialValues) {
      setValues({
        name: initialValues.name ?? '',
        category: initialValues.category ?? '',
        price: initialValues.price ?? '',
        stock: initialValues.stock ?? '',
        image: initialValues.image ?? '',
        description: initialValues.description ?? '',
      });
    } else {
      setValues(emptyValues);
    }
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

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

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>{isEditing ? 'Editar producto' : 'Agregar producto'}</h2>
        <p className={styles.subtitle}>Completa el formulario y guarda los cambios.</p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span className={styles.label}>Nombre</span>
          <input
            className={styles.input}
            name="name"
            value={values.name}
            onChange={handleChange}
            placeholder="Ej: Teclado gamer"
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Categoría</span>
          <input
            className={styles.input}
            name="category"
            value={values.category}
            onChange={handleChange}
            placeholder="Ej: Accesorios"
          />
        </label>

        <div className={styles.row}>
          <label className={styles.field}>
            <span className={styles.label}>Precio</span>
            <input
              className={styles.input}
              name="price"
              type="number"
              min="1"
              value={values.price}
              onChange={handleChange}
              placeholder="Ej: 199990"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Stock</span>
            <input
              className={styles.input}
              name="stock"
              type="number"
              min="0"
              value={values.stock}
              onChange={handleChange}
              placeholder="Ej: 10"
            />
          </label>
        </div>

        <label className={styles.field}>
          <span className={styles.label}>Imagen (URL)</span>
          <input
            className={styles.input}
            name="image"
            value={values.image}
            onChange={handleChange}
            placeholder="https://..."
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Descripción</span>
          <textarea
            className={styles.textarea}
            name="description"
            value={values.description}
            onChange={handleChange}
            placeholder="Describe el producto..."
            rows={3}
          />
        </label>

        <div className={styles.actions}>
          {onCancel ? (
            <button className={styles.btnSecondary} type="button" onClick={onCancel}>
              Cancelar
            </button>
          ) : null}

          <button className={styles.btnPrimary} type="submit">
            {isEditing ? 'Guardar cambios' : 'Agregar producto'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default ProductForm;
```

### Explicación

1. El formulario no expone el campo rating al usuario.
2. Pero sí preserva ese valor para no romper la lógica del Home.
3. Esto es importante porque el Home usa el rating para decidir qué producto representa cada categoría.

### Commit sugerido

```bash
git add src/components/ProductForm.jsx
git commit -m "feat: preservar rating al guardar productos"
```

---

## 12) Paso 9: Consolidar `ProductList` como pantalla administrativa

Archivo: `src/pages/ProductList.jsx`

### Idea pedagógica

`ProductList` sigue existiendo y sigue siendo importante.

La diferencia es que ahora el proyecto tiene dos flujos claros:

1. Flujo de usuario: `Home -> CategoryProducts -> Modal`
2. Flujo de administración: `ProductList -> Crear / Editar / Eliminar`

### AFTER

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

### Explicación

1. `ProductList` guarda en `localStorage` cada vez que cambia `productsState`.
2. Los botones `Editar` y `Eliminar` aparecen porque aquí sí se pasan `onEdit` y `onDelete` a `ProductCard`.
3. En `CategoryProducts`, en cambio, se pasa `onDetails`.

Ese contraste ayuda mucho a practicar la reutilización de componentes.

### Commit sugerido

```bash
git add src/pages/ProductList.jsx src/components/ProductForm.jsx
git commit -m "feat: consolidar flujo administrativo del catalogo"
```

---

## 13) Orden recomendado para entender

Si quieres entender más claramente lo que se realizó, este orden funciona bien:

1. Mostrar la página lograda en el navegador.
2. Mirar la data base del catálogo.
3. Mirar `productsStorage.js` como infraestructura.
4. Entender `ProductCard` y por qué ahora es reutilizable.
5. Crear el modal.
6. Crear `CategoryProducts`.
7. Transformar `Home`.
8. Actualizar `App.jsx`.
9. Recordar que `ProductList` sigue siendo la parte CRUD.

Con ese orden, se entienden primero la intención de la interfaz y luego la coordinación entre componentes.

---

## 14) Verificación funcional final

Al terminar, verifica lo siguiente:

- Al entrar a Inicio aparecen categorías.
- Cada categoría se ve como una tarjeta con imagen.
- Al hacer click en una categoría se abre su página.
- El botón `Volver` regresa al Home.
- El input filtra por nombre dentro de la categoría.
- El botón `Más información` abre el modal.
- El modal se cierra con botón, overlay y tecla `Escape`.
- En `Productos`, se puede agregar, editar y eliminar.
- Los cambios sobreviven al recargar gracias a `localStorage`.

Comandos de validación:

```bash
npm run lint
npm run build
```

---

## 15) Cierre conceptual

Esta clase es importante porque junta varias ideas de React en un solo flujo real:

1. Estado local.
2. Estado compartido a través del componente padre.
3. Renderizado condicional.
4. Reutilización de componentes.
5. Persistencia local.
6. Separación entre pantalla de usuario y pantalla administrativa.

Si se logra que se entienda bien esta clase, ya están listos para dar el salto a una navegación formal con router en una siguiente etapa.
