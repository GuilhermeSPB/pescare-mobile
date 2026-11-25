import { queryOptions, useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api-client'

import type { NamedCatalogItem } from '../types/catalogs'

/**
 * Lista todos os grupos alvo, ativos e inativos (GET /target-groups). O resumo do REAP usa o nome
 * do grupo de cada espécie pescada, inclusive de grupo já desativado.
 *
 * @example
 * const targetGroups = await getTargetGroups()
 */
export const getTargetGroups = async (): Promise<NamedCatalogItem[]> => {
  const { data } = await api.get<NamedCatalogItem[]>('/target-groups')

  return data
}

/**
 * Query options dos grupos alvo.
 *
 * @example
 * queryClient.invalidateQueries({ queryKey: getTargetGroupsQueryOptions().queryKey })
 */
export const getTargetGroupsQueryOptions = () =>
  queryOptions({ queryKey: ['target-groups'], queryFn: getTargetGroups })

/**
 * Grupos alvo como estado do servidor.
 *
 * @example
 * const targetGroupsQuery = useTargetGroups()
 */
export const useTargetGroups = () => useQuery(getTargetGroupsQueryOptions())
