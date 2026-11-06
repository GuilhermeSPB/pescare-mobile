import { normalize } from '@/utils/text'

import type { CatchUnit, FishingRecord, SpeciesCatch } from '../types/fishing-record'
import type { ReapArea, ReapCatch, ReapPeriod, ReapSummary, ReapWorkedMonth } from '../types/reap'
import { finishedRecordsIn } from './finished-records-in'
import { reapPeriodPrefix } from './reap-period'

const ALL_MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

// Soma de uma espécie numa unidade, com a parte vendida separada para o preço médio.
type CatchTotal = {
  speciesName: string
  unit: CatchUnit
  quantity: number
  soldQuantity: number
  soldValue: number
}

/**
 * Monta o que o REAP pede sobre a atividade, a partir das pescas terminadas do período.
 * A pesca sem terminar só entra na contagem `unfinishedCount`, para o aviso.
 *
 * @param records pescas como a API devolve, da mais recente para a mais antiga
 * @example
 * summarizeReap(records, { kind: 'YEAR', year: 2026 }).workedDays // 87
 */
export function summarizeReap(records: FishingRecord[], period: ReapPeriod): ReapSummary {
  const datePrefix = reapPeriodPrefix(period)
  const finished = finishedRecordsIn(records, datePrefix)
  const catches = finished.flatMap((record) => record.species)
  const sold = finished.filter((record) => record.commercialization !== null)
  const workedMonths = countWorkedDaysByMonth(finished, period)

  return {
    hasFished: finished.length > 0,
    workedDays: workedMonths.reduce((sum, item) => sum + item.workedDays, 0),
    workedMonths,
    areas: groupReapAreas(finished),
    catches: groupReapCatches(catches),
    speciesIds: unique(catches.map((item) => item.fk_species_id)),
    hasSold: sold.length > 0,
    saleMunicipalityCodes: unique(sold.map((record) => record.fk_municipality_ibge_code)),
    unfinishedCount: records.filter(
      (record) => record.status === 'EM_ANDAMENTO' && record.fishing_date.startsWith(datePrefix),
    ).length,
  }
}

// Dias distintos com pesca em cada mês: os 12 meses no ano (mês sem pesca = 0), um só no mês.
function countWorkedDaysByMonth(records: FishingRecord[], period: ReapPeriod): ReapWorkedMonth[] {
  const months = period.kind === 'YEAR' ? ALL_MONTHS : [period.month]

  return months.map((month) => {
    const monthPrefix = reapPeriodPrefix({ kind: 'MONTH', year: period.year, month })
    const days = records
      .filter((record) => record.fishing_date.startsWith(monthPrefix))
      .map((record) => record.fishing_date)

    return { month, workedDays: new Set(days).size }
  })
}

// Uma linha por tipo de local + cidade + nome do lugar + método. O nome não diferencia maiúsculas
// nem acentos ("rio pardo" e "Rio Pardo" são o mesmo lugar); fica a grafia da pesca mais recente.
function groupReapAreas(records: FishingRecord[]): ReapArea[] {
  const areas = new Map<string, ReapArea>()

  for (const record of records) {
    const locationName = record.location_name?.trim() || null
    const key = [
      record.fk_type_location_id,
      record.fk_municipality_ibge_code,
      normalize(locationName ?? ''),
      record.fk_fishing_method_id,
    ].join('|')

    if (areas.has(key)) continue

    areas.set(key, {
      key,
      typeLocationId: record.fk_type_location_id,
      municipalityCode: record.fk_municipality_ibge_code,
      locationName,
      fishingMethodId: record.fk_fishing_method_id,
    })
  }

  return [...areas.values()]
}

// Soma por espécie e unidade (quilo e unidade não se somam). O preço é a média das capturas
// vendidas com preço, pesada pela quantidade: 10 kg a R$ 10 e 30 kg a R$ 14 dão R$ 13 o quilo.
function groupReapCatches(catches: SpeciesCatch[]): ReapCatch[] {
  const totals = new Map<string, CatchTotal>()

  for (const item of catches) {
    const key = `${item.fk_species_id}|${item.unit_measure}`
    const current = totals.get(key) ?? emptyCatchTotal(item)
    const price = soldPrice(item)

    totals.set(key, {
      ...current,
      quantity: current.quantity + item.quantity,
      soldQuantity: current.soldQuantity + (price === null ? 0 : item.quantity),
      soldValue: current.soldValue + (price === null ? 0 : price * item.quantity),
    })
  }

  return [...totals.entries()]
    .map(([key, total]) => toReapCatch(key, total))
    .sort((a, b) => b.quantity - a.quantity)
}

function emptyCatchTotal(item: SpeciesCatch): CatchTotal {
  return {
    speciesName: item.main_name,
    unit: item.unit_measure,
    quantity: 0,
    soldQuantity: 0,
    soldValue: 0,
  }
}

// Preço do quilo ou da unidade quando a captura foi vendida com preço; senão, null.
function soldPrice(item: SpeciesCatch): number | null {
  return item.commercialized ? item.unit_value : null
}

function toReapCatch(key: string, total: CatchTotal): ReapCatch {
  return {
    key,
    speciesName: total.speciesName,
    unit: total.unit,
    quantity: total.quantity,
    averagePrice: total.soldQuantity > 0 ? total.soldValue / total.soldQuantity : null,
  }
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)]
}
