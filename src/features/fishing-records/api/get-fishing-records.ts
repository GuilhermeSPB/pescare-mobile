import { queryOptions, useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api-client'

import type { FishingRecord } from '../types/fishing-record'

/**
 * Pescas do pescador logado, da mais recente para a mais antiga (GET /fishing-records).
 *
 * @example
 * const records = await getFishingRecords()
 */
export const getFishingRecords = async (): Promise<FishingRecord[]> => {
  const { data } = await api.get<FishingRecord[]>('/fishing-records')

  return data
}

/**
 * Query options da lista de pescas. Gravar uma pesca invalida esta chave.
 *
 * @example
 * queryClient.invalidateQueries({ queryKey: getFishingRecordsQueryOptions().queryKey })
 */
export const getFishingRecordsQueryOptions = () =>
  queryOptions({ queryKey: ['fishing-records'], queryFn: getFishingRecords })

/**
 * Pescas do pescador como estado do servidor.
 *
 * @example
 * const recordsQuery = useFishingRecords()
 */
export const useFishingRecords = () => useQuery(getFishingRecordsQueryOptions())
