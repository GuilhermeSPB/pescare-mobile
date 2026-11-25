import { ApiError } from '@/lib/api-client'

const SAVE_FAILED = 'Algo deu errado. Tente de novo em alguns minutos.'

/**
 * Mensagem da API para um campo, quando ela recusou aquele campo (`issues` do erro 400).
 *
 * @param path nome do campo como a API recebe, ex.: `'name'` ou `'new_password'`
 * @example
 * fieldIssueMessage(error, 'name') // 'Informe o nome'
 */
export function fieldIssueMessage(error: unknown, path: string): string | undefined {
  if (!(error instanceof ApiError)) return undefined

  return error.issues.find((issue) => issue.path === path)?.message
}

/**
 * Mensagem do aviso geral do formulário quando salvar falha: a da API, ou uma genérica quando
 * o erro não veio dela.
 *
 * @example
 * setFormError(saveFailedMessage(error))
 */
export function saveFailedMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : SAVE_FAILED
}
