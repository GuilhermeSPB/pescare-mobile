import { router } from 'expo-router'
import { useRef, useState } from 'react'
import type { TextInput } from 'react-native'

import { Button } from '@/components/Button'
import { FormMessage } from '@/components/FormMessage'
import { FormScreen } from '@/components/FormScreen'
import { PasswordField } from '@/components/password-field'
import { NEW_PASSWORD_HELPER } from '@/utils/password'

import { useChangePassword } from '../api/change-password'
import { saveFailedMessage } from '../utils/profile-errors'
import {
  passwordChangeFieldErrors,
  validatePasswordChange,
  type PasswordChangeErrors,
} from '../utils/validate-password-change'

const APP_BAR_TITLE = 'Trocar senha'

// Sem valor para mostrar no Perfil, a confirmação fica aqui mesmo, antes de voltar.
function PasswordChanged() {
  return (
    <FormScreen
      appBarTitle={APP_BAR_TITLE}
      headline="Sua senha foi trocada"
      example="Da próxima vez que entrar no app, use a senha nova."
      footer={<Button label="Voltar para o perfil" onPress={() => router.back()} />}
    >
      {null}
    </FormScreen>
  )
}

// Troca de senha: a de hoje e a nova na mesma tela, porque a API só confere a de hoje junto
// com a nova.
export function ChangePasswordScreen() {
  const changePasswordMutation = useChangePassword()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<PasswordChangeErrors>({})
  const [formError, setFormError] = useState<string>()
  const newPasswordRef = useRef<TextInput>(null)

  async function handleSave() {
    if (changePasswordMutation.isPending) return

    const nextErrors = validatePasswordChange(currentPassword, newPassword)

    setFieldErrors(nextErrors)
    if (nextErrors.currentPassword || nextErrors.newPassword) return

    setFormError(undefined)

    try {
      await changePasswordMutation.mutateAsync({
        current_password: currentPassword,
        new_password: newPassword,
      })
    } catch (error) {
      const serverErrors = passwordChangeFieldErrors(error)

      // Senha de hoje errada é engano do pescador, não falha: só o que sobra vai para o log.
      if (serverErrors) {
        setFieldErrors(serverErrors)
        return
      }

      console.error('[profile] Erro ao trocar a senha:', error)
      setFormError(saveFailedMessage(error))
    }
  }

  if (changePasswordMutation.isSuccess) return <PasswordChanged />

  return (
    <FormScreen
      appBarTitle={APP_BAR_TITLE}
      headline="Troque sua senha"
      example="Primeiro escreva a senha que você usa hoje. Depois, crie a nova."
      footer={
        <Button
          label="Trocar senha"
          onPress={handleSave}
          loading={changePasswordMutation.isPending}
        />
      }
    >
      <PasswordField
        label="Senha de hoje"
        value={currentPassword}
        onChangeText={(text) => {
          setCurrentPassword(text)
          setFieldErrors((current) => ({ ...current, currentPassword: undefined }))
        }}
        error={fieldErrors.currentPassword}
        autoFocus
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => newPasswordRef.current?.focus()}
      />
      <PasswordField
        ref={newPasswordRef}
        label="Senha nova"
        value={newPassword}
        onChangeText={(text) => {
          setNewPassword(text)
          setFieldErrors((current) => ({ ...current, newPassword: undefined }))
        }}
        error={fieldErrors.newPassword}
        helper={NEW_PASSWORD_HELPER}
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="done"
        onSubmitEditing={handleSave}
      />
      {formError && <FormMessage tone="error">{formError}</FormMessage>}
    </FormScreen>
  )
}
