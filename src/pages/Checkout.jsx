import { useEffect, useMemo, useState } from 'react';

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
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    address: user?.address ?? '',
    city: user?.city ?? '',
    postalCode: user?.postalCode ?? '',
    shippingMethod: SHIPPING_OPTIONS[0].id,
    paymentMethod: PAYMENT_METHODS[0].id,
  });

  const [errors, setErrors] = useState({});

  // 🔥 sincroniza datos del usuario
  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      fullName: user?.name ?? prev.fullName,
      email: user?.email ?? prev.email,
      phone: user?.phone ?? prev.phone,
      address: user?.address ?? prev.address,
      city: user?.city ?? prev.city,
      postalCode: user?.postalCode ?? prev.postalCode,
    }));
  }, [user]);

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
    if (!values.shippingMethod) nextErrors.shippingMethod = 'Selecciona un método de envío.';
    if (!values.paymentMethod) nextErrors.paymentMethod = 'Selecciona un método de pago.';

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

    // 🔥 navegación controlada desde App
    if (order) {
      onSuccess?.(order);
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
          
          {/* 👤 CLIENTE */}
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

              <input
                className={styles.input}
                name="address"
                value={values.address}
                onChange={handleChange}
                placeholder="Dirección"
              />
              {errors.address && <span className={styles.error}>{errors.address}</span>}

              <input
                className={styles.input}
                name="city"
                value={values.city}
                onChange={handleChange}
                placeholder="Ciudad"
              />
              {errors.city && <span className={styles.error}>{errors.city}</span>}

              <input
                className={styles.input}
                name="postalCode"
                value={values.postalCode}
                onChange={handleChange}
                placeholder="Código postal"
              />
              {errors.postalCode && <span className={styles.error}>{errors.postalCode}</span>}
            </div>
          </section>

          {/* 🚚 ENVÍO */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Método de envío</h2>
            {SHIPPING_OPTIONS.map((opt) => (
              <label key={opt.id}>
                <input
                  type="radio"
                  name="shippingMethod"
                  value={opt.id}
                  checked={values.shippingMethod === opt.id}
                  onChange={handleChange}
                />
                {opt.label} - {formatCOP(opt.price)}
              </label>
            ))}
            {errors.shippingMethod && <span className={styles.error}>{errors.shippingMethod}</span>}
          </section>

          {/* 💳 PAGO */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Método de pago</h2>
            {PAYMENT_METHODS.map((opt) => (
              <label key={opt.id}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value={opt.id}
                  checked={values.paymentMethod === opt.id}
                  onChange={handleChange}
                />
                {opt.label}
              </label>
            ))}
            {errors.paymentMethod && <span className={styles.error}>{errors.paymentMethod}</span>}
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

        {/* 🧾 RESUMEN */}
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