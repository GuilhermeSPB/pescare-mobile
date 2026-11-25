import { formatDateLabel } from '@/utils/iso-date'

/**
 * Texto curto do período para o chip: "01/11 – 03/11". O ano só aparece quando as duas
 * datas são de anos diferentes.
 *
 * @example
 * formatPeriod(new Date(2026, 10, 1), new Date(2026, 10, 3)) // "01/11 – 03/11"
 */
export function formatPeriod(from: Date, to: Date): string {
  if (from.getFullYear() !== to.getFullYear()) {
    return `${formatDateLabel(from)} – ${formatDateLabel(to)}`
  }

  return `${formatDayMonth(from)} – ${formatDayMonth(to)}`
}

// "01/11": o dia e o mês de formatDateLabel, sem o ano.
function formatDayMonth(date: Date): string {
  return formatDateLabel(date).slice(0, 5)
}
