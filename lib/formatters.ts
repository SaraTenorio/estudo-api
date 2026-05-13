/**
 * Formats a numeric price value as a currency string (EUR, pt-BR locale).
 * @param value - The price to format.
 * @returns Formatted currency string, e.g. "€ 9,99".
 */
export function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "EUR" });
}

/**
 * Formats an ISO date string as a human-readable date.
 * @param iso - ISO 8601 date string.
 * @param includeTime - Whether to include hours and minutes.
 * @returns Formatted date string.
 */
export function formatDate(iso: string, includeTime = false): string {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(includeTime && { hour: "2-digit", minute: "2-digit" }),
  };
  return new Date(iso).toLocaleString("pt-BR", options);
}
