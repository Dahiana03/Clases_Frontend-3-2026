import { useMemo, useState } from 'react';

import styles from '../styles/Checkout.module.css';
import {
  calculateOrderTotals,
  PAYMENT_METHODS,
  SHIPPING_OPTIONS,
} from '../utils/calculateOrderTotals';
import { formatCOP } from '../utils/formatCOP';

const EMAIL_REGEX = /^[^@]+@[^@]+\.[^@]+$/;

function Checkout({ cartItems, user, onBack, onCompleteCheckout, onSuccess }) {
  const [values, setValues] = useState({
    fullName: user?.name ?? '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    shippingMethod: SHIPPING_OPTIONS[0].id,
    paymentMethod: PAYMENT_METHODS[0].id,
  });

  const [errors, setErrors] = useState({});

  const totals = useMemo(
    () => calculateOrderTotals(cartItems, values.shippingMethod),
    [cartItems, values.shippingMethod]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const validateValues = () => {
    const nextErrors = {};

    if (!values.fullName.trim()) nextErrors.fullName = 'Ingresa el nombre completo.';
    if (!values.email.trim()) nextErrors.email = 'Ingresa un correo electrónico.';
    if (values.email.trim() && !EMAIL_REGEX.test(values.email.trim())) {
      nextErrors.email = 'Correo inválido.';
    }
    if (!values.phone.trim()) nextErrors.phone = 'Ingresa un número de contacto.';
    if (!values.address.trim()) nextErrors.address = 'Ingresa la dirección.';
    if (!values.city.trim()) nextErrors.city = 'Ingresa la ciudad.';
    if (!values.postalCode.trim()) nextErrors.postalCode = 'Ingresa el código postal.';

    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateValues();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    const order = onCompleteCheckout({
      customer: {
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        address: values.address.trim(),
        city: values.city.trim(),
        postalCode: values.postalCode.trim(),
      },
      shippingMethodId: values.shippingMethod,
      paymentMethodId: values.paymentMethod,
    });

    // 🚀 navegación controlada desde afuera
    if (order && onSuccess) {
      onSuccess(order);
    }
  };

  if (cartItems.length === 0) {
    return (
      <section className={styles.container}>
        <div className={styles.emptyState}>
          <h1 className={styles.title}>Checkout</h1>
          <p className={styles.emptyText}>
            No hay productos en el carrito.
          </p>
          <button className={styles.secondaryButton} onClick={onBack}>
            Volver al carrito
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Checkout</h1>
          <p className={styles.subtitle}>
            Completa los datos para finalizar tu compra.
          </p>
        </div>

        <button className={styles.secondaryButton} onClick={onBack}>
          Volver al carrito
        </button>
      </header>

      <div className={styles.layout}>
        <form className={styles.formCard} onSubmit={handleSubmit}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Datos del cliente</h2>

            <div className={styles.fieldGrid}>
              <input
                className={styles.input}
                name="fullName"
                value={values.fullName}
                onChange={handleChange}
                placeholder="Nombre completo"
              />
              {errors.fullName && <span className={styles.error}>{errors.fullName}</span>}

              <input
                className={styles.input}
                name="email"
                value={values.email}
                onChange={handleChange}
                placeholder="Correo"
                type="email"
              />
              {errors.email && <span className={styles.error}>{errors.email}</span>}

              <input
                className={styles.input}
                name="phone"
                value={values.phone}
                onChange={handleChange}
                placeholder="Teléfono"
              />
              {errors.phone && <span className={styles.error}>{errors.phone}</span>}
            </div>
          </section>

          <div className={styles.actions}>
            <button type="button" onClick={onBack}>
              Volver
            </button>
            <button type="submit" className={styles.primaryButton}>
              Confirmar compra
            </button>
          </div>
        </form>

        <aside className={styles.summaryCard}>
          {cartItems.map((item) => (
            <div key={item.id}>
              <img src={item.image} alt={`Imagen de ${item.name}`} />
              <p>{item.name}</p>
              <p>{formatCOP(item.price * item.quantity)}</p>
            </div>
          ))}

          <h3>Total: {formatCOP(totals.total)}</h3>
        </aside>
      </div>
    </section>
  );
}

export default Checkout;