import type { QuantityUnit } from '@/utils/format-quantity'

// Resposta de GET /production-indicators (production-indicators.mapper.ts no backend). Só pescas
// terminadas entram, contadas pela data da pesca. Decimais já chegam como número.

// Período da resposta: `month` é null quando o período é o ano inteiro.
export type IndicatorsPeriod = {
  year: number
  month: number | null
}

export type IndicatorsOverview = {
  finished_count: number
  unfinished_count: number
  worked_days: number
}

// Captura de uma espécie numa unidade (quilo e unidade não se somam).
export type SpeciesCatchTotal = {
  species_id: number
  main_name: string
  unit_measure: QuantityUnit
  quantity: number
  fishing_days: number
}

type CaptureTotals = {
  quantity_kg: number
  quantity_units: number
  fishing_days: number
}

// Captura de um lugar: tipo de local + nome do lugar (null em pescas antigas, sem o nome).
export type LocationCatchTotal = CaptureTotals & {
  type_location_id: number
  type_location_name: string
  location_name: string | null
}

export type MethodCatchTotal = CaptureTotals & {
  fishing_method_id: number
  name: string
}

export type MonthEarnings = {
  month: number
  total_earned: number
}

// Só receita: o banco não guarda despesas.
export type FinanceIndicators = {
  total_earned: number
  // null quando não houve dia de pesca no período.
  earned_per_day: number | null
  previous_period: IndicatorsPeriod & { total_earned: number }
  // No ano, os 12 meses (mês sem venda = 0); no mês, null.
  by_month: MonthEarnings[] | null
}

// Preço médio do quilo ou da unidade vendida, pesado pela quantidade.
export type AveragePrice = {
  species_id: number
  main_name: string
  unit_measure: QuantityUnit
  average_price: number
}

// Vendas (não reais) por tipo de comprador: uma venda pode ter vários tipos.
export type BuyerTypeSales = {
  buyer_type_id: number
  name: string
  sales_count: number
}

export type SalesIndicators = {
  sales_count: number
  caught_kg: number
  sold_kg: number
  caught_units: number
  sold_units: number
  average_prices: AveragePrice[]
  by_buyer_type: BuyerTypeSales[]
}

export type ProductionIndicators = {
  period: IndicatorsPeriod
  overview: IndicatorsOverview
  catches_by_species: SpeciesCatchTotal[]
  catches_by_location: LocationCatchTotal[]
  catches_by_method: MethodCatchTotal[]
  finance: FinanceIndicators
  sales: SalesIndicators
}
