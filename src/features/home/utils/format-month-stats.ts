import { formatBrl } from '@/utils/format-currency'
import { formatQuantity, type QuantityUnit } from '@/utils/format-quantity'

// Números do mês como a home os recebe. A feature de pescas calcula; a home só mostra.
export type MonthStatsInput = {
  workedDays: number
  totalEarned: number
  quantityKg: number
  quantityUnits: number
  topSpecies: { name: string; quantity: number; unit: QuantityUnit } | null
}

// Um cartão da grade do mês: rótulo, valor e uma linha de apoio opcional.
export type MonthCard = {
  label: string
  value: string
  detail?: string
}

/**
 * Textos dos quatro cartões do mês, na ordem da grade: dias, quantidade, total e espécie.
 *
 * @example
 * formatMonthCards(stats)[2].value // "R$ 300,00"
 */
export function formatMonthCards(stats: MonthStatsInput): MonthCard[] {
  return [
    { label: 'Dias trabalhados', value: String(stats.workedDays) },
    {
      label: 'Quantidade pescada',
      value: formatQuantity(stats.quantityKg, 'KG'),
      detail: unitsDetail(stats.quantityUnits),
    },
    { label: 'Total arrecadado', value: formatBrl(stats.totalEarned) },
    speciesCard(stats.topSpecies),
  ]
}

// Só aparece quando houve captura por unidade no mês.
function unitsDetail(quantityUnits: number): string | undefined {
  return quantityUnits > 0 ? formatQuantity(quantityUnits, 'UNIDADE') : undefined
}

function speciesCard(topSpecies: MonthStatsInput['topSpecies']): MonthCard {
  if (!topSpecies) return { label: 'Espécie mais pescada', value: 'Nenhuma ainda' }

  return {
    label: 'Espécie mais pescada',
    value: topSpecies.name,
    detail: formatQuantity(topSpecies.quantity, topSpecies.unit),
  }
}
