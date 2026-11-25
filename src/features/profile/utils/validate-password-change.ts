import { ApiError } from '@/lib/api-client'
import { shortPasswordMessage } from '@/utils/password'

import { fieldIssueMessage } from './profile-errors'

export type PasswordChangeErrors = {
  currentPassword?: string
  newPassword?: string
}

function newPasswordError(currentPassword: string, newPassword: string): string | undefined {
  if (!newPassword) return 'Crie a senha nova.'
  if (newPassword === currentPassword) return 'A senha nova precisa ser diferente da de hoje.'

  return shortPasswordMessage(newPassword)
}

/**
 * Confere os dois campos da troca de senha antes de enviar, com as mesmas regras da API.
 *
 * @returns a mensagem de cada campo com problema; um objeto sem mensagens quando está tudo certo
 * @example
 * validatePasswordChange('', 'abc') // { currentPassword: 'Escreva a senha...', newPassword: 'A senha precisa...' }
 */
export function validatePasswordChange(
  currentPassword: string,
  newPassword: string,
): PasswordChangeErrors {
  return {
    currentPassword: currentPassword ? undefined : 'Escreva a senha que você usa hoje.',
    newPassword: newPasswordError(currentPassword, newPassword),
  }
}

/**
 * Traduz a recusa da API para os campos da troca de senha. A senha de hoje errada volta como
 * 400 sem `issues` ("Senha atual incorreta").
 *
 * @returns as mensagens por campo, ou `null` quando o erro não é de nenhum campo
 * @example
 * passwordChangeFieldErrors(error) // { currentPassword: 'Essa não é a senha...' }
 */
export function passwordChangeFieldErrors(error: unknown): PasswordChangeErrors | null {
  if (!(error instanceof ApiError) || error.status !== 400) return null

  if (error.issues.length === 0) {
    return { currentPassword: 'Essa não é a senha que você usa hoje. Confira e tente de novo.' }
  }

  const fieldErrors = {
    currentPassword: fieldIssueMessage(error, 'current_password'),
    newPassword: fieldIssueMessage(error, 'new_password'),
  }

  return fieldErrors.currentPassword || fieldErrors.newPassword ? fieldErrors : null
}
