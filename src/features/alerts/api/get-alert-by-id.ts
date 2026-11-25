import { queryOptions, useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api-client'

import type { AlertDetails } from '../types/alert'

/**
 * Um comunicado inteiro (GET /alerts/:id). Responde 404 quando ele saiu do ar (arquivado) ou
 * não vale para a cidade do pescador.
 *
 * @example
 * const alert = await getAlertById(12)
 */
export const getAlertById = async (alertId: number): Promise<AlertDetails> => {
  const { data } = await api.get<AlertDetails>(`/alerts/${alertId}`)

  return data
}

/**
 * Query options de um comunicado, sob o prefixo `['alerts']` da lista.
 *
 * @example
 * queryClient.invalidateQueries({ queryKey: getAlertByIdQueryOptions(12).queryKey })
 */
export const getAlertByIdQueryOptions = (alertId: number) =>
  queryOptions({ queryKey: ['alerts', alertId], queryFn: () => getAlertById(alertId) })

/**
 * Um comunicado como estado do servidor. Lê da API, e não do cache da lista, para o texto
 * estar atual e um comunicado arquivado aparecer como tal.
 *
 * @example
 * const alertQuery = useAlertById(alertId)
 */
export const useAlertById = (alertId: number) => useQuery(getAlertByIdQueryOptions(alertId))
