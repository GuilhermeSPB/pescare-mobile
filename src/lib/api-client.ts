import axios, { isAxiosError } from 'axios'

import { env } from '@/config/env'

// O 401 do próprio login é "credenciais inválidas", não sessão expirada.
const SIGN_IN_PATH = '/auth/sign-in'
const TIMEOUT_MS = 15000

const NETWORK_MESSAGE =
  'Não foi possível falar com o servidor. Confira sua internet e tente de novo.'
const GENERIC_MESSAGE = 'Algo deu errado. Tente de novo em alguns minutos.'

export type ApiIssue = {
  path: string
  message: string
}

// Erro único da API. `status` é 0 quando a requisição nem chegou ao servidor (sem internet, timeout).
export class ApiError extends Error {
  status: number
  issues: ApiIssue[]

  constructor(status: number, message: string, issues: ApiIssue[] = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.issues = issues
  }
}

type AuthHooks = {
  getToken: () => string | null
  onUnauthorized: () => void
}

// O auth fica fora do cliente: o AuthProvider registra como ler o token e o que fazer no 401.
let authHooks: AuthHooks = {
  getToken: () => null,
  onUnauthorized: () => {},
}

/**
 * Registra como o cliente lê o JWT e o que faz quando a sessão cai.
 *
 * @example
 * setApiAuthHooks({ getToken: () => session?.token ?? null, onUnauthorized: signOut })
 */
export function setApiAuthHooks(hooks: AuthHooks) {
  authHooks = hooks
}

/**
 * Instância única do axios para a API do Pescare (`/api/v1`). Envia o JWT como
 * `Authorization: Bearer` e devolve `ApiError` em qualquer falha.
 *
 * @example
 * const { data } = await api.get<Municipality[]>('/municipalities')
 */
export const api = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: TIMEOUT_MS,
  headers: { Accept: 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = authHooks.getToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

function toApiError(error: unknown): ApiError {
  if (!isAxiosError(error) || !error.response) {
    return new ApiError(0, NETWORK_MESSAGE)
  }

  const body = error.response.data as { message?: string; issues?: ApiIssue[] } | undefined

  return new ApiError(error.response.status, body?.message ?? GENERIC_MESSAGE, body?.issues ?? [])
}

function isExpiredSession(error: unknown, apiError: ApiError): boolean {
  return apiError.status === 401 && !(isAxiosError(error) && error.config?.url === SIGN_IN_PATH)
}

api.interceptors.response.use(undefined, (error: unknown) => {
  const apiError = toApiError(error)

  if (isExpiredSession(error, apiError)) {
    console.warn('[api] sessão expirada ou inválida — encerrando a sessão')
    authHooks.onUnauthorized()
  }

  return Promise.reject(apiError)
})
