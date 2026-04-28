const STORAGE_KEY = 'orders';
const MAX_ORDERS = 50;

// ===============================
// 🧩 NORMALIZADORES
// ===============================

const normalizeOrderItem = (item) => ({
  id: Number(item?.id),
  name: String(item?.name ?? 'Producto'),
  category: String(item?.category ?? 'Sin categoría'),
  price: Number(item?.price) || 0,
  stock: Number(item?.stock) || 0,
  image: String(item?.image ?? ''),
  quantity: Math.max(1, Math.floor(Number(item?.quantity) || 1)),
});

const normalizeOrder = (order) => {
  const parsedDate = new Date(order?.createdAt);

  return {
    id: String(order?.id ?? crypto.randomUUID()),

    // 🔐 IMPORTANTE: mantener userId
    userId: String(order?.userId ?? ''),

    createdAt: isNaN(parsedDate)
      ? new Date().toISOString()
      : parsedDate.toISOString(),

    items: Array.isArray(order?.items)
      ? order.items
          .map(normalizeOrderItem)
          .filter((item) => item.id)
      : [],

    customer: {
      fullName: String(order?.customer?.fullName ?? ''),
      email: String(order?.customer?.email ?? ''),
      phone: String(order?.customer?.phone ?? ''),
      address: String(order?.customer?.address ?? ''),
      city: String(order?.customer?.city ?? ''),
      postalCode: String(order?.customer?.postalCode ?? ''),
    },

    shippingMethod: {
      id: String(order?.shippingMethod?.id ?? 'standard'),
      label: String(order?.shippingMethod?.label ?? 'Envío estándar'),
      description: String(order?.shippingMethod?.description ?? ''),
      price: Number(order?.shippingMethod?.price) || 0,
    },

    paymentMethod: {
      id: String(order?.paymentMethod?.id ?? 'card'),
      label: String(order?.paymentMethod?.label ?? 'Tarjeta de crédito'),
      description: String(order?.paymentMethod?.description ?? ''),
    },

    totals: {
      subtotal: Number(order?.totals?.subtotal) || 0,
      tax: Number(order?.totals?.tax) || 0,
      shipping: Number(order?.totals?.shipping) || 0,
      total: Number(order?.totals?.total) || 0,
    },
  };
};

// ===============================
// 📥 CARGAR ÓRDENES
// ===============================

export function loadOrders() {
  if (typeof window === 'undefined') {
    return [];
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(normalizeOrder)
      .filter((order) => order.id && order.items.length > 0);
  } catch {
    return [];
  }
}

// ===============================
// 💾 GUARDAR ORDEN
// ===============================

export function saveOrder(order) {
  if (typeof window === 'undefined') {
    return;
  }

  const normalizedOrder = normalizeOrder(order);
  const currentOrders = loadOrders();

  // 🚫 evitar duplicados
  const exists = currentOrders.some((o) => o.id === normalizedOrder.id);
  if (exists) return;

  // 📦 limitar tamaño
  const updatedOrders = [normalizedOrder, ...currentOrders].slice(0, MAX_ORDERS);

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
}

// ===============================
// 👤 FILTRAR POR USUARIO
// ===============================

export function loadOrdersByUserId(userId) {
  const normalizedUserId = String(userId ?? '').trim();

  if (!normalizedUserId) return [];

  return loadOrders().filter(
    (order) => order.userId === normalizedUserId
  );
}

// ===============================
// 📌 EXPORT
// ===============================

export const ORDERS_STORAGE_KEY = STORAGE_KEY;