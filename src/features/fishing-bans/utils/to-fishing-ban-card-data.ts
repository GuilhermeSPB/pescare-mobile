import type { FishingBanCardData } from '@/components/fishing-ban-card'

import { describeLocations, describeSpecies, describeStatus } from './describe-fishing-ban'
import type { MunicipalityFishingBan } from '../types/municipality-fishing-ban'

/**
 * Textos e destaque do cartão de um defeso, prontos para a tela.
 *
 * @example
 * const cards = bans.map(toFishingBanCardData)
 */
export function toFishingBanCardData(ban: MunicipalityFishingBan): FishingBanCardData {
  return {
    id: ban.id,
    rule: ban.fishing_ban.rule,
    highlight: ban.status === 'EM_VIGOR',
    statusText: describeStatus(ban),
    speciesText: describeSpecies(ban),
    locationText: describeLocations(ban),
  }
}
