import { groupThousands } from '@/utils/group-thousands'

// Unidades de captura como a API grava: "KG" ou "UNIDADE" (valores provisórios do schema).
export type QuantityUnit = 'KG' | 'UNIDADE'

/**
 * Quantidade com a unidade no fim, como o pescador lê: "12,5 kg", "1 unidade", "8 unidades".
 *
 * @example
 * formatQuantity(8, 'UNIDADE') // "8 unidades"
 */
export function formatQuantity(value: number, unit: QuantityUnit): string {
  const amount = formatAmount(value)

  if (unit === 'KG') return `${amount} kg`

  return value === 1 ? `${amount} unidade` : `${amount} unidades`
}

// Número em pt-BR: milhar com ponto, decimal com vírgula, até três casas (como o banco),
// sem zeros à direita.
function formatAmount(value: number): string {
  const [integerPart, decimalPart = ''] = value.toFixed(3).split('.')
  const grouped = groupThousands(integerPart)
  const decimals = decimalPart.replace(/0+$/, '')

  return decimals ? `${grouped},${decimals}` : grouped
}
