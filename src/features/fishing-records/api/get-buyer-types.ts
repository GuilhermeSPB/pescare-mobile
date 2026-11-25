import { queryOptions, useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api-client'

import type { NamedCatalogItem } from '../types/catalogs'

/**
 * Lista todos os tipos de comprador, ativos e inativos (GET /buyer-types).
 *
 * @example
 * const buyerTypes = await getBuyerTypes()
 */
export const getBuyerTypes = async (): Promise<NamedCatalogItem[]> => {
  const { data } = await api.get<NamedCatalogItem[]>('/buyer-types')

  return data
}

/**
 * Query options dos tipos de comprador.
 *
 * @example
 * queryClient.invalidateQueries({ queryKey: getBuyerTypesQueryOptions().queryKey })
 */
export const getBuyerTypesQueryOptions = () =>
  queryOptions({ queryKey: ['buyer-types'], queryFn: getBuyerTypes })

/**
 * Tipos de comprador como estado do servidor.
 *
 * @example
 * const buyerTypesQuery = useBuyerTypes()
 */
export const useBuyerTypes = () => useQuery(getBuyerTypesQueryOptions())
