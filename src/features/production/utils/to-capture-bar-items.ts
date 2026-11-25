import type { RankedBarItem } from '@/components/ranked-bar-list'
import { formatQuantity, type QuantityUnit } from '@/utils/format-quantity'

import type {
  LocationCatchTotal,
  MethodCatchTotal,
  SpeciesCatchTotal,
} from '../types/production-indicators'

// Uma linha de captura, do mesmo jeito para espécie, lugar e método.
export type CaptureRow = {
  key: string
  label: string
  // Texto antes dos dias na linha de apoio, como o tipo de local ("Lago").
  detailPrefix?: string
  quantityKg: number
  quantityUnits: number
  fishingDays: number
}

/**
 * Quantos dias de pesca, como o pescador lê: "em 1 dia", "em 4 dias".
 *
 * @example
 * describeFishingDays(4) // "em 4 dias"
 */
export function describeFishingDays(days: number): string {
  return days === 1 ? 'em 1 dia' : `em ${days} dias`
}

/**
 * Linhas por espécie. A API manda uma linha por espécie e unidade; aqui cada uma vira uma linha
 * com a quantidade na sua unidade e zero na outra.
 *
 * @example
 * toSpeciesCaptureRows(indicators.catches_by_species)[0].label // "Tainha"
 */
export function toSpeciesCaptureRows(rows: SpeciesCatchTotal[]): CaptureRow[] {
  return rows.map((row) => ({
    key: `${row.species_id}-${row.unit_measure}`,
    label: row.main_name,
    quantityKg: row.unit_measure === 'KG' ? row.quantity : 0,
    quantityUnits: row.unit_measure === 'UNIDADE' ? row.quantity : 0,
    fishingDays: row.fishing_days,
  }))
}

/**
 * Linhas por lugar: o nome do lugar, com o tipo de local embaixo. Pesca antiga, gravada antes de o
 * nome ser pedido, aparece só pelo tipo ("Lago"): repetir "Lugar sem nome" não ajudava a separar.
 *
 * @example
 * toLocationCaptureRows(indicators.catches_by_location)[0].detailPrefix // "Rio"
 */
export function toLocationCaptureRows(rows: LocationCatchTotal[]): CaptureRow[] {
  return rows.map((row) => ({
    key: `${row.type_location_id}-${row.location_name ?? ''}`,
    label: row.location_name ?? row.type_location_name,
    detailPrefix: row.location_name ? row.type_location_name : undefined,
    quantityKg: row.quantity_kg,
    quantityUnits: row.quantity_units,
    fishingDays: row.fishing_days,
  }))
}

/**
 * Linhas por método de pesca.
 *
 * @example
 * toMethodCaptureRows(indicators.catches_by_method)[0].label // "Rede"
 */
export function toMethodCaptureRows(rows: MethodCatchTotal[]): CaptureRow[] {
  return rows.map((row) => ({
    key: String(row.fishing_method_id),
    label: row.name,
    quantityKg: row.quantity_kg,
    quantityUnits: row.quantity_units,
    fishingDays: row.fishing_days,
  }))
}

/**
 * Itens do ranking numa unidade só, do maior para o menor. Linha sem nada nessa unidade sai.
 *
 * @example
 * toCaptureBarItems(rows, 'KG')[0].valueLabel // "120 kg"
 */
export function toCaptureBarItems(rows: CaptureRow[], unit: QuantityUnit): RankedBarItem[] {
  return rows
    .map((row) => ({ row, quantity: unit === 'KG' ? row.quantityKg : row.quantityUnits }))
    .filter(({ quantity }) => quantity > 0)
    .sort((a, b) => b.quantity - a.quantity)
    .map(({ row, quantity }) => ({
      key: row.key,
      label: row.label,
      detail: [row.detailPrefix, describeFishingDays(row.fishingDays)].filter(Boolean).join(' · '),
      value: quantity,
      valueLabel: formatQuantity(quantity, unit),
    }))
}
