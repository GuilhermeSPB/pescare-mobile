import { queryOptions, useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api-client'

import type { FishingLocationType } from '../types/catalogs'

/**
 * Lista todos os tipos de local, ativos e inativos, com o ambiente de cada um
 * (GET /fishing-location-types).
 *
 * @example
 * const locationTypes = await getFishingLocationTypes()
 */
export const getFishingLocationTypes = async (): Promise<FishingLocationType[]> => {
  const { data } = await api.get<FishingLocationType[]>('/fishing-location-types')

  return data
}

/**
 * Query options dos tipos de local.
 *
 * @example
 * queryClient.invalidateQueries({ queryKey: getFishingLocationTypesQueryOptions().queryKey })
 */
export const getFishingLocationTypesQueryOptions = () =>
  queryOptions({ queryKey: ['fishing-location-types'], queryFn: getFishingLocationTypes })

/**
 * Tipos de local como estado do servidor.
 *
 * @example
 * const locationTypesQuery = useFishingLocationTypes()
 */
export const useFishingLocationTypes = () => useQuery(getFishingLocationTypesQueryOptions())
