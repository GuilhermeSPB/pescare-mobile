import type { FishingRecord } from '../types/fishing-record'

/**
 * Pescas terminadas cuja data começa com o prefixo: "2026" (o ano) ou "2026-11" (o mês). Compara o
 * texto da data, sem `new Date`, para não deslocar o dia. Pesca sem terminar fica de fora de tudo.
 *
 * @example
 * finishedRecordsIn(records, '2026-11').length // 3
 */
export function finishedRecordsIn(records: FishingRecord[], datePrefix: string): FishingRecord[] {
  return records.filter(
    (record) => record.status === 'FINALIZADO' && record.fishing_date.startsWith(datePrefix),
  )
}
