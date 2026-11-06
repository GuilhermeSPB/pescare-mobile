import { router } from 'expo-router'
import { useState } from 'react'

import { Button } from '@/components/Button'
import { FormScreen } from '@/components/FormScreen'
import { TextField } from '@/components/TextField'
import { EMAIL_TAKEN, useSignUp } from '@/contexts/SignUpContext'
import { isValidEmail } from '@/utils/text'

export default function EmailStep() {
  const { data, update, errors, setError } = useSignUp()
  const [error, setLocalError] = useState<string>()
  const shownError = error ?? errors.email

  function next() {
    const email = data.email.trim()

    if (!email) {
      setLocalError('Escreva seu e-mail para continuar.')
      return
    }

    if (!isValidEmail(email)) {
      setLocalError('Esse e-mail parece incompleto. Ele precisa ter @ e ponto, como maria@gmail.com.')
      return
    }

    update({ email })
    router.push('/sign-up/password')
  }

  return (
    <FormScreen
      appBarTitle="Criar conta"
      progress={{ step: 3, total: 4 }}
      headline="Qual é o seu e-mail?"
      example="Exemplo: maria@gmail.com"
      footer={
        <>
          <Button label="Continuar" onPress={next} />
          {shownError === EMAIL_TAKEN && (
            <Button
              variant="text"
              label="Entrar com este e-mail"
              onPress={() => router.replace({ pathname: '/sign-in', params: { email: data.email.trim() } })}
            />
          )}
        </>
      }
    >
      <TextField
        label="E-mail"
        value={data.email}
        onChangeText={(email) => {
          update({ email })
          setLocalError(undefined)
          setError('email', undefined)
        }}
        error={shownError}
        helper="Você vai usar este e-mail para entrar no app."
        autoFocus
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={next}
      />
    </FormScreen>
  )
}
