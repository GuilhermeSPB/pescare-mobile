import { useMutation, useQueryClient } from '@tanstack/react-query'

import { getMeQueryOptions } from '@/hooks/use-me'
import { api } from '@/lib/api-client'
import type { User } from '@/types/user'

import type { UpdateMeInput } from '../types/profile-update'

/**
 * Muda o nome, a cidade ou os dois do pescador logado (PATCH /users/me).
 *
 * @example
 * const user = await updateMe({ name: 'Maria das Graças Silva' })
 */
export const updateMe = async (input: UpdateMeInput): Promise<User> => {
  const { data } = await api.patch<User>('/users/me', input)

  return data
}

/**
 * Mutação de mudar os dados do perfil. Ao salvar, os dados do pescador são relidos e, se a
 * cidade mudou, os comunicados também.
 *
 * @example
 * const updateMeMutation = useUpdateMe()
 * await updateMeMutation.mutateAsync({ fk_municipality_ibge_code: '1501402' })
 */
export const useUpdateMe = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateMe,
    onSuccess: (_user, input) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: getMeQueryOptions().queryKey }),
        // Chave da feature alerts (get-alerts.ts), escrita aqui porque as features não se
        // importam. A API filtra os comunicados pela cidade do pescador, mas a chave não leva a
        // cidade: sem isso, a lista mostra os da cidade antiga até o cache vencer. Os defesos não
        // precisam disso, porque a chave deles já leva o código da cidade.
        input.fk_municipality_ibge_code
          ? queryClient.invalidateQueries({ queryKey: ['alerts'] })
          : undefined,
      ]),
  })
}
