import { toIsoDate } from '@/utils/iso-date'

import type { FishingRecord } from '../types/fishing-record'

// Situação escolhida no Histórico: todas, só finalizadas, ou só as que faltam terminar.
export type HistoryStatus = 'TODAS' | 'FINALIZADO' | 'EM_ANDAMENTO'

// Filtros do Histórico. `from` e `to` são datas locais e entram no período; null = sem limite.
export type HistoryFilters = {
  status: HistoryStatus
  from: Date | null
  to: Date | null
}

/**
 * Pescas que passam nos filtros, na ordem em que vieram. Compara as datas como texto
 * "AAAA-MM-DD", então nenhum dia é deslocado.
 *
 * @example
 * filterFishingRecords(records, { status: 'FINALIZADO', from: null, to: null })
 */
export function filterFishingRecords(
  records: FishingRecord[],
  filters: HistoryFilters,
): FishingRecord[] {
  const from = filters.from ? toIsoDate(filters.from) : null
  const to = filters.to ? toIsoDate(filters.to) : null

  return records.filter(
    (record) => matchesStatus(record, filters.status) && isInPeriod(record.fishing_date, from, to),
  )
}

function matchesStatus(record: FishingRecord, status: HistoryStatus): boolean {
  return status === 'TODAS' || record.status === status
}

// Os dois limites entram: "De" 01/11 e "Até" 03/11 contam as pescas de 01, 02 e 03.
function isInPeriod(date: string, from: string | null, to: string | null): boolean {
  return (from === null || date >= from) && (to === null || date <= to)
}
