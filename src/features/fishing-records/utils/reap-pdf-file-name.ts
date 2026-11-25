import type { SummaryPeriod } from '@/types/summary-period'
import { formatSummaryPeriod } from '@/utils/summary-period'

/**
 * Nome do arquivo do PDF, para quem recebe vários na colônia saber de quem é e de quando.
 * Fica sem acentos e sem espaços: o nome vai para uma URI `file://` e passa por WhatsApp e
 * outros apps, e nem todos tratam bem "João" ou "Março".
 *
 * @example
 * toReapPdfFileName({ kind: 'MONTH', year: 2026, month: 3 }, 'João da Silva')
 * // "REAP-Marco-de-2026-Joao-da-Silva.pdf"
 */
export function toReapPdfFileName(period: SummaryPeriod, fisherName: string): string {
  const baseName = `REAP ${formatSummaryPeriod(period)} ${fisherName}`
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${baseName}.pdf`
}
