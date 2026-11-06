/**
 * Valor em reais no padrão brasileiro: "R$ 1.250,50". Feito à mão para não depender do
 * suporte de `Intl` do motor JavaScript no aparelho.
 *
 * @example
 * formatBrl(1250.5) // "R$ 1.250,50"
 */
export function formatBrl(value: number): string {
  const [integerPart, decimalPart] = value.toFixed(2).split('.')
  const grouped = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  return `R$ ${grouped},${decimalPart}`
}
