import { router } from 'expo-router'
import { useState } from 'react'

import { Button } from '@/components/Button'
import { FormMessage } from '@/components/FormMessage'
import { FormScreen } from '@/components/FormScreen'
import { IconButton } from '@/components/IconButton'
import { TextField } from '@/components/TextField'
import { AccountCreatedError, useAuth } from '@/contexts/AuthContext'
import { EMAIL_TAKEN, useSignUp, type SignUpField } from '@/contexts/SignUpContext'
import { ApiError } from '@/lib/api-client'

const MIN_PASSWORD = 8

const STEP_ROUTES = {
  name: '/sign-up',
  municipality: '/sign-up/municipality',
  email: '/sign-up/email',
} as const

const SERVER_FIELDS: Record<string, SignUpField> = {
  name: 'name',
  email: 'email',
  password: 'password',
  fk_municipality_ibge_code: 'municipality',
}

// Descobre a qual passo pertence um erro devolvido pelo cadastro.
function fieldError(error: ApiError): { field: SignUpField; message: string } | null {
  if (error.status === 409) return { field: 'email', message: EMAIL_TAKEN }

  const issue = error.issues.find((item) => SERVER_FIELDS[item.path])
  if (issue) return { field: SERVER_FIELDS[issue.path], message: issue.message }

  if (error.status === 400 && /munic/i.test(error.message)) {
    return { field: 'municipality', message: 'Não achamos essa cidade. Escolha de novo na lista.' }
  }

  return null
}

export default function PasswordStep() {
  const { signUp } = useAuth()
  const { data, setError } = useSignUp()
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const [error, setLocalError] = useState<string>()
  const [formError, setFormError] = useState<string>()
  const [submitting, setSubmitting] = useState(false)

  const missing = MIN_PASSWORD - password.length

  async function submit() {
    // A tecla "concluir" do teclado ainda dispara enquanto o botão mostra o carregando.
    if (submitting) return

    if (missing > 0) {
      setLocalError(
        password.length === 0
          ? 'Crie uma senha para continuar.'
          : `A senha precisa ter pelo menos ${MIN_PASSWORD} letras ou números. ${missing === 1 ? 'Falta 1' : `Faltam ${missing}`}.`,
      )
      return
    }

    if (!data.municipality) {
      router.dismissTo('/sign-up/municipality')
      return
    }

    setSubmitting(true)
    setFormError(undefined)

    try {
      await signUp({
        name: data.name,
        email: data.email.toLowerCase(),
        password,
        fk_municipality_ibge_code: data.municipality.ibge_code,
      })
      // Com a sessão salva, a guarda do layout raiz leva para a Home.
    } catch (reason) {
      if (reason instanceof AccountCreatedError) {
        router.replace({ pathname: '/sign-in', params: { email: data.email, created: '1' } })
        return
      }

      if (reason instanceof ApiError) {
        const found = fieldError(reason)

        if (found && found.field !== 'password') {
          setError(found.field, found.message)
          router.dismissTo(STEP_ROUTES[found.field])
          return
        }

        if (found) setLocalError(found.message)
        else setFormError(reason.message)
        return
      }

      setFormError('Algo deu errado. Tente de novo em alguns minutos.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <FormScreen
      appBarTitle="Criar conta"
      progress={{ step: 4, total: 4 }}
      headline="Crie uma senha"
      example="Você vai usar esta senha junto com o e-mail para entrar."
      footer={<Button label="Criar conta" onPress={submit} loading={submitting} />}
    >
      <TextField
        label="Senha"
        value={password}
        onChangeText={(text) => {
          setPassword(text)
          setLocalError(undefined)
        }}
        error={error}
        helper={`Use pelo menos ${MIN_PASSWORD} letras ou números.`}
        secureTextEntry={!visible}
        autoFocus
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="done"
        onSubmitEditing={submit}
        trailing={
          <IconButton
            icon={visible ? 'visibilityOff' : 'visibility'}
            accessibilityLabel={visible ? 'Esconder senha' : 'Mostrar senha'}
            onPress={() => setVisible((current) => !current)}
          />
        }
      />
      {formError && <FormMessage tone="error">{formError}</FormMessage>}
    </FormScreen>
  )
}
