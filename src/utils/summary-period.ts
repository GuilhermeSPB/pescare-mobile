import type { SummaryPeriod, SummaryPeriodKind } from '@/types/summary-period'
import { formatMonthLabel } from '@/utils/iso-date'

// Mês contado a partir do ano zero, para comparar e somar meses sem `Date`.
function monthIndex(year: number, month: number): number {
  return year * 12 + (month - 1)
}

/**
 * Prefixo de data do período, para casar com as datas "AAAA-MM-DD" da API: "2026" ou "2026-03".
 *
 * @example
 * summaryPeriodPrefix({ kind: 'MONTH', year: 2026, month: 3 }) // "2026-03"
 */
export function summaryPeriodPrefix(period: SummaryPeriod): string {
  if (period.kind === 'YEAR') return String(period.year)

  return `${period.year}-${String(period.month).padStart(2, '0')}`
}

/**
 * Anda um mês ou um ano para trás (-1) ou para a frente (1), conforme o tipo do período.
 *
 * @example
 * shiftSummaryPeriod({ kind: 'MONTH', year: 2026, month: 1 }, -1) // dezembro de 2025
 */
export function shiftSummaryPeriod(period: SummaryPeriod, step: -1 | 1): SummaryPeriod {
  if (period.kind === 'YEAR') return { kind: 'YEAR', year: period.year + step }

  const index = monthIndex(period.year, period.month) + step

  return { kind: 'MONTH', year: Math.floor(index / 12), month: (index % 12) + 1 }
}

/**
 * Diz se o período já é o de hoje (ou depois): não há pesca no futuro para mostrar.
 *
 * @example
 * isLatestSummaryPeriod({ kind: 'YEAR', year: 2026 }, new Date(2026, 10, 4)) // true
 */
export function isLatestSummaryPeriod(period: SummaryPeriod, today: Date): boolean {
  if (period.kind === 'YEAR') return period.year >= today.getFullYear()

  return (
    monthIndex(period.year, period.month) >= monthIndex(today.getFullYear(), today.getMonth() + 1)
  )
}

/**
 * Troca entre "por mês" e "por ano" sem mudar o ano escolhido. Ao ir para o mês, mostra o último
 * mês que já começou naquele ano: o mês de hoje no ano atual, dezembro nos anos passados.
 *
 * @example
 * switchSummaryPeriodKind({ kind: 'YEAR', year: 2025 }, 'MONTH', new Date(2026, 10, 4)) // dezembro de 2025
 */
export function switchSummaryPeriodKind(
  period: SummaryPeriod,
  kind: SummaryPeriodKind,
  today: Date,
): SummaryPeriod {
  if (period.kind === kind) return period
  if (kind === 'YEAR') return { kind: 'YEAR', year: period.year }

  const isCurrentYear = period.year === today.getFullYear()

  return { kind: 'MONTH', year: period.year, month: isCurrentYear ? today.getMonth() + 1 : 12 }
}

/**
 * Período de hoje no tipo pedido: o mês atual ou o ano atual.
 *
 * @example
 * currentSummaryPeriod('MONTH', new Date(2026, 10, 4)) // { kind: 'MONTH', year: 2026, month: 11 }
 */
export function currentSummaryPeriod(kind: SummaryPeriodKind, today: Date): SummaryPeriod {
  if (kind === 'YEAR') return { kind: 'YEAR', year: today.getFullYear() }

  return { kind: 'MONTH', year: today.getFullYear(), month: today.getMonth() + 1 }
}

/**
 * Nome do período como o pescador lê: "Março de 2026" ou "2026".
 *
 * @example
 * formatSummaryPeriod({ kind: 'MONTH', year: 2026, month: 3 }) // "Março de 2026"
 */
export function formatSummaryPeriod(period: SummaryPeriod): string {
  if (period.kind === 'YEAR') return String(period.year)

  return formatMonthLabel(new Date(period.year, period.month - 1, 1))
}
