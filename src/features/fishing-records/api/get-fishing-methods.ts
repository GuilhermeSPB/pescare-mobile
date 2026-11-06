import { queryOptions, useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api-client'

import type { NamedCatalogItem } from '../types/catalogs'

/**
 * Lista todos os métodos de pesca, ativos e inativos (GET /fishing-methods).
 *
 * @example
 * const methods = await getFishingMethods()
 */
export const getFishingMethods = async (): Promise<NamedCatalogItem[]> => {
  const { data } = await api.get<NamedCatalogItem[]>('/fishing-methods')

  return data
}

/**
 * Query options dos métodos de pesca.
 *
 * @example
 * queryClient.invalidateQueries({ queryKey: getFishingMethodsQueryOptions().queryKey })
 */
export const getFishingMethodsQueryOptions = () =>
  queryOptions({ queryKey: ['fishing-methods'], queryFn: getFishingMethods })

/**
 * Métodos de pesca como estado do servidor.
 *
 * @example
 * const methodsQuery = useFishingMethods()
 */
export const useFishingMethods = () => useQuery(getFishingMethodsQueryOptions())
