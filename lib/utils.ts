/**
 * Formats a numeric amount as US currency, defaulting to USD.
 */
export function formatCurrency(value: number, currency = "USD"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    const amount = Number.isFinite(value) ? value : 0;

    return `$${amount.toFixed(2)}`;
  }
}

export default formatCurrency;
