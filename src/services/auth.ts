import { api } from '@/lib/api-client'
import type { Session, User } from '@/types/user'

export type SignUpPayload = {
  name: string
  email: string
  password: string
  fk_municipality_ibge_code: string
}

// O cadastro público sempre cria um pescador (FISHER) e não devolve token.
export async function signUp(payload: SignUpPayload) {
  const { data } = await api.post<User>('/auth/sign-up', payload)

  return data
}

export async function signIn(email: string, password: string) {
  const { data } = await api.post<Session>('/auth/sign-in', { email, password })

  return data
}
