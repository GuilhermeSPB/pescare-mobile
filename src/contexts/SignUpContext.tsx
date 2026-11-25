import { createContext, use, useState, type PropsWithChildren } from 'react'

import type { Municipality } from '@/types/municipality'

export type SignUpField = 'name' | 'municipality' | 'email' | 'password'

// Erro do passo do e-mail quando o servidor responde 409 (e-mail já cadastrado).
export const EMAIL_TAKEN = 'Este e-mail já tem uma conta no Pescare.'

type SignUpData = {
  name: string
  municipality: Municipality | null
  email: string
  password: string
}

type SignUpContextValue = {
  data: SignUpData
  update: (changes: Partial<SignUpData>) => void
  // Erros que voltaram do servidor, mostrados no passo do campo correspondente.
  errors: Partial<Record<SignUpField, string>>
  setError: (field: SignUpField, message: string | undefined) => void
}

const SignUpContext = createContext<SignUpContextValue | null>(null)

// Guarda as respostas enquanto a pessoa anda pelos passos do cadastro.
export function SignUpProvider({ children }: PropsWithChildren) {
  const [data, setData] = useState<SignUpData>({
    name: '',
    municipality: null,
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<SignUpContextValue['errors']>({})

  const value: SignUpContextValue = {
    data,
    update: (changes) => setData((current) => ({ ...current, ...changes })),
    errors,
    setError: (field, message) => setErrors((current) => ({ ...current, [field]: message })),
  }

  return <SignUpContext value={value}>{children}</SignUpContext>
}

export function useSignUp() {
  const value = use(SignUpContext)

  if (!value) {
    throw new Error('useSignUp precisa estar dentro de <SignUpProvider />')
  }

  return value
}
