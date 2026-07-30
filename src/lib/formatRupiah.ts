/**
 * Format string or number to Indonesian Rupiah number format (e.g. 500.000)
 */
export function formatRupiahInput(value: string): string {
  const numberString = value.replace(/[^0-9]/g, "");
  if (!numberString) return "";
  const num = parseInt(numberString, 10);
  return new Intl.NumberFormat("id-ID").format(num);
}

/**
 * Format string or number to full Indonesian Rupiah format with Rp prefix (e.g. Rp 500.000)
 */
export function formatRupiahDisplay(value: string): string {
  if (!value) return "Rp 0";
  const trimmed = value.trim();
  if (trimmed.startsWith("Rp")) return trimmed;
  const numberString = trimmed.replace(/[^0-9]/g, "");
  if (!numberString) return value;
  const num = parseInt(numberString, 10);
  return `Rp ${new Intl.NumberFormat("id-ID").format(num)}`;
}
