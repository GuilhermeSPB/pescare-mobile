import { queryOptions, useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api-client'
import type { SummaryPeriod } from '@/types/summary-period'

import type { ProductionIndicators } from '../types/production-indicators'

// Query string do endpoint: sem `month`, o período é o ano inteiro.
function toIndicatorsParams(period: SummaryPeriod): { year: number; month?: number } {
  if (period.kind === 'YEAR') return { year: period.year }

  return { year: period.year, month: period.month }
}

/**
 * Indicadores da produção do pescador logado num mês ou num ano (GET /production-indicators).
 *
 * @example
 * const indicators = await getProductionIndicators({ kind: 'MONTH', year: 2026, month: 11 })
 */
export const getProductionIndicators = async (
  period: SummaryPeriod,
): Promise<ProductionIndicators> => {
  const { data } = await api.get<ProductionIndicators>('/production-indicators', {
    params: toIndicatorsParams(period),
  })

  return data
}

/**
 * Query options dos indicadores de um período. Gravar uma pesca invalida `['production-indicators']`
 * (create-fishing-record.ts), que cobre todos os períodos.
 *
 * @example
 * queryClient.invalidateQueries({ queryKey: ['production-indicators'] })
 */
export const getProductionIndicatorsQueryOptions = (period: SummaryPeriod) =>
  queryOptions({
    queryKey: ['production-indicators', period.year, period.kind === 'MONTH' ? period.month : null],
    queryFn: () => getProductionIndicators(period),
  })

/**
 * Indicadores do período escolhido como estado do servidor.
 *
 * @example
 * const indicatorsQuery = useProductionIndicators(summaryPeriod.period)
 */
export const useProductionIndicators = (period: SummaryPeriod) =>
  useQuery(getProductionIndicatorsQueryOptions(period))
