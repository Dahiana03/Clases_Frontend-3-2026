export function calculateOrderTotals(cartItems, shippingMethodId = SHIPPING_OPTIONS[0].id) {
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