import { createContext, use, useLayoutEffect, useMemo, type PropsWithChildren } from 'react'

import { useStorageState } from '@/hooks/useStorageState'
import { setApiAuthHooks } from '@/lib/api-client'
import { queryClient } from '@/lib/react-query'
import * as authService from '@/services/auth'
import type { Session } from '@/types/user'

// A conta foi criada, mas o login automático logo depois falhou.
export class AccountCreatedError extends Error {
  constructor() {
    super('Conta criada. Entre com seu e-mail e senha.')
    this.name = 'AccountCreatedError'
  }
}

type AuthContextValue = {
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (payload: authService.SignUpPayload) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function parseSession(value: string | null): Session | null {
  if (!value) return null

  try {
    return JSON.parse(value) as Session
  } catch {
    return null
  }
}

// Toda troca de sessão (entrar, sair, sessão expirada) apaga o cache das consultas. As chaves
// (`['fishing-records']`, `['users', 'me']`) não levam o id do pescador: sem limpar, quem entra
// logo depois de outra conta vê as pescas e o município dela até o cache vencer. Mesma regra
// do painel web (`use-sign-out.ts`).
function replaceSession(setStored: (value: string | null) => void, value: string | null) {
  queryClient.clear()
  setStored(value)
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [[isLoading, stored], setStored] = useStorageState('session')

  const value = useMemo<AuthContextValue>(() => {
    async function signIn(email: string, password: string) {
      const session = await authService.signIn(email, password)
      replaceSession(setStored, JSON.stringify(session))
    }

    return {
      session: parseSession(stored),
      isLoading,
      signIn,
      // O backend não devolve token no cadastro: cria a conta e já entra com ela.
      async signUp(payload) {
        await authService.signUp(payload)

        try {
          await signIn(payload.email, payload.password)
        } catch {
          throw new AccountCreatedError()
        }
      },
      signOut() {
        replaceSession(setStored, null)
      },
    }
  }, [isLoading, stored, setStored])

  // Antes dos efeitos dos filhos: as primeiras consultas já saem com o token.
  useLayoutEffect(() => {
    setApiAuthHooks({
      getToken: () => parseSession(stored)?.token ?? null,
      // Sem sessão, a guarda do layout raiz troca as telas para o login.
      onUnauthorized: () => replaceSession(setStored, null),
    })
  }, [stored, setStored])

  return <AuthContext value={value}>{children}</AuthContext>
}

export function useAuth() {
  const value = use(AuthContext)

  if (!value) {
    throw new Error('useAuth precisa estar dentro de <AuthProvider />')
  }

  return value
}
