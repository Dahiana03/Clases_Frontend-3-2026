export function formatCOP(amount) {
  // Asegura que el valor sea numérico
  const number = Number(amount);
  if (!Number.isFinite(number)) {
    return "";
  }

  // Formatea usando Intl, sin decimales (COP no usa centavos)
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(number);
}
