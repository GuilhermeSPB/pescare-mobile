import styled from 'styled-components/native'

import { EmptyState } from '@/components/EmptyState'
import { RankedBarList } from '@/components/ranked-bar-list'
import { SectionCard } from '@/components/SectionCard'
import { StatCard } from '@/components/stat-card'
import { formatQuantity, type QuantityUnit } from '@/utils/format-quantity'

import type { SalesIndicators } from '../types/production-indicators'
import { toAveragePriceItems, toBuyerTypeItems } from '../utils/to-sales-bar-items'

type SalesSectionProps = {
  sales: SalesIndicators
}

type SoldCardProps = {
  sold: number
  caught: number
  unit: QuantityUnit
}

// A linha em `row` dá a largura ao `flex: 1` do StatCard, um cartão por linha.
const CardRow = styled.View`
  flex-direction: row;
`

// Quanto do que foi pescado numa unidade acabou vendido.
function SoldCard({ sold, caught, unit }: SoldCardProps) {
  return (
    <CardRow>
      <StatCard
        label="Vendido"
        value={formatQuantity(sold, unit)}
        detail={`de ${formatQuantity(caught, unit)} que pescou`}
      />
    </CardRow>
  )
}

// Indicadores de comercialização: quanto foi vendido, o preço médio de cada espécie e para quem.
// O comprador conta vendas, não reais: uma venda pode ter vários tipos de comprador.
export function SalesSection({ sales }: SalesSectionProps) {
  if (sales.sales_count === 0) {
    return (
      <SectionCard title="Como vendi">
        <EmptyState message="Nenhuma venda neste período." />
      </SectionCard>
    )
  }

  const kgPrices = toAveragePriceItems(sales.average_prices, 'KG')
  const unitPrices = toAveragePriceItems(sales.average_prices, 'UNIDADE')

  return (
    <SectionCard title="Como vendi">
      {sales.caught_kg > 0 && <SoldCard sold={sales.sold_kg} caught={sales.caught_kg} unit="KG" />}
      {sales.caught_units > 0 && (
        <SoldCard sold={sales.sold_units} caught={sales.caught_units} unit="UNIDADE" />
      )}
      {kgPrices.length > 0 && <RankedBarList title="Preço médio do quilo" items={kgPrices} />}
      {unitPrices.length > 0 && <RankedBarList title="Preço médio da unidade" items={unitPrices} />}
      <RankedBarList title="Para quem vendeu" items={toBuyerTypeItems(sales.by_buyer_type)} />
    </SectionCard>
  )
}
