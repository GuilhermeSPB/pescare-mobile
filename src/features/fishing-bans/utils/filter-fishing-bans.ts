import { normalize } from '@/utils/text'

import type { MunicipalityFishingBan } from '../types/municipality-fishing-ban'

// Situação escolhida na listagem: todos, só os vigentes ou só os próximos.
export type BanStatusFilter = 'TODOS' | 'EM_VIGOR' | 'PROXIMO'

/**
 * Defesos que passam no filtro de situação e na busca. A busca olha a portaria e o nome das
 * espécies, sem acento e sem diferença de caixa.
 *
 * @example
 * filterFishingBans(bans, { query: 'tainha', status: 'TODOS' })
 */
export function filterFishingBans(
  bans: MunicipalityFishingBan[],
  filters: { query: string; status: BanStatusFilter },
): MunicipalityFishingBan[] {
  const term = normalize(filters.query)

  return bans.filter((ban) => matchesStatus(ban, filters.status) && matchesQuery(ban, term))
}

function matchesStatus(ban: MunicipalityFishingBan, status: BanStatusFilter): boolean {
  return status === 'TODOS' || ban.status === status
}

// Sem termo, passa tudo. Com termo, a portaria ou o nome de uma espécie precisa conter o termo.
function matchesQuery(ban: MunicipalityFishingBan, term: string): boolean {
  if (!term) {
    return true
  }

  const texts = [ban.fishing_ban.rule, ...ban.species.map((species) => species.main_name)]

  return texts.some((text) => normalize(text).includes(term))
}
