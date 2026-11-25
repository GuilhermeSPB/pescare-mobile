import { router } from 'expo-router'
import { useState } from 'react'

import { Button } from '@/components/Button'
import { FormScreen } from '@/components/FormScreen'
import { TextField } from '@/components/TextField'
import { useSignUp } from '@/contexts/SignUpContext'

export default function NameStep() {
  const { data, update, errors, setError } = useSignUp()
  const [error, setLocalError] = useState<string>()

  function next() {
    const name = data.name.trim()

    if (!name) {
      setLocalError('Escreva seu nome para continuar.')
      return
    }

    update({ name })
    router.push('/sign-up/municipality')
  }

  return (
    <FormScreen
      appBarTitle="Criar conta"
      progress={{ step: 1, total: 4 }}
      headline="Qual é o seu nome?"
      example="Exemplo: Maria das Graças Silva"
      footer={<Button label="Continuar" onPress={next} />}
    >
      <TextField
        label="Nome completo"
        value={data.name}
        onChangeText={(name) => {
          update({ name })
          setLocalError(undefined)
          setError('name', undefined)
        }}
        error={error ?? errors.name}
        autoFocus
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={next}
      />
    </FormScreen>
  )
}
