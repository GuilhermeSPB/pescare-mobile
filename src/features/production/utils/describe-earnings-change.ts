import { formatBrl } from '@/utils/format-currency'
import { formatSummaryPeriod } from '@/utils/summary-period'

import type { IndicatorsPeriod } from '../types/production-indicators'

// Nome do período no meio da frase: "outubro de 2026" ou "2025".
function periodInSentence(period: IndicatorsPeriod): string {
  const label = formatSummaryPeriod(
    period.month === null
      ? { kind: 'YEAR', year: period.year }
      : { kind: 'MONTH', year: period.year, month: period.month },
  )

  return label.charAt(0).toLowerCase() + label.slice(1)
}

/**
 * Compara o ganho do período com o do anterior, numa frase só.
 *
 * @example
 * describeEarningsChange(400, { year: 2026, month: 10, total_earned: 100 })
 * // "R$ 300,00 a mais que em outubro de 2026"
 */
export function describeEarningsChange(
  totalEarned: number,
  previous: IndicatorsPeriod & { total_earned: number },
): string {
  const difference = totalEarned - previous.total_earned
  const previousLabel = periodInSentence(previous)

  if (difference > 0) return `${formatBrl(difference)} a mais que em ${previousLabel}`
  if (difference < 0) return `${formatBrl(-difference)} a menos que em ${previousLabel}`

  return `O mesmo que em ${previousLabel}`
}
