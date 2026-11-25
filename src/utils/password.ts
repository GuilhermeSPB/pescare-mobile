// O mesmo mínimo do backend para senha nova (cadastro e troca de senha).
export const MIN_PASSWORD_LENGTH = 8

export const NEW_PASSWORD_HELPER = `Use pelo menos ${MIN_PASSWORD_LENGTH} letras ou números.`

/**
 * Explica quanto falta numa senha nova curta demais.
 *
 * @returns a mensagem para mostrar no campo, ou `undefined` quando a senha já tem o tamanho mínimo
 * @example
 * shortPasswordMessage('abc') // 'A senha precisa ter pelo menos 8 letras ou números. Faltam 5.'
 */
export function shortPasswordMessage(password: string): string | undefined {
  const missing = MIN_PASSWORD_LENGTH - password.length

  if (missing <= 0) return undefined

  const missingText = missing === 1 ? 'Falta 1' : `Faltam ${missing}`

  return `A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} letras ou números. ${missingText}.`
}
