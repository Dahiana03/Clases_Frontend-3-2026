// ===============================
// 🚚 MÉTODOS DE ENVÍO
// ===============================
export const SHIPPING_OPTIONS = [
  {
    id: 'standard',
    label: 'Envío estándar',
    description: 'Entrega en 3-5 días hábiles',
    price: 10000,
  },
  {
    id: 'express',
    label: 'Envío express',
    description: 'Entrega en 24-48 horas',
    price: 20000,
  },
];

// ===============================
// 💳 MÉTODOS DE PAGO
// ===============================
export const PAYMENT_METHODS = [
  {
    id: 'cash',
    label: 'Pago contra entrega',
    description: 'Paga al recibir',
  },
  {
    id: 'card',
    label: 'Tarjeta',
    description: 'Crédito o débito',
  },
  {
    id: 'nequi',
    label: 'Nequi',
    description: 'Pago móvil',
  },
];

// ===============================
// 📊 CONFIG
// ===============================
const TAX_RATE = 0.19;

// ===============================
// 🧮 SUBTOTAL
// ===============================
export function calculateCartSubtotal(cartItems) {
  return cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
}

// ===============================
// 🔍 HELPERS (ESTO TE FALTABA)
// ===============================
export function getShippingOptionById(id) {
  return SHIPPING_OPTIONS.find((opt) => opt.id === id) || SHIPPING_OPTIONS[0];
}

export function getPaymentMethodById(id) {
  return PAYMENT_METHODS.find((method) => method.id === id) || PAYMENT_METHODS[0];
}

// ===============================
// 🧾 TOTALES
// ===============================
export function calculateOrderTotals(
  cartItems,
  shippingMethodId = SHIPPING_OPTIONS[0].id
) {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return {
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
      shippingOption: getShippingOptionById(shippingMethodId),
    };
  }

  const subtotal = calculateCartSubtotal(cartItems);
  const shippingOption = getShippingOptionById(shippingMethodId);

  const tax = Number((subtotal * TAX_RATE).toFixed(2));
  const shipping = subtotal > 200000 ? 0 : shippingOption.price;

  return {
    subtotal,
    tax,
    shipping,
    total: subtotal + tax + shipping,
    shippingOption,
  };
}