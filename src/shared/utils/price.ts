export function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export const formatCurrency = formatIDR;
export const formatPrice = formatIDR;

export function toCents(decimal: number) {
  return Math.round(decimal * 100);
}
