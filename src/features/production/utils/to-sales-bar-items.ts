import type { RankedBarItem } from '@/components/ranked-bar-list'
import { formatBrl } from '@/utils/format-currency'
import type { QuantityUnit } from '@/utils/format-quantity'

import type { AveragePrice, BuyerTypeSales } from '../types/production-indicators'

const PRICE_SUFFIX: Record<QuantityUnit, string> = {
  KG: 'o kg',
  UNIDADE: 'a unidade',
}

/**
 * Preço médio das espécies vendidas numa unidade, do mais caro para o mais barato. Preço do quilo
 * e da unidade ficam em listas separadas: uma barra não compara os dois.
 *
 * @example
 * toAveragePriceItems(prices, 'KG')[0].valueLabel // "R$ 15,00 o kg"
 */
export function toAveragePriceItems(prices: AveragePrice[], unit: QuantityUnit): RankedBarItem[] {
  return prices
    .filter((price) => price.unit_measure === unit)
    .sort((a, b) => b.average_price - a.average_price)
    .map((price) => ({
      key: `${price.species_id}-${price.unit_measure}`,
      label: price.main_name,
      value: price.average_price,
      valueLabel: `${formatBrl(price.average_price)} ${PRICE_SUFFIX[unit]}`,
    }))
}

/**
 * Quantas vendas foram para cada tipo de comprador, do que mais comprou para o que menos comprou.
 *
 * @example
 * toBuyerTypeItems(buyers)[0].valueLabel // "3 vendas"
 */
export function toBuyerTypeItems(buyers: BuyerTypeSales[]): RankedBarItem[] {
  return [...buyers]
    .sort((a, b) => b.sales_count - a.sales_count)
    .map((buyer) => ({
      key: String(buyer.buyer_type_id),
      label: buyer.name,
      value: buyer.sales_count,
      valueLabel: buyer.sales_count === 1 ? '1 venda' : `${buyer.sales_count} vendas`,
    }))
}
