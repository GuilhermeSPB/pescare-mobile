import { queryOptions, useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api-client'

import type { Species } from '../types/catalogs'

/**
 * Lista todas as espécies, ativas e inativas (GET /species). O filtro por situação é feito no formulário.
 *
 * @example
 * const species = await getSpecies()
 */
export const getSpecies = async (): Promise<Species[]> => {
  const { data } = await api.get<Species[]>('/species')

  return data
}

/**
 * Query options da lista de espécies.
 *
 * @example
 * queryClient.invalidateQueries({ queryKey: getSpeciesQueryOptions().queryKey })
 */
export const getSpeciesQueryOptions = () =>
  queryOptions({ queryKey: ['species'], queryFn: getSpecies })

/**
 * Espécies como estado do servidor.
 *
 * @example
 * const speciesQuery = useSpecies()
 */
export const useSpecies = () => useQuery(getSpeciesQueryOptions())
