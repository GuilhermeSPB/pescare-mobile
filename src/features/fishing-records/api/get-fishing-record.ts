import { queryOptions, useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api-client'

import type { FishingRecord } from '../types/fishing-record'

/**
 * Uma pesca do pescador logado (GET /fishing-records/:id). Pesca de outro pescador responde 404.
 *
 * @example
 * const record = await getFishingRecord(12)
 */
export const getFishingRecord = async (recordId: number): Promise<FishingRecord> => {
  const { data } = await api.get<FishingRecord>(`/fishing-records/${recordId}`)

  return data
}

/**
 * Query options de uma pesca. A chave começa com `['fishing-records']`, então gravar uma
 * pesca também relê esta.
 *
 * @example
 * queryClient.prefetchQuery(getFishingRecordQueryOptions(12))
 */
export const getFishingRecordQueryOptions = (recordId: number) =>
  queryOptions({
    queryKey: ['fishing-records', recordId],
    queryFn: () => getFishingRecord(recordId),
  })

/**
 * Uma pesca como estado do servidor.
 *
 * @example
 * const recordQuery = useFishingRecord(12)
 */
export const useFishingRecord = (recordId: number) =>
  useQuery(getFishingRecordQueryOptions(recordId))
