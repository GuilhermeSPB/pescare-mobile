import { normalize } from '@/utils/text'

import type { FishingRecord } from '../types/fishing-record'

/**
 * Nomes de lugar que o pescador já usou, do mais recente para o mais antigo, sem repetir
 * (maiúsculas e acentos não contam). Viram atalhos para ele tocar em vez de digitar de novo.
 *
 * @param records pescas como a API devolve, da mais recente para a mais antiga
 * @param limit quantos nomes no máximo
 * @example
 * recentLocationNames(records, 4) // ['Rio Pardo', 'Coroa Vermelha']
 */
export function recentLocationNames(records: FishingRecord[], limit: number): string[] {
  const seen = new Set<string>()
  const names: string[] = []

  for (const record of records) {
    const name = record.location_name?.trim() ?? ''
    const key = normalize(name)

    if (key === '' || seen.has(key)) continue

    seen.add(key)
    names.push(name)
  }

  return names.slice(0, limit)
}
