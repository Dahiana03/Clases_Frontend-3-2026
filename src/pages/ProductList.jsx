import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import styles from './ProductList.module.css';

function ProductList() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Productos Informaticos</h1>
                <p className={styles.subtitle}>Descubre nuestra selección de productos informáticos de calidad</p>
            </header>

            <div className={styles.grid}>
                {products.map(product => (
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