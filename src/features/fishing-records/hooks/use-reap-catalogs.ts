import { useMunicipalities } from '@/hooks/use-municipalities'

import { useFishingLocationTypes } from '../api/get-fishing-location-types'
import { useFishingMethods } from '../api/get-fishing-methods'
import { useSpecies } from '../api/get-species'
import { useTargetGroups } from '../api/get-target-groups'
import type { ReapCatalogs } from '../types/reap'

/**
 * Catálogos que o resumo do REAP usa para mostrar nomes no lugar de ids. Cada um chega quando
 * puder; até lá, o texto do campo é "—", como no detalhe da pesca.
 *
 * @example
 * const catalogs = useReapCatalogs()
 */
export function useReapCatalogs(): ReapCatalogs {
  return {
    locationTypes: useFishingLocationTypes().data,
    methods: useFishingMethods().data,
    municipalities: useMunicipalities().data,
    species: useSpecies().data,
    targetGroups: useTargetGroups().data,
  }
}
