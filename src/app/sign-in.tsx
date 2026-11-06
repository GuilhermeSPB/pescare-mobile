import { router, useLocalSearchParams } from 'expo-router'
import { useRef, useState } from 'react'
import type { TextInput } from 'react-native'

import { Button } from '@/components/Button'
import { FormMessage } from '@/components/FormMessage'
import { FormScreen } from '@/components/FormScreen'
import { IconButton } from '@/components/IconButton'
import { TextField } from '@/components/TextField'
import { useAuth } from '@/contexts/AuthContext'
import { ApiError } from '@/lib/api-client'
import { isValidEmail } from '@/utils/text'

function signInErrorMessage(error: unknown) {
  if (!(error instanceof ApiError)) return 'Algo deu errado. Tente de novo em alguns minutos.'
  if (error.status === 401) return 'E-mail ou senha errados. Confira e tente de novo.'
  if (error.status === 403) return 'Sua conta está desativada. Fale com a equipe Pescare.'
  return error.message
}

export default function SignInScreen() {
  const { signIn } = useAuth()
  const params = useLocalSearchParams<{ email?: string; created?: string }>()
  const [email, setEmail] = useState(params.email ?? '')
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [formError, setFormError] = useState<string>()
  const [submitting, setSubmitting] = useState(false)
  const passwordRef = useRef<TextInput>(null)

  async function submit() {
    // A tecla "concluir" do teclado ainda dispara enquanto o botão mostra o carregando.
    if (submitting) return

    const nextErrors = {
      email: !email.trim()
        ? 'Escreva seu e-mail.'
        : !isValidEmail(email)
          ? 'Esse e-mail parece incompleto. Ele precisa ter @ e ponto.'
          : undefined,
      password: password ? undefined : 'Escreva sua senha.',
    }

    setErrors(nextErrors)
    if (nextErrors.email || nextErrors.password) return

    setSubmitting(true)
    setFormError(undefined)

    try {
      await signIn(email.trim().toLowerCase(), password)
      // Com a sessão salva, a guarda do layout raiz leva para a Home.
    } catch (error) {
      setFormError(signInErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <FormScreen
      appBarTitle="Entrar"
      headline="Entre na sua conta"
      footer={
        <>
          <Button label="Entrar" onPress={submit} loading={submitting} />
          <Button variant="text" label="Ainda não tenho conta" onPress={() => router.replace('/sign-up')} />
        </>
      }
    >
      {params.created === '1' && (
        <FormMessage tone="success">Sua conta foi criada. Agora entre com seu e-mail e senha.</FormMessage>
      )}
      <TextField
        label="E-mail"
        value={email}
        onChangeText={(text) => {
          setEmail(text)
          setErrors((current) => ({ ...current, email: undefined }))
        }}
        error={errors.email}
        autoFocus={!params.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />
      <TextField
        ref={passwordRef}
        label="Senha"
        value={password}
        onChangeText={(text) => {
          setPassword(text)
          setErrors((current) => ({ ...current, password: undefined }))
        }}
        error={errors.password}
        autoFocus={!!params.email}
        secureTextEntry={!visible}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="current-password"
        textContentType="password"
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
