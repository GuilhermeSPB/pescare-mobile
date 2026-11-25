import { queryOptions, useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api-client'

import type { AlertListItem } from '../types/alert'

/**
 * Comunicados que o pescador pode ler, do mais novo ao mais antigo (GET /alerts). A API já
 * filtra: só os publicados que valem para todos ou para a cidade do pescador.
 *
 * @example
 * const alerts = await getAlerts()
 */
export const getAlerts = async (): Promise<AlertListItem[]> => {
  const { data } = await api.get<AlertListItem[]>('/alerts')

  return data
}

/**
 * Query options da lista de comunicados. A chave também é o prefixo da leitura
 * (`['alerts', id]`): invalidar a lista invalida as leituras.
 *
 * @example
 * queryClient.invalidateQueries({ queryKey: getAlertsQueryOptions().queryKey })
 */
export const getAlertsQueryOptions = () =>
  queryOptions({ queryKey: ['alerts'], queryFn: getAlerts })

/**
 * Lista de comunicados como estado do servidor.
 *
 * @example
 * const alertsQuery = useAlerts()
 */
export const useAlerts = () => useQuery(getAlertsQueryOptions())
