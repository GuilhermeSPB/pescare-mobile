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
 * Mutação de gravar pesca. Ao gravar, as listas de pescas e os indicadores são relidos.
 *
 * @example
 * const createMutation = useCreateFishingRecord()
 * createMutation.mutate(input)
 */
export const useCreateFishingRecord = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createFishingRecord,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['fishing-records'] }),
        // Chave da feature production (get-production-indicators.ts), escrita aqui porque as
        // features não se importam. Sem isso, Minha produção mostra números velhos por até 1 min.
        queryClient.invalidateQueries({ queryKey: ['production-indicators'] }),
      ]),
  })
}
