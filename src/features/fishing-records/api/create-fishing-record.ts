import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api-client'

import type { CreateFishingRecordInput } from '../types/fishing-record'

/**
 * Grava a pesca com as capturas e, se houver, a venda (POST /fishing-records).
 *
 * @example
 * const record = await createFishingRecord(input) // input vem de buildFishingRecordInput
 */
export const createFishingRecord = async (input: CreateFishingRecordInput) => {
  const { data } = await api.post<{ id: number }>('/fishing-records', input)

  return data
}

/**
 * Mutação de gravar pesca. Ao gravar, as listas de pescas são relidas.
 *
 * @example
 * const createMutation = useCreateFishingRecord()
 * createMutation.mutate(input)
 */
export const useCreateFishingRecord = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createFishingRecord,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fishing-records'] }),
  })
}
