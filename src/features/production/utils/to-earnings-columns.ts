import type { MonthColumn } from '@/components/month-column-chart'
import { formatBrl } from '@/utils/format-currency'
import { formatMonthName } from '@/utils/iso-date'

import type { MonthEarnings } from '../types/production-indicators'

/**
 * Colunas de ganho mês a mês do ano. No ano atual, os meses que ainda não chegaram saem: não há
 * pesca no futuro.
 *
 * @param today data de hoje, para cortar os meses futuros do ano atual
 * @example
 * toEarningsColumns(byMonth, 2026, new Date(2026, 10, 4)).length // 11
 */
export function toEarningsColumns(
  byMonth: MonthEarnings[],
  year: number,
  today: Date,
): MonthColumn[] {
  const lastMonth = year === today.getFullYear() ? today.getMonth() + 1 : 12

  return byMonth
    .filter((item) => item.month <= lastMonth)
    .map((item) => {
      const name = formatMonthName(item.month - 1)

      return {
        key: String(item.month),
        label: name.slice(0, 3),
        name,
        value: item.total_earned,
        valueLabel: formatBrl(item.total_earned),
      }
    })
}
