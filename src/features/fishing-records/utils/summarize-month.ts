import type { CatchUnit, FishingRecord, SpeciesCatch } from '../types/fishing-record'
import { finishedRecordsIn } from './finished-records-in'

// Números do mês que a home mostra. Só pescas finalizadas entram: a incompleta não soma em nada.
// Quantidade fica separada por unidade: quilo e unidade não se somam.
export type MonthSummary = {
  workedDays: number
  totalEarned: number
  quantityKg: number
  quantityUnits: number
  topSpecies: { name: string; quantity: number; unit: CatchUnit } | null
}

/**
 * Resume as pescas finalizadas cuja data cai no mês ("AAAA-MM"). Compara o texto da data, sem `new Date`,
 * para não deslocar o dia.
 *
 * @example
 * summarizeMonth(records, '2026-11').workedDays // 3
 */
export function summarizeMonth(records: FishingRecord[], monthPrefix: string): MonthSummary {
  // Pesca incompleta fica de fora de tudo: nem dia, nem quantidade, nem venda.
  const monthRecords = finishedRecordsIn(records, monthPrefix)
  const catches = monthRecords.flatMap((record) => record.species)

  return {
    workedDays: new Set(monthRecords.map((record) => record.fishing_date)).size,
    totalEarned: monthRecords.reduce(
      (sum, record) => sum + (record.commercialization?.total_value ?? 0),
      0,
    ),
    quantityKg: sumQuantity(catches, 'KG'),
    quantityUnits: sumQuantity(catches, 'UNIDADE'),
    // Quilo tem prioridade: a espécie "mais pescada" é a de maior peso, se houver algum quilo.
    topSpecies: topSpeciesFor(catches, 'KG') ?? topSpeciesFor(catches, 'UNIDADE'),
  }
}

// Soma as capturas de uma unidade só.
function sumQuantity(catches: SpeciesCatch[], unit: CatchUnit): number {
  return catches
    .filter((item) => item.unit_measure === unit)
    .reduce((sum, item) => sum + item.quantity, 0)
}

// Espécie com mais quantidade numa unidade; null quando nenhuma captura usou essa unidade.
function topSpeciesFor(catches: SpeciesCatch[], unit: CatchUnit): MonthSummary['topSpecies'] {
  const totals = new Map<number, { name: string; quantity: number }>()

  for (const item of catches) {
    if (item.unit_measure !== unit) continue

    const current = totals.get(item.fk_species_id)

    totals.set(item.fk_species_id, {
      name: item.main_name,
      quantity: (current?.quantity ?? 0) + item.quantity,
    })
  }

  const best = [...totals.values()].sort((a, b) => b.quantity - a.quantity)[0]

  return best ? { ...best, unit } : null
}
