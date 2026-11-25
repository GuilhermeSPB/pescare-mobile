/**
 * Dias como o pescador lê: "1 dia" ou "12 dias".
 *
 * @example
 * formatDays(12) // "12 dias"
 */
export function formatDays(days: number): string {
  return days === 1 ? '1 dia' : `${days} dias`
}
