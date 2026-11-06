import type { FishingRecordRowData } from '@/components/fishing-record-row'

import type { FishingRecord } from '../types/fishing-record'

/**
 * Dados que uma linha de pesca mostra, tirados da pesca da API. Serve à home e ao histórico.
 *
 * @example
 * const rows = records.map(toFishingRecordRowData)
 */
export function toFishingRecordRowData(record: FishingRecord): FishingRecordRowData {
  return {
    id: record.id,
    fishingDate: record.fishing_date,
    isFinished: record.status === 'FINALIZADO',
    speciesNames: record.species.map((item) => item.main_name),
    totalEarned: record.commercialization?.total_value ?? null,
  }
}
