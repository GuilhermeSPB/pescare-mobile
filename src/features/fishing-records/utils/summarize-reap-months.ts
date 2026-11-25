import type { FishingRecord } from '../types/fishing-record'
import type { ReapMonthSummary } from '../types/reap'
import { summarizeReap } from './summarize-reap'

// Último mês do ano que já começou: dezembro nos anos passados, o mês de hoje no ano atual e
// nenhum num ano que ainda não chegou.
function lastStartedMonth(year: number, today: Date): number {
  if (year < today.getFullYear()) return 12
  if (year > today.getFullYear()) return 0

  return today.getMonth() + 1
}

/**
 * Resumo de cada mês do ano, de janeiro até o último mês que já começou, com as mesmas contas da
 * escolha "Por mês". Mês que ainda não chegou fica de fora: dizer "não houve pesca" nele confunde.
 *
 * @param records pescas como a API devolve, da mais recente para a mais antiga
 * @example
 * summarizeReapMonths(records, 2026, new Date(2026, 10, 15)).length // 11 (janeiro a novembro)
 */
export function summarizeReapMonths(
  records: FishingRecord[],
  year: number,
  today: Date,
): ReapMonthSummary[] {
  const months = Array.from({ length: lastStartedMonth(year, today) }, (_, index) => index + 1)

  return months.map((month) => ({
    month,
    summary: summarizeReap(records, { kind: 'MONTH', year, month }),
  }))
}
