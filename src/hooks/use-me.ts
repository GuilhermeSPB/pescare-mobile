import { queryOptions, useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api-client'
import type { User } from '@/types/user'

/**
 * Dados do pescador logado (GET /users/me). A fonte da verdade é o servidor: o app não guarda o usuário.
 *
 * @example
 * const user = await getMe()
 */
export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>('/users/me')

  return data
}

/**
 * Query options de "eu", com a chave que as telas usam para reler os dados.
 *
 * @example
 * queryClient.invalidateQueries({ queryKey: getMeQueryOptions().queryKey })
 */
export const getMeQueryOptions = () => queryOptions({ queryKey: ['users', 'me'], queryFn: getMe })

/**
 * Dados do pescador logado como estado do servidor.
 *
 * @example
 * const meQuery = useMe()
 */
export function useMe() {
  return useQuery(getMeQueryOptions())
}
