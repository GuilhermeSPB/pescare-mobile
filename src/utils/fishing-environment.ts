import type { FishingEnvironment } from '@/types/fishing-environment'

const FISHING_ENVIRONMENT_LABELS: Record<FishingEnvironment, string> = {
  CONTINENTAL: 'Continental',
  MARINHO: 'Marinho',
}

/**
 * Ambiente de pesca como o pescador lê e como o REAP pede: "Continental" ou "Marinho".
 * Sem ambiente cadastrado (tipo de local novo, ainda sem ele), um traço.
 *
 * @example
 * formatFishingEnvironment('MARINHO') // "Marinho"
 */
export function formatFishingEnvironment(environment: FishingEnvironment | null): string {
  return environment ? FISHING_ENVIRONMENT_LABELS[environment] : '—'
}
