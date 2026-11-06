/**
 * Lê um número digitado no padrão brasileiro ("12,5" ou "1.250,75"). Devolve `null` quando
 * o texto não é um número positivo, para o formulário pedir de novo.
 *
 * @example
 * parseDecimal('1.250,5') // 1250.5
 * parseDecimal('abc') // null
 */
export function parseDecimal(text: string): number | null {
  const trimmed = text.trim()
  // Com vírgula, o ponto é separador de milhar; sem ela, o ponto é a casa decimal ("1.5").
  const normalized = trimmed.includes(',') ? trimmed.replace(/\./g, '').replace(',', '.') : trimmed

  if (!/^\d+(\.\d+)?$/.test(normalized)) return null

  const value = Number(normalized)

  return value > 0 ? value : null
}
