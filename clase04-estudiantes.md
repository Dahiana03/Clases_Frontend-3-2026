# Clase 04 (Guía para Estudiantes) — Stock + CRUD de Productos (Agregar / Editar / Eliminar)

Esta guía está pensada para que una persona **sin experiencia previa** pueda implementar los cambios paso a paso.

> Proyecto oficial para esta clase: `frontend-sistema-ventas/`

---

## 📋 Tabla de contenidos

1. [Antes de empezar](#antes-de-empezar)
2. [Mini-guía: qué son los props (y cómo verlos)](#mini-guía-qué-son-los-props-y-cómo-verlos)
3. [Mini-guía: qué es `prev` en `setState` (NO es un prop)](#mini-guía-qué-es-prev-en-setstate-no-es-un-prop)
4. [Mini-guía: qué es `useEffect` y por qué lo usaremos](#mini-guía-qué-es-useeffect-y-por-qué-lo-usaremos)
5. [Paso 1: Agregar `stock` a la data y mostrarlo en la UI](#paso-1-agregar-stock-a-la-data-y-mostrarlo-en-la-ui)
6. [Paso 2: Preparar productos en estado (fuente de verdad)](#paso-2-preparar-productos-en-estado-fuente-de-verdad)
7. [Paso 3: Crear `ProductForm` (formulario controlado)](#paso-3-crear-productform-formulario-controlado)
8. [Paso 4: Agregar productos (inmutabilidad)](#paso-4-agregar-productos-inmutabilidad)
9. [Paso 5: Eliminar productos](#paso-5-eliminar-productos)
10. [Paso 6: Editar productos (modo edición)](#paso-6-editar-productos-modo-edición)
11. [Paso 8: Mejora UX (formulario bajo demanda)](#paso-8-mejora-ux-formulario-bajo-demanda)
12. [Paso 9: Persistencia con localStorage](#paso-9-persistencia-con-localstorage)
13. [Paso 7: Verificación final](#paso-7-verificación-final)

---

## Antes de empezar

### 1) Instalar dependencias

En una terminal, entra al proyecto:

```bash
cd frontend-sistema-ventas
npm install
```

### 2) Comandos que usarás

```bash
npm run dev
npm run lint
npm run build
```

### 3) Estructura en la que vamos a trabajar

Todo lo que hacemos es dentro de:

```
frontend-sistema-ventas/src/
  components/
    ProductCard.jsx
    ProductForm.jsx
  pages/
    ProductList.jsx
  data/
    products.js
  styles/
    ProductCard.module.css
    ProductForm.module.css
    ProductList.module.css
```

---

## Mini-guía: qué son los props (y cómo verlos)

**Props** son datos que un componente padre le entrega a un componente hijo.

Ejemplo:

```jsx
<ProductCard name={product.name} stock={product.stock} />
```

- `name` y `stock` son **props**.
- React crea un objeto `props` y se lo pasa a `ProductCard`.

## Paso 9: Persistencia con localStorage

En este momento, tu CRUD funciona perfecto, pero tiene un problema:

- Si recargas la página (F5), React vuelve a empezar y se pierde el estado.

Vamos a guardar la lista en `localStorage` para que se mantenga.

### 9.1 Cargar desde `localStorage` (si existe)

Archivo: `frontend-sistema-ventas/src/pages/ProductList.jsx`

1. Define una clave (simple):

```js
const STORAGE_KEY = "products";
```

2. Cambia tu `useState(products)` por esta forma “lazy” (lee 1 vez al inicio):

```jsx
const [productsState, setProductsState] = useState(() => {
  if (typeof window === "undefined") {
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
```

### 📝 Commit granular (Paso 9.1)

```bash
git add frontend-sistema-ventas/src/pages/ProductList.jsx
git commit -m "feat: cargar productos desde localStorage (fallback seed)"
```

### 9.2 Guardar en `localStorage` cuando cambie el estado

Archivo: `frontend-sistema-ventas/src/pages/ProductList.jsx`

1. Asegúrate de importar `useEffect`:

```jsx
import { useEffect, useState } from "react";
```

2. Debajo de tus `useState(...)`, agrega este efecto:

```jsx
useEffect(() => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(productsState));
  } catch (error) {
    void error;
  }
}, [productsState]);
```

Con esto:

- Si agregas/eliminas/editar productos, `productsState` cambia.
- Entonces `useEffect` se ejecuta y guarda la lista en `localStorage`.
- Cuando recargas, el paso 9.1 vuelve a cargar desde ahí.

### 📝 Commit granular (Paso 9.2)

```bash
git add frontend-sistema-ventas/src/pages/ProductList.jsx
git commit -m "feat: persistir productos en localStorage"
```

### 9.3 Probar y resetear

Checklist rápido:

- Agrega un producto.
- Recarga la página: debe seguir.

Reset (si quieres volver a los productos iniciales):

- En DevTools (Application → Local Storage) borra la key `products` y recarga.

Dentro de `ProductCard`, React llama tu función así (idea mental):

```js
ProductCard({ name: 'Laptop...', stock: 5, ... })
```

Por eso, esto funciona:

```jsx
function ProductCard({ name, stock }) {
  return (
    <p>
      {name} — Stock: {stock}
    </p>
  );
}
```

### ¿Cómo saber qué trae un prop?

- Forma 1 (rápida): dentro del componente, imprime el objeto:

```js
console.log({ name, stock });
```

- Forma 2 (mejor en React): usa **React Developer Tools** (extensión del navegador). Ahí seleccionas el componente y ves sus props.

> Importante: un prop **no “aparece solo”**. Si un hijo lo usa, el padre debe enviarlo.

---

## Mini-guía: qué es `prev` en `setState` (NO es un prop)

Vas a ver código así:

```js
setProductsState((prev) => [...prev, newProduct]);
```

- `prev` **NO es un prop**.
- `prev` es el **estado anterior** (previous state) que React te entrega cuando usas la forma “funcional” de `setState`.

### ¿Por qué usarlo?

Porque a veces el nuevo estado depende del anterior, y React puede “agrupar” actualizaciones (batching). Si usas directamente `productsState` podrías leer un valor viejo.

Regla práctica:

- Si tu update depende del estado anterior → usa `setState((prev) => ...)`.

Ejemplos reales:

- Arrays:

```js
setProductsState((prev) => prev.filter((p) => p.id !== id));
```

- Objetos (formularios):

```js
setValues((prev) => ({ ...prev, [name]: value }));
```

---

## Mini-guía: qué es `useEffect` y por qué lo usaremos

`useEffect` es un hook para ejecutar código **después del render**.

- React renderiza el componente (pinta UI).
- Luego corre el efecto si corresponde.

La forma típica:

```js
useEffect(() => {
  // código que corre después del render
}, [dependencias]);
```

La lista de dependencias significa:

- `[]` → corre una vez (al montar)
- `[x]` → corre cuando cambia `x`

### ¿Por qué lo necesitamos en esta clase?

Cuando editas un producto, el formulario debe **precargar** los valores del producto.

Pero el formulario tiene su propio estado (`useState`). Si cambia `initialValues` (prop que le manda el padre), el formulario debe “sincronizar” sus inputs.

Eso se hace con:

```js
useEffect(() => {
  if (initialValues) setValues(...);
  else setValues(emptyValues);
}, [initialValues]);
```

---

## Paso 1: Agregar `stock` a la data y mostrarlo en la UI

### 1.1 Agregar `stock` en `src/data/products.js`

Archivo: `frontend-sistema-ventas/src/data/products.js`

En cada producto agrega la propiedad `stock` (número). Ejemplo:

```js
export const products = [
  {
    id: 1,
    name: "Laptop HP Pavilion",
    category: "Laptops",
    price: 4999990,
    stock: 5,
    image: "https://...",
    description: "...",
  },
];
```

### 1.2 Pasar `stock` desde la lista a la tarjeta

Archivo: `frontend-sistema-ventas/src/pages/ProductList.jsx`

Dentro del `.map()`, agrega la prop `stock`:

```jsx
<ProductCard
  key={product.id}
  name={product.name}
  category={product.category}
  price={product.price}
  stock={product.stock}
  image={product.image}
  description={product.description}
/>
```

### 1.3 Mostrar `stock` en la tarjeta

Archivo: `frontend-sistema-ventas/src/components/ProductCard.jsx`

1. Asegúrate de recibir `stock`:

```jsx
function ProductCard({ name, category, price, stock, image, description }) {
  // ...
}
```

2. Agrega el texto en el JSX:

```jsx
<p className={styles.productStock}>Stock: {stock}</p>
```

### 1.4 Estilo del stock

Archivo: `frontend-sistema-ventas/src/styles/ProductCard.module.css`

Agrega una clase (si no existe):

```css
.productStock {
  font-size: 0.875rem;
  font-weight: 700;
  color: #374151;
}
```

### 📝 Commit (Paso 1)

```bash
git add frontend-sistema-ventas/src/data/products.js frontend-sistema-ventas/src/pages/ProductList.jsx frontend-sistema-ventas/src/components/ProductCard.jsx frontend-sistema-ventas/src/styles/ProductCard.module.css
git commit -m "feat: agregar stock a productos y mostrarlo en la UI"
```

---

## Paso 2: Preparar productos en estado (fuente de verdad)

Archivo: `frontend-sistema-ventas/src/pages/ProductList.jsx`

1. Importa `useState`:

```jsx
import { useState } from "react";
```

2. Crea el estado a partir del array `products`:

```jsx
import { products } from "../data/products";

function ProductList() {
  const [productsState, setProductsState] = useState(products);

  return (
    <div>
      {productsState.map((product) => (
        <ProductCard key={product.id} name={product.name} />
      ))}
    </div>
  );
}
```

> Idea clave: ahora `productsState` es la lista real que puede cambiar. `products` (importado) es solo el “valor inicial”.

### 📝 Commit (Paso 2)

```bash
git add frontend-sistema-ventas/src/pages/ProductList.jsx
git commit -m "feat: mover productos a estado local para CRUD"
```

---

## Paso 3: Crear `ProductForm` (formulario controlado)

### 3.1 Crear el componente `ProductForm`

Crea el archivo: `frontend-sistema-ventas/src/components/ProductForm.jsx`

Pega este código completo:

```jsx
import { useEffect, useState } from "react";

import styles from "../styles/ProductForm.module.css";

const emptyValues = {
  name: "",
  category: "",
  price: "",
  stock: "",
  image: "",
  description: "",
};

function ProductForm({ initialValues, onSubmit, onCancel, isEditing = false }) {
  const [values, setValues] = useState(emptyValues);

  // useEffect: si cambia initialValues (prop), precargamos el formulario
  useEffect(() => {
    if (initialValues) {
      setValues({
        name: initialValues.name ?? "",
        category: initialValues.category ?? "",
        price: initialValues.price ?? "",
        stock: initialValues.stock ?? "",
        image: initialValues.image ?? "",
        description: initialValues.description ?? "",
      });
    } else {
      setValues(emptyValues);
    }
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    // prev = estado anterior del formulario (NO es prop)
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

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          {isEditing ? "Editar producto" : "Agregar producto"}
        </h2>
        <p className={styles.subtitle}>
          Completa el formulario y guarda los cambios.
        </p>
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
            <button
              className={styles.btnSecondary}
              type="button"
              onClick={onCancel}
            >
              Cancelar
            </button>
          ) : null}

          <button className={styles.btnPrimary} type="submit">
            {isEditing ? "Guardar cambios" : "Agregar producto"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default ProductForm;
```

### 3.2 Estilos del formulario

Crea el archivo: `frontend-sistema-ventas/src/styles/ProductForm.module.css`

Pega este código:

```css
.container {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.header {
  margin-bottom: 0.75rem;
}

.title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--gray-900);
}

.subtitle {
  margin: 0.25rem 0 0;
  color: var(--gray-500);
  font-weight: 600;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.label {
  font-weight: 800;
  color: var(--gray-900);
  font-size: 0.875rem;
}

.input,
.textarea {
  width: 100%;
  border: 1px solid var(--gray-200);
  border-radius: 10px;
  padding: 0.6rem 0.75rem;
  font-size: 0.95rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.btnPrimary {
  border: none;
  border-radius: 10px;
  padding: 0.6rem 0.9rem;
  cursor: pointer;
  font-weight: 900;
  background: var(--primary);
  color: white;
}

.btnPrimary:hover {
  background: var(--primary-dark);
}

.btnSecondary {
  border: 1px solid var(--gray-200);
  border-radius: 10px;
  padding: 0.6rem 0.9rem;
  cursor: pointer;
  font-weight: 900;
  background: white;
  color: var(--gray-900);
}

.btnSecondary:hover {
  background: var(--gray-100);
}

@media (max-width: 768px) {
  .row {
    grid-template-columns: 1fr;
  }
}
```

### 3.3 Renderiza el formulario arriba de la grilla (temporal)

Archivo: `frontend-sistema-ventas/src/pages/ProductList.jsx`

1. Importa `ProductForm`:

```jsx
import ProductForm from "../components/ProductForm";
```

2. Crea un handler temporal (para que compile). En el Paso 4 lo convertimos en “agregar de verdad”:

```jsx
const handleAddProduct = (product) => {
  console.log("Producto recibido desde el form:", product);
};
```

3. Renderiza el form arriba de la grilla:

```jsx
<ProductForm onSubmit={handleAddProduct} />
```

> En este paso, el objetivo es aprender formulario controlado. Todavía no agregamos a la lista.

### 📝 Commit (Paso 3)

```bash
git add frontend-sistema-ventas/src/components/ProductForm.jsx frontend-sistema-ventas/src/styles/ProductForm.module.css frontend-sistema-ventas/src/pages/ProductList.jsx
git commit -m "feat: agregar ProductForm con inputs controlados"
```

---

## Paso 4: Agregar productos (inmutabilidad)

Archivo: `frontend-sistema-ventas/src/pages/ProductList.jsx`

Reemplaza el `handleAddProduct` temporal por este:

```jsx
const handleAddProduct = (product) => {
  setProductsState((prev) => {
    const maxId = prev.reduce((acc, item) => Math.max(acc, item.id), 0);
    const nextId = maxId + 1;

    return [...prev, { ...product, id: nextId }];
  });
};
```

Puntos clave:

- NO hacemos `push`.
- Retornamos un array nuevo: `return [...prev, newItem]`.
- `prev` es el estado anterior real.

### 📝 Commit (Paso 4)

```bash
git add frontend-sistema-ventas/src/pages/ProductList.jsx
git commit -m "feat: agregar producto al estado de productos"
```

---

## Paso 5: Eliminar productos

### 5.1 Agregar handler de eliminar en `ProductList`

Archivo: `frontend-sistema-ventas/src/pages/ProductList.jsx`

Agrega:

```jsx
const handleDeleteProduct = (id) => {
  setProductsState((prev) => prev.filter((product) => product.id !== id));
};
```

### 5.2 Pasar `onDelete` a `ProductCard`

Dentro del `.map()` agrega:

```jsx
<ProductCard
  key={product.id}
  name={product.name}
  category={product.category}
  price={product.price}
  stock={product.stock}
  image={product.image}
  description={product.description}
  onDelete={() => handleDeleteProduct(product.id)}
/>
```

**¿Por qué `() => ...`?**

- Porque el botón debe ejecutar la función **cuando el usuario haga clic**.
- Además, así “capturamos” el `id` del producto.

### 5.3 Botón “Eliminar” en `ProductCard`

Archivo: `frontend-sistema-ventas/src/components/ProductCard.jsx`

1. Recibe `onDelete`:

```jsx
function ProductCard({
  name,
  category,
  price,
  stock,
  image,
  description,
  onDelete,
}) {
  // ...
}
```

2. Agrega el botón:

```jsx
{
  onDelete ? (
    <div className={styles.cardActions}>
      <button type="button" className={styles.btnDelete} onClick={onDelete}>
        Eliminar
      </button>
    </div>
  ) : null;
}
```

> Lo hacemos opcional: si el padre no manda `onDelete`, el botón no aparece.

### 5.4 Estilo del botón

Archivo: `frontend-sistema-ventas/src/styles/ProductCard.module.css`

Agrega (si no existe):

```css
.cardActions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.btnDelete {
  background: var(--danger);
  color: white;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 800;
  cursor: pointer;
}
```

### 📝 Commit (Paso 5)

```bash
git add frontend-sistema-ventas/src/pages/ProductList.jsx frontend-sistema-ventas/src/components/ProductCard.jsx frontend-sistema-ventas/src/styles/ProductCard.module.css
git commit -m "feat: eliminar productos desde la tarjeta"
```

---

## Paso 6: Editar productos (modo edición)

Editar tiene 3 partes:

1. Saber qué producto se edita (`editingProduct`)
2. Precargar el formulario (`initialValues`)
3. Guardar reemplazando en el array (`map`)

### 6.1 Estado de edición y handlers

Archivo: `frontend-sistema-ventas/src/pages/ProductList.jsx`

1. Agrega estado:

```jsx
const [editingProduct, setEditingProduct] = useState(null);
```

2. Agrega handlers:

```jsx
const handleEditStart = (product) => {
  setEditingProduct(product);
};

const handleEditCancel = () => {
  setEditingProduct(null);
};

const handleEditSubmit = (updatedProduct) => {
  setProductsState((prev) =>
    prev.map((product) =>
      product.id === updatedProduct.id ? updatedProduct : product,
    ),
  );

  setEditingProduct(null);
};
```

### 6.2 Abrir el formulario en modo edición

En el render, cambia el `ProductForm` para que reciba `initialValues` y `isEditing`.

Ejemplo:

```jsx
<ProductForm
  initialValues={editingProduct}
  isEditing={Boolean(editingProduct)}
  onCancel={handleEditCancel}
  onSubmit={editingProduct ? handleEditSubmit : handleAddProduct}
/>
```

### 6.3 Botón “Editar” en `ProductCard`

Archivo: `frontend-sistema-ventas/src/components/ProductCard.jsx`

1. Recibe `onEdit`:

```jsx
function ProductCard({
  name,
  category,
  price,
  stock,
  image,
  description,
  onEdit,
  onDelete,
}) {
  // ...
}
```

2. En `ProductList.jsx`, pásalo así:

```jsx
onEdit={() => handleEditStart(product)}
```

3. Renderiza el botón en `ProductCard` (opcional):

```jsx
{
  onEdit || onDelete ? (
    <div className={styles.cardActions}>
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
  ) : null;
}
```

### 6.4 Estilo del botón Editar

Archivo: `frontend-sistema-ventas/src/styles/ProductCard.module.css`

Agrega (si no existe):

```css
.btnEdit {
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 800;
  cursor: pointer;
}
```

### 📝 Commit (Paso 6)

```bash
git add frontend-sistema-ventas/src/pages/ProductList.jsx frontend-sistema-ventas/src/components/ProductForm.jsx frontend-sistema-ventas/src/components/ProductCard.jsx
git commit -m "feat: editar productos con modo edición"
```

---

## Paso 8: Mejora UX (formulario bajo demanda)

En este punto el formulario siempre está visible. Ahora lo abrimos solo cuando el usuario quiera.

### 8.1 Estado para abrir/cerrar

Archivo: `frontend-sistema-ventas/src/pages/ProductList.jsx`

Agrega:

```jsx
const [isFormOpen, setIsFormOpen] = useState(false);
```

Y estos handlers:

```jsx
const handleOpenCreate = () => {
  setEditingProduct(null);
  setIsFormOpen(true);
};

const handleCloseForm = () => {
  setEditingProduct(null);
  setIsFormOpen(false);
};
```

Cambia `handleEditStart` para que también abra el formulario:

```jsx
const handleEditStart = (product) => {
  setEditingProduct(product);
  setIsFormOpen(true);
};
```

### 8.2 Cerrar el formulario al guardar

En `handleAddProduct` y `handleEditSubmit` llama `handleCloseForm()` al final:

```jsx
handleCloseForm();
```

### 8.3 Render condicional (form vs grilla)

Reemplaza la zona de render por esta idea:

```jsx
{
  isFormOpen ? (
    <ProductForm
      initialValues={editingProduct}
      isEditing={Boolean(editingProduct)}
      onCancel={handleCloseForm}
      onSubmit={editingProduct ? handleEditSubmit : handleAddProduct}
    />
  ) : (
    <>
      <div className={styles.toolbar}>
        <button
          className={styles.btnAdd}
          type="button"
          onClick={handleOpenCreate}
        >
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
  );
}
```

### 8.4 Asegura el botón Cancelar en `ProductForm`

En `ProductForm.jsx` ya dejamos esto:

- `onCancel` es opcional
- si existe, se renderiza el botón `Cancelar`

### 8.5 Estilos del toolbar

Archivo: `frontend-sistema-ventas/src/styles/ProductList.module.css`

Agrega estilos mínimos (si no existen):

```css
.toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
}

.btnAdd {
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 0.75rem;
  padding: 0.85rem 1.25rem;
  font-weight: 700;
  cursor: pointer;
}
```

### 📝 Commits granulares (Paso 8)

```bash
git add frontend-sistema-ventas/src/pages/ProductList.jsx frontend-sistema-ventas/src/components/ProductForm.jsx
git commit -m "feat: abrir formulario bajo demanda y habilitar cancelar"
```

```bash
git add frontend-sistema-ventas/src/pages/ProductList.jsx
git commit -m "feat: volver a la grilla al guardar o cancelar"
```

```bash
git add frontend-sistema-ventas/src/styles/ProductList.module.css
git commit -m "style: agregar toolbar y botón de agregar producto"
```

---

## Paso 7: Verificación final

En `frontend-sistema-ventas/`:

```bash
npm run dev
npm run lint
npm run build
```

Checklist:

- Se ve `Stock: X` en todas las tarjetas.
- Agregar un producto lo muestra en la grilla.
- Eliminar quita el producto correcto.
- Editar precarga el formulario y actualiza el producto correcto.
- En UX final: se ve primero la grilla + botón **Agregar producto**; el formulario aparece solo al crear/editar; y vuelve a la grilla al guardar/cancelar.
