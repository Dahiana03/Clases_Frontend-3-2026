# Clase 02 - Lista de Productos Informáticos con React

## 📋 Tabla de Contenidos

1. [¿Qué es React?](#1-qué-es-react)
2. [Estructura de Carpetas por Features](#2-estructura-de-carpetas-por-features)
3. [Ejercicio Práctico Guiado](#3-ejercicio-práctico-guiado)
   - [Paso 1: Crear estructura de carpetas](#paso-1-crear-estructura-de-carpetas)
   - [Paso 2: Crear datos de productos](#paso-2-crear-datos-de-productos)
   - [Paso 3: Componente ProductCard (Props)](#paso-3-componente-productcard-props)
   - [Paso 4: Estilos de ProductCard (CSS Modules)](#paso-4-estilos-de-productcard-css-modules)
   - [Paso 5: Componente ProductList (map)](#paso-5-componente-productlist-map)
   - [Paso 6: Estilos de ProductList](#paso-6-estilos-de-productlist)
   - [Paso 7: Eventos y Estado (useState)](#paso-7-eventos-y-estado-usestate)
   - [Paso 8: Integración en App.jsx](#paso-8-integración-en-appjsx)
   - [Paso 9: Ajustes finales y estilos globales](#paso-9-ajustes-finales-y-estilos-globales)
   - [Paso 10: Verificación y ejecución](#paso-10-verificación-y-ejecución)
4. [Resumen Final](#4-resumen-final)

---

## 1. ¿Qué es React?

### Definición

**React** es una biblioteca de JavaScript de código abierto creada por Facebook (Meta) para construir interfaces de usuario (UI) de manera **declarativa** y **basada en componentes**.

### Conceptos Clave

#### 🧩 Componentes

React divide la interfaz en piezas reutilizables llamadas **componentes**. Cada componente es una función o clase que retorna elementos de React (JSX).

```jsx
function Saludo() {
  return <h1>¡Hola, estudiante!</h1>;
}
```

#### 📱 Programación Declarativa

En lugar de manipular el DOM directamente (imperativo), le dices a React **qué** quieres mostrar, y React se encarga del **cómo** actualizar el DOM.

**Ejemplo comparativo:**

```javascript
// Vanilla JS (Imperativo)
const button = document.getElementById('btn');
button.addEventListener('click', () => {
  const counter = document.getElementById('counter');
  counter.textContent = parseInt(counter.textContent) + 1;
});

// React (Declarativo)
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### ¿Cómo funciona React?

#### Virtual DOM

React mantiene una representación en memoria del DOM real llamada **Virtual DOM**. Cuando el estado de un componente cambia:

1. React crea un nuevo Virtual DOM
2. Compara el nuevo Virtual DOM con el anterior (proceso llamado **reconciliación**)
3. Calcula los cambios mínimos necesarios
4. Actualiza solo las partes del DOM real que cambiaron

**Beneficio:** Esto hace que las actualizaciones sean mucho más rápidas y eficientes.

#### Reactividad

React re-renderiza automáticamente los componentes cuando su **estado** o **props** cambian. No necesitas decirle explícitamente que actualice la UI.

### ¿Por qué usar Vite con React?

**Vite** es una herramienta de desarrollo moderna que ofrece:

#### ⚡ Hot Module Replacement (HMR) ultrarrápido

Cuando guardas cambios en tu código, Vite actualiza solo el módulo modificado sin recargar toda la página. Esto preserva el estado de tu aplicación.

#### 🚀 Inicio instantáneo

Vite no necesita empaquetar todo tu código para empezar. Usa módulos ES nativos del navegador en desarrollo.

#### 📦 Build optimizado

En producción, Vite usa Rollup para crear bundles optimizados y pequeños.

#### 🔧 Configuración mínima

Funciona "out of the box" sin necesidad de configuraciones complejas.

**Comparación con Create React App:**

- Vite: Inicio en < 1 segundo
- Create React App: Puede tomar 10-30 segundos

---

## 2. Estructura de Carpetas por Features

### ¿Qué es organización por features?

Es una forma de estructurar tu proyecto agrupando archivos por **funcionalidad** o **característica** en lugar de por tipo técnico.

### Estructura propuesta para este proyecto

```
sistema-ventas/
├── src/
│   ├── pages/              # Vistas principales (páginas completas)
│   │   └── ProductList.jsx
│   │   └── ProductList.module.css
│   ├── components/         # Componentes reutilizables
│   │   └── ProductCard.jsx
│   │   └── ProductCard.module.css
│   ├── data/              # Datos estáticos de la aplicación
│   │   └── products.js
│   ├── App.jsx            # Componente raíz
│   ├── App.css
│   ├── main.jsx           # Punto de entrada
│   └── index.css          # Estilos globales
├── public/                # Archivos estáticos
├── index.html
├── package.json
└── vite.config.js
```

### Explicación de cada carpeta

| Carpeta           | Propósito                                                             | Ejemplo                                           |
| ----------------- | --------------------------------------------------------------------- | ------------------------------------------------- |
| **`pages/`**      | Componentes que representan páginas completas o vistas principales    | `ProductList.jsx`, `HomePage.jsx`, `CartPage.jsx` |
| **`components/`** | Componentes pequeños y reutilizables que se usan en múltiples lugares | `ProductCard.jsx`, `Button.jsx`, `Header.jsx`     |
| **`data/`**       | Datos estáticos, constantes, mocks para desarrollo                    | `products.js`, `categories.js`                    |

### ¿Por qué esta organización?

✅ **Escalable:** Fácil agregar nuevas features sin afectar las existentes  
✅ **Mantenible:** Encuentras rápidamente dónde está cada cosa  
✅ **Reutilizable:** Los componentes están separados por responsabilidad  
✅ **Claro:** Cualquier desarrollador entiende la estructura al instante

---

## 3. Ejercicio Práctico Guiado

### 🎯 Objetivo

Crear una aplicación que muestre una lista de productos informáticos con información de cada producto y funcionalidad de "me gusta".

### 📚 Conceptos que aprenderás

- Crear y organizar componentes
- Usar props para pasar datos
- Renderizar listas con `.map()`
- Manejar eventos con `onClick`
- Usar el hook `useState` para estado
- Aplicar estilos con CSS Modules
- Hacer commits organizados con Git

---

### Paso 1: Crear estructura de carpetas

#### 🎯 Concepto

Antes de escribir código, es importante organizar nuestro proyecto. Crearemos las carpetas donde irán nuestros componentes, páginas y datos.

#### 💻 Implementación

Abre la terminal en la raíz de tu proyecto y ejecuta:

```bash
mkdir src/pages src/components src/data
```

Verifica que se crearon correctamente:

```bash
ls -la src/
```

Deberías ver las carpetas: `pages/`, `components/`, `data/`, además de los archivos existentes.

#### 📝 Commit

```bash
git add .
git commit -m "feat: crear estructura de carpetas pages, components y data"
```

> **💡 Tip:** El prefijo `feat:` indica que estamos agregando una nueva funcionalidad. Otros prefijos comunes: `fix:`, `style:`, `docs:`, `refactor:`.

---

### Paso 2: Crear datos de productos

#### 🎯 Concepto

**Arrays y objetos en JavaScript:** Almacenaremos nuestros productos en un array (lista) donde cada producto es un objeto con propiedades como nombre, precio, categoría, etc.

En React, separar los datos de los componentes es una buena práctica porque:

- Facilita modificar los datos sin tocar la UI
- Permite simular datos antes de conectar con una API real
- Hace el código más limpio y mantenible

#### 💻 Implementación

Crea el archivo `src/data/products.js` con el siguiente contenido:

```javascript
export const products = [
  {
    id: 1,
    name: 'Laptop HP Pavilion',
    category: 'Laptops',
    price: 2499.99,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    description: 'Laptop potente con procesador Intel Core i7, 16GB RAM y 512GB SSD',
  },
  {
    id: 2,
    name: 'Mouse Logitech MX Master 3',
    category: 'Accesorios',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400',
    description: 'Mouse ergonómico inalámbrico con alta precisión y batería de larga duración',
  },
  {
    id: 3,
    name: 'Teclado Mecánico Keychron K2',
    category: 'Accesorios',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400',
    description: 'Teclado mecánico compacto con switches Blue y retroiluminación RGB',
  },
  {
    id: 4,
    name: 'Monitor LG UltraWide 34"',
    category: 'Monitores',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
    description:
      'Monitor curvo ultra ancho de 34 pulgadas, resolución 3440x1440, ideal para productividad',
  },
  {
    id: 5,
    name: 'Audífonos Sony WH-1000XM5',
    category: 'Audio',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400',
    description: 'Audífonos premium con cancelación de ruido activa y sonido Hi-Res',
  },
  {
    id: 6,
    name: 'Webcam Logitech C920',
    category: 'Accesorios',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1589588227157-56ce53ea3920?w=400',
    description: 'Webcam Full HD 1080p ideal para videollamadas y streaming',
  },
];
```

#### 📖 Explicación del código

- `export const products`: Exportamos la variable para poder importarla en otros archivos
- Cada objeto tiene propiedades consistentes: `id`, `name`, `category`, `price`, `image`, `description`
- `id`: Identificador único (importante para React al renderizar listas)
- Las imágenes vienen de Unsplash (servicio gratuito de imágenes)

#### 📝 Commit

```bash
git add src/data/products.js
git commit -m "feat: agregar datos de productos informáticos"
```

---

### Paso 3: Componente ProductCard (Props)

#### 🎯 Concepto

**Props (properties):** Son argumentos que pasas a un componente de React, similar a los parámetros de una función. Permiten que los componentes sean reutilizables y dinámicos.

**Flujo de datos:** Los props fluyen de **padre a hijo** (unidireccional). El componente padre pasa información al hijo, pero no al revés.

**Desestructuración:** En lugar de usar `props.name`, `props.price`, etc., podemos desestructurar directamente en los parámetros de la función.

```jsx
// Sin desestructurar
function ProductCard(props) {
  return <h2>{props.name}</h2>;
}

// Con desestructuración (mejor práctica)
function ProductCard({ name, price, image }) {
  return <h2>{name}</h2>;
}
```

#### 💻 Implementación

Crea el archivo `src/components/ProductCard.jsx`:

```jsx
function ProductCard({ name, category, price, image, description }) {
  return (
    <article className="product-card">
      <img src={image} alt={name} className="product-image" />
      <div className="product-info">
        <span className="product-category">{category}</span>
        <h3 className="product-name">{name}</h3>
        <p className="product-description">{description}</p>
        <div className="product-footer">
          <span className="product-price">${price.toFixed(2)}</span>
          <button className="btn-like">❤️ Me gusta</button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
```

#### 📖 Explicación del código

- **Props desestructuradas:** `{ name, category, price, image, description }` - recibimos estas propiedades
- **JSX:** Mezcla JavaScript con HTML. Las expresiones JS van entre llaves `{}`
- **`className`:** En JSX usamos `className` en lugar de `class` (porque `class` es palabra reservada en JS)
- **`price.toFixed(2)`:** Formatea el precio con 2 decimales (ej: 99.99)
- **`alt={name}`:** Importante para accesibilidad (describe la imagen)
- **`export default`:** Permite importar este componente en otros archivos

> **💡 Nota:** Por ahora el botón no hace nada. Agregaremos funcionalidad en pasos posteriores.

#### 📝 Commit

```bash
git add src/components/ProductCard.jsx
git commit -m "feat: crear componente ProductCard con props"
```

---

### Paso 4: Estilos de ProductCard (CSS Modules)

#### 🎯 Concepto

**CSS Modules:** Es una forma de escribir CSS donde las clases tienen alcance local (scoped) al componente. Evita colisiones de nombres de clases entre diferentes componentes.

**Características:**

- Archivo con extensión `.module.css`
- Las clases se importan como objeto JavaScript
- React genera nombres únicos automáticamente en producción

**Ejemplo:**

```jsx
import styles from './ProductCard.module.css';
// styles.productCard será algo como: "ProductCard_productCard__a8b3c"
<div className={styles.productCard}>...</div>;
```

**Beneficios:**

- ✅ No hay conflictos entre estilos de diferentes componentes
- ✅ Fácil de eliminar: si borras el componente, borras sus estilos
- ✅ Autocomplete en el IDE

#### 💻 Implementación

Crea el archivo `src/components/ProductCard.module.css`:

```css
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
```

Ahora actualiza `src/components/ProductCard.jsx` para importar y usar estos estilos:

```jsx
import styles from './ProductCard.module.css';

function ProductCard({ name, category, price, image, description }) {
  return (
    <article className={styles.productCard}>
      <img src={image} alt={name} className={styles.productImage} />
      <div className={styles.productInfo}>
        <span className={styles.productCategory}>{category}</span>
        <h3 className={styles.productName}>{name}</h3>
        <p className={styles.productDescription}>{description}</p>
        <div className={styles.productFooter}>
          <span className={styles.productPrice}>${price.toFixed(2)}</span>
          <button className={styles.btnLike}>❤️ Me gusta</button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
```

#### 📖 Explicación del código CSS

- **`.productCard`:** Contenedor principal con sombra y bordes redondeados
- **`:hover`:** Efecto de elevación al pasar el mouse
- **`object-fit: cover`:** La imagen cubre todo el espacio sin deformarse
- **`flex-direction: column`:** Apila elementos verticalmente
- **`gap`:** Espaciado automático entre elementos flex
- **Variables de color:** Usamos colores de Tailwind CSS como referencia
- **Transiciones:** Animaciones suaves en hover y click

#### 📝 Commit

```bash
git add .
git commit -m "style: agregar estilos a ProductCard con CSS Modules"
```

---

### Paso 5: Componente ProductList (map)

#### 🎯 Concepto

**Renderizado de listas con `.map()`:** En React, para mostrar múltiples elementos a partir de un array, usamos el método `.map()` de JavaScript.

**Sintaxis:**

```jsx
{
  array.map((elemento) => <Componente key={elemento.id} data={elemento} />);
}
```

**La prop `key`:** React necesita identificar cada elemento de forma única para optimizar las actualizaciones. SIEMPRE usa un `id` único, nunca el índice del array.

```jsx
// ❌ MAL - usar el índice
{
  products.map((product, index) => <Card key={index} />);
}

// ✅ BIEN - usar id único
{
  products.map((product) => <Card key={product.id} />);
}
```

**¿Por qué es importante?**

- React usa las keys para detectar qué elementos cambiaron
- Sin keys correctas, puede haber bugs al agregar/eliminar elementos
- Con keys correctas, React actualiza solo lo necesario

#### 💻 Implementación

Crea el archivo `src/pages/ProductList.jsx`:

```jsx
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import styles from './ProductList.module.css';

function ProductList() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Productos Informáticos</h1>
        <p className={styles.subtitle}>
          Encuentra los mejores productos de tecnología para tu setup
        </p>
      </header>

      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            category={product.category}
            price={product.price}
            image={product.image}
            description={product.description}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductList;
```

#### 📖 Explicación del código

- **Importación de datos:** `import { products } from '../data/products'` - traemos el array de productos
- **Importación de componente:** `import ProductCard from '../components/ProductCard'` - sin llaves porque es export default
- **`.map()`:** Iteramos sobre cada producto del array
- **Props spreading:** Pasamos cada propiedad del producto al ProductCard
- **`key={product.id}`:** Identificador único requerido por React
- **`../`:** Subimos un nivel en la estructura de carpetas para acceder a otras carpetas

> **💡 Alternativa con spread operator:** En lugar de pasar cada prop individualmente, podrías usar `<ProductCard key={product.id} {...product} />`, pero ser explícito es más claro para principiantes.

#### 📝 Commit

```bash
git add src/pages/ProductList.jsx
git commit -m "feat: crear página ProductList con renderizado de lista usando map"
```

---

### Paso 6: Estilos de ProductList

#### 🎯 Concepto

**Layout con CSS Grid:** Usaremos CSS Grid para crear una cuadrícula responsive que se adapte automáticamente al tamaño de la pantalla.

**`grid-template-columns`:**

- `repeat(auto-fill, minmax(300px, 1fr))`: Crea columnas automáticamente
- `auto-fill`: Crea tantas columnas como quepan
- `minmax(300px, 1fr)`: Cada columna mínimo 300px, máximo 1 fracción del espacio disponible

#### 💻 Implementación

Crea el archivo `src/pages/ProductList.module.css`:

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .title {
    font-size: 2rem;
  }

  .grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
```

#### 📖 Explicación del código

- **`.container`:** Limita el ancho máximo y centra el contenido
- **`.header`:** Centrado de texto con espaciado inferior
- **`.grid`:** Sistema de cuadrícula responsive
- **`gap: 2rem`:** Espaciado entre tarjetas (32px)
- **Media query:** En pantallas menores a 768px, muestra 1 columna
- **`max-width: 1200px`:** Evita que el contenido sea demasiado ancho en pantallas grandes

#### 📝 Commit

```bash
git add src/pages/ProductList.module.css
git commit -m "style: agregar estilos responsive a ProductList con CSS Grid"
```

---

### Paso 7: Eventos y Estado (useState)

#### 🎯 Concepto

**Eventos en React:** Similar a HTML, pero con sintaxis camelCase (`onClick`, `onChange`, `onSubmit`).

```jsx
// HTML
<button onclick="handleClick()">Click</button>

// React
<button onClick={handleClick}>Click</button>
```

**Hook `useState`:** Permite agregar estado a componentes funcionales. El estado es información que puede cambiar con el tiempo y causa re-renderizado cuando cambia.

**Sintaxis:**

```jsx
const [valor, setValor] = useState(valorInicial);
```

- `valor`: Variable que contiene el estado actual
- `setValor`: Función para actualizar el estado
- `valorInicial`: Valor con el que inicia el estado

**Patrón de actualización:**

```jsx
// ❌ MAL - No modificar directamente
likes = likes + 1;

// ✅ BIEN - Usar la función setter
setLikes(likes + 1);
```

#### 💻 Implementación

Actualiza `src/components/ProductCard.jsx` para agregar funcionalidad de "me gusta":

```jsx
import { useState } from 'react';
import styles from './ProductCard.module.css';

function ProductCard({ name, category, price, image, description }) {
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
        <p className={styles.productDescription}>{description}</p>
        <div className={styles.productFooter}>
          <span className={styles.productPrice}>${price.toFixed(2)}</span>
          <button
            className={`${styles.btnLike} ${isLiked ? styles.liked : ''}`}
            onClick={handleLike}
          >
            {isLiked ? '❤️' : '🤍'} {likes} Me gusta
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
```

Actualiza también el CSS en `src/components/ProductCard.module.css` para agregar estilos al estado "liked":

```css
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
  transition: all 0.2s ease;
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
```

#### 📖 Explicación del código

**JavaScript:**

- **`import { useState }`:** Importamos el hook desde React
- **`const [likes, setLikes] = useState(0)`:** Estado para contador de likes
- **`const [isLiked, setIsLiked] = useState(false)`:** Estado booleano para saber si el usuario dio like
- **`handleLike`:** Función que maneja el click, alterna entre dar y quitar like
- **Condicional:** Si ya dio like (`isLiked`), resta 1 y cambia a false; si no, suma 1 y cambia a true
- **Template literals:** `` `${styles.btnLike} ${isLiked ? styles.liked : ''}` `` - combina clases dinámicamente
- **Operador ternario:** `isLiked ? '❤️' : '🤍'` - muestra emoji según el estado

**CSS:**

- **`.liked`:** Clase adicional que se aplica cuando `isLiked` es true
- **Background rojo suave:** `#fee2e2` cuando está liked
- **Cascada de especificidad:** `.btnLike.liked` es más específico que `.btnLike`

> **💡 Nota:** El estado es local a cada ProductCard. Cada producto tiene su propio contador independiente.

#### 📝 Commit

```bash
git add .
git commit -m "feat: agregar funcionalidad de likes con useState y eventos"
```

---

### Paso 8: Integración en App.jsx

#### 🎯 Concepto

**Componente raíz:** `App.jsx` es el componente principal de nuestra aplicación. Aquí importamos y renderizamos las páginas principales.

**Limpieza del template:** Vite genera código de ejemplo que debemos limpiar para empezar nuestro proyecto real.

#### 💻 Implementación

Reemplaza todo el contenido de `src/App.jsx` con:

```jsx
import ProductList from './pages/ProductList';
import './App.css';

function App() {
  return (
    <div className="app">
      <ProductList />
    </div>
  );
}

export default App;
```

Actualiza `src/App.css` para estilos básicos del contenedor principal:

```css
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

@media (max-width: 768px) {
  .app {
    padding: 1rem 0;
  }
}
```

#### 📖 Explicación del código

- **Importación selectiva:** Solo importamos lo que necesitamos
- **Estructura simple:** Un div contenedor con la página ProductList dentro
- **Background gradient:** Degradado morado elegante para el fondo
- **`min-height: 100vh`:** La app ocupa al menos toda la altura de la ventana
- **Responsive:** Reduce padding en móviles

#### 📝 Commit

```bash
git add src/App.jsx src/App.css
git commit -m "feat: integrar ProductList en App y limpiar template"
```

---

### Paso 9: Ajustes finales y estilos globales

#### 🎯 Concepto

**Estilos globales:** Son estilos que afectan toda la aplicación. Se definen en `index.css` y se aplican a elementos HTML base, variables CSS, resets, etc.

**CSS Reset:** Normaliza los estilos predeterminados del navegador para que se vean consistentes en todos los navegadores.

**Variables CSS:** Permiten reutilizar valores (colores, fuentes) en toda la aplicación.

#### 💻 Implementación

Reemplaza el contenido de `src/index.css`:

```css
/* Reset y configuración base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  font-family: 'Inter', system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  /* Variables de color */
  --primary: #6366f1;
  --primary-dark: #4f46e5;
  --success: #059669;
  --danger: #dc2626;
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-500: #6b7280;
  --gray-900: #1f2937;

  color-scheme: light;
  color: var(--gray-900);
  background-color: #ffffff;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  display: flex;
  min-width: 320px;
  min-height: 100vh;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  line-height: 1.2;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

button {
  font-family: inherit;
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: var(--gray-100);
}

::-webkit-scrollbar-thumb {
  background: var(--gray-500);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--primary);
}
```

#### 📖 Explicación del código

- **`* { box-sizing: border-box }`:** Incluye padding y border en el tamaño total del elemento
- **`:root`:** Selector para definir variables CSS globales
- **Variables CSS:** `--primary`, `--gray-500`, etc. - Se usan con `var(--primary)`
- **`font-synthesis: none`:** Mejora el renderizado de fuentes
- **`-webkit-font-smoothing`:** Hace que las fuentes se vean más suaves
- **Reset de márgenes:** Elimina espacios predeterminados
- **Scrollbar personalizado:** Barra de desplazamiento con colores del tema

> **💡 Tip:** Las variables CSS facilitan cambiar el esquema de colores de toda la app desde un solo lugar.

#### 📝 Commit

```bash
git add src/index.css
git commit -m "style: actualizar estilos globales y agregar variables CSS"
```

---

### Paso 10: Verificación y ejecución

#### 🎯 Ejecutar el proyecto

Asegúrate de estar en la raíz del proyecto y ejecuta:

```bash
npm run dev
```

Deberías ver algo como:

```
VITE v7.2.4  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

Abre tu navegador en `http://localhost:5173/`

#### ✅ Checklist de verificación

Verifica que tu aplicación tenga las siguientes características:

- [ ] Se muestran los 6 productos en una cuadrícula
- [ ] Cada tarjeta muestra: imagen, categoría, nombre, descripción y precio
- [ ] Los precios están formateados con 2 decimales (ej: $99.99)
- [ ] Al pasar el mouse sobre una tarjeta, se eleva con animación suave
- [ ] El botón "Me gusta" inicia en 0 con corazón blanco 🤍
- [ ] Al hacer click en "Me gusta", cambia a corazón rojo ❤️ y suma 1
- [ ] Al hacer click nuevamente, vuelve a corazón blanco y resta 1
- [ ] El fondo tiene un degradado morado
- [ ] En móvil (< 768px), las tarjetas se apilan en una columna
- [ ] No hay errores en la consola del navegador (F12)
- [ ] Las imágenes cargan correctamente

#### 🐛 Solución de problemas comunes

**Si no se ven las imágenes:**

- Verifica tu conexión a internet (las imágenes vienen de Unsplash)
- Abre DevTools (F12) → Network para ver si las imágenes cargan

**Si los estilos no se aplican:**

- Verifica que importaste los archivos `.module.css` correctamente
- Verifica que usaste `styles.nombreClase` en lugar de `"nombreClase"`

**Si el botón no funciona:**

- Verifica que importaste `useState` desde React
- Abre la consola para ver si hay errores

**Si ves errores de ESLint:**

- Son advertencias de calidad de código, no impiden que funcione
- Puedes ignorarlas por ahora o configurar ESLint según tus preferencias

#### 📸 Resultado esperado

Deberías ver:

- **Header:** Título "Productos Informáticos" con subtítulo
- **Grid responsive:** 3 columnas en pantalla grande, 2 en tablet, 1 en móvil
- **Tarjetas elegantes:** Con sombras, bordes redondeados y hover effect
- **Información clara:** Precio destacado en verde, categoría en azul
- **Interactividad:** Botones de like funcionales con feedback visual

---

## 4. Resumen Final

### 🎉 ¡Felicitaciones! Has completado la Clase 02

### 📚 Conceptos aprendidos

#### React Fundamentals

✅ **Componentes:** Bloques reutilizables de UI  
✅ **JSX:** Sintaxis de JavaScript + HTML  
✅ **Props:** Paso de datos de padre a hijo  
✅ **Estado (useState):** Datos dinámicos que causan re-renderizado  
✅ **Eventos:** Manejo de interacciones del usuario

#### JavaScript Moderno

✅ **Desestructuración:** `{ name, price }` en lugar de `props.name`  
✅ **Arrow functions:** `() => {}`  
✅ **Template literals:** `` `Hola ${nombre}` ``  
✅ **Array.map():** Transformar arrays en elementos JSX  
✅ **Import/Export:** Modularización de código

#### CSS y Estilos

✅ **CSS Modules:** Estilos con scope local  
✅ **CSS Grid:** Layout responsive moderno  
✅ **Flexbox:** Alineación y distribución  
✅ **Variables CSS:** Reutilización de valores  
✅ **Media queries:** Adaptación a diferentes pantallas

#### Arquitectura

✅ **Separación de responsabilidades:** pages, components, data  
✅ **Organización por features:** Escalable y mantenible  
✅ **Componentes reutilizables:** ProductCard puede usarse en múltiples lugares

#### Git

✅ **Commits frecuentes:** Pequeños y descriptivos  
✅ **Mensajes semánticos:** `feat:`, `style:`, `fix:`  
✅ **Historial claro:** Fácil de revisar y entender

### 🔍 Comandos Git útiles

Ver tu historial de commits:

```bash
git log --oneline
```

Ver cambios de un commit específico:

```bash
git show <commit-hash>
```

Ver todos los archivos modificados:

```bash
git status
```

Ver diferencias antes de commitear:

```bash
git diff
```

### 🚀 Próximos pasos sugeridos

Una vez que domines este ejercicio, podrías:

1. **Agregar más interactividad:**
   - Botón "Agregar al carrito"
   - Modal con detalles completos del producto
   - Notificaciones toast al dar like

2. **Implementar filtros:**
   - Buscar productos por nombre
   - Filtrar por categoría
   - Ordenar por precio (menor/mayor)

3. **Mejorar la UI:**
   - Skeleton loaders mientras carga
   - Animaciones con Framer Motion
   - Modo oscuro (dark mode)

4. **Estado global:**
   - Context API para compartir estado
   - Carrito de compras persistente

5. **Datos dinámicos:**
   - Conectar con una API real
   - Fetch de productos desde backend
   - Loading y error states

### 📖 Recursos adicionales

- **Documentación oficial de React:** https://react.dev
- **Documentación de Vite:** https://vitejs.dev
- **MDN Web Docs (JavaScript):** https://developer.mozilla.org
- **CSS Tricks (Grid y Flexbox):** https://css-tricks.com
- **Unsplash (Imágenes gratuitas):** https://unsplash.com

### 💬 Preguntas frecuentes

**¿Por qué usar componentes en lugar de un solo archivo?**

- Reutilización: Un componente puede usarse múltiples veces
- Mantenibilidad: Es más fácil encontrar y arreglar bugs
- Trabajo en equipo: Diferentes personas pueden trabajar en diferentes componentes

**¿Cuándo debo crear un nuevo componente?**

- Cuando un pedazo de UI se repite
- Cuando una sección es compleja y puede dividirse
- Cuando quieres reutilizar funcionalidad

**¿Por qué usar `key` en las listas?**

- React usa las keys para identificar qué elementos cambiaron
- Sin keys, React re-renderiza todo innecesariamente
- Con keys correctas, solo actualiza lo que cambió

**¿CSS Modules vs CSS normal?**

- CSS Modules: Scope local, no hay colisiones
- CSS normal: Scope global, puede haber conflictos
- Recomendación: CSS Modules para proyectos medianos/grandes

---

## 📝 Notas finales

Este ejercicio te ha dado las bases fundamentales de React. La clave para dominar React es:

1. **Practica constantemente:** Construye proyectos pequeños
2. **Lee código de otros:** Aprende de proyectos open source
3. **Experimenta:** Rompe cosas, arregla cosas, aprende en el proceso
4. **Lee la documentación:** React tiene excelente documentación oficial

**Recuerda:** Todos los desarrolladores de React empezaron exactamente donde estás tú ahora. ¡Sigue practicando! 🚀

---

¿Tienes dudas o problemas? Revisa el código paso a paso y verifica que cada commit se hizo correctamente. Usa `git log --oneline` para ver tu progreso.

**¡Éxito en tu aprendizaje de React!** 💜
