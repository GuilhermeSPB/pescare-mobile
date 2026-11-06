import { formatFishingEnvironment } from '@/utils/fishing-environment'
import { formatDateLabel, parseIsoDate } from '@/utils/iso-date'

import type { MunicipalityFishingBan } from '../types/municipality-fishing-ban'

/**
 * Data da API como o pescador lê: "2026-11-01" vira "01/11/2026". Sem data, um traço.
 *
 * @example
 * describeDate('2026-11-01') // "01/11/2026"
 */
export function describeDate(value: string | null): string {
  return value ? formatDateLabel(parseIsoDate(value)) : '—'
}

/**
 * Situação do defeso: "Vale agora, até 28/02/2027" ou "Começa em 01/11/2026".
 *
 * @example
 * describeStatus(ban) // "Começa em 01/11/2026"
 */
export function describeStatus(ban: MunicipalityFishingBan): string {
  if (ban.status === 'PROXIMO') {
    return `Começa em ${describeDate(ban.starts_on)}`
  }

  return `Vale agora, até ${describeDate(ban.ends_on)}`
}

/**
 * Espécies do defeso, ou "Todas as espécies" quando a norma vale para todas.
 *
 * @example
 * describeSpecies(ban) // "Tainha, Robalo"
 */
export function describeSpecies(ban: MunicipalityFishingBan): string {
  if (ban.applies_to_all_species) {
    return 'Todas as espécies'
  }

  return ban.species.map((species) => species.main_name).join(', ') || '—'
}

/**
 * Tipos de local do defeso, ou "Todos os tipos de local" quando a norma vale para todos.
 *
 * @example
 * describeLocations(ban) // "Mar"
 */
export function describeLocations(ban: MunicipalityFishingBan): string {
  if (ban.applies_to_all_location_types) {
    return 'Todos os tipos de local'
  }

  return ban.location_types.map((location) => location.name).join(', ') || '—'
}

/**
 * Tipo da norma como o pescador lê: "Continental" ou "Marinho".
 *
 * @example
 * describeNormType(ban) // "Marinho"
 */
export function describeNormType(ban: MunicipalityFishingBan): string {
  return formatFishingEnvironment(ban.fishing_ban.fishing_ban_type)
}
