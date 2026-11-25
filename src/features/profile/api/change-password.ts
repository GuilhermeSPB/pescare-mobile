import { useMutation } from '@tanstack/react-query'

import { api } from '@/lib/api-client'

import type { ChangePasswordInput } from '../types/profile-update'

/**
 * Troca a senha do pescador logado (PATCH /users/me/password). A API confere a senha de hoje e
 * responde 400, sem `issues`, quando ela não confere.
 *
 * @example
 * await changePassword({ current_password: 'senha-de-hoje', new_password: 'senha-nova' })
 */
export const changePassword = async (input: ChangePasswordInput): Promise<void> => {
  await api.patch('/users/me/password', input)
}

/**
 * Mutação de trocar a senha. Não há consulta para reler, e o login de agora continua valendo:
 * o token não depende da senha.
 *
 * @example
 * const changePasswordMutation = useChangePassword()
 * await changePasswordMutation.mutateAsync(input)
 */
export const useChangePassword = () => useMutation({ mutationFn: changePassword })
