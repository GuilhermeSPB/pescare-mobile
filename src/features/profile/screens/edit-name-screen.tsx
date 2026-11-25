import { router } from 'expo-router'
import { useState } from 'react'

import { Button } from '@/components/Button'
import { FormMessage } from '@/components/FormMessage'
import { FormScreen } from '@/components/FormScreen'
import { TextField } from '@/components/TextField'
import { useMe } from '@/hooks/use-me'

import { useUpdateMe } from '../api/update-me'
import { ProfileFormFallback } from '../components/profile-form-fallback'
import { fieldIssueMessage, saveFailedMessage } from '../utils/profile-errors'

const APP_BAR_TITLE = 'Mudar nome'
const HEADLINE = 'Qual é o seu nome?'

type EditNameFormProps = {
  currentName: string
}

function EditNameForm({ currentName }: EditNameFormProps) {
  const updateMeMutation = useUpdateMe()
  const [name, setName] = useState(currentName)
  const [nameError, setNameError] = useState<string>()
  const [formError, setFormError] = useState<string>()

  async function handleSave() {
    // A tecla "concluir" do teclado ainda dispara enquanto o botão mostra o carregando.
    if (updateMeMutation.isPending) return

    const trimmedName = name.trim()

    if (!trimmedName) {
      setNameError('Escreva seu nome para salvar.')
      return
    }

    if (trimmedName === currentName) {
      router.back()
      return
    }

    setFormError(undefined)

    try {
      await updateMeMutation.mutateAsync({ name: trimmedName })
      // O Perfil já mostra o nome novo: a mutação só termina depois de reler os dados.
      router.back()
    } catch (error) {
      const issueMessage = fieldIssueMessage(error, 'name')

      // Nome recusado pela API é engano do pescador, não falha: só o que sobra vai para o log.
      if (issueMessage) {
        setNameError(issueMessage)
        return
      }

      console.error('[profile] Erro ao salvar o nome:', error)
      setFormError(saveFailedMessage(error))
    }
  }

  return (
    <FormScreen
      appBarTitle={APP_BAR_TITLE}
      headline={HEADLINE}
      example="Exemplo: Maria das Graças Silva"
      footer={<Button label="Salvar" onPress={handleSave} loading={updateMeMutation.isPending} />}
    >
      <TextField
        label="Nome completo"
        value={name}
        onChangeText={(text) => {
          setName(text)
          setNameError(undefined)
        }}
        error={nameError}
        autoFocus
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        returnKeyType="done"
        onSubmitEditing={handleSave}
      />
      {formError && <FormMessage tone="error">{formError}</FormMessage>}
    </FormScreen>
  )
}

// Muda o nome do pescador. O campo já vem com o nome de hoje, para ele só corrigir.
export function EditNameScreen() {
  const meQuery = useMe()

  if (!meQuery.data) {
    return (
      <ProfileFormFallback
        appBarTitle={APP_BAR_TITLE}
        headline={HEADLINE}
        isMeError={meQuery.isError}
        meError={meQuery.error}
        onRetry={() => meQuery.refetch()}
      />
    )
  }

  return <EditNameForm currentName={meQuery.data.name} />
}
