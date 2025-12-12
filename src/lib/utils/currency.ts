import { APP_CONFIG } from "@/lib/constants";

/**
 * Format number to Rupiah currency
 */
export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;

  return new Intl.NumberFormat(APP_CONFIG.locale, {
    style: "currency",
    currency: APP_CONFIG.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Format number with thousand separator
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat(APP_CONFIG.locale).format(num);
}

/**
 * Parse currency string to number
 */
export function parseCurrency(value: string): number {
  return parseFloat(value.replace(/[^0-9.-]+/g, ""));
}
