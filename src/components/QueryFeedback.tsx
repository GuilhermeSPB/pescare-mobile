import { ActivityIndicator } from 'react-native'
import { useTheme } from 'styled-components/native'

import { ApiError } from '@/lib/api-client'

import { Button } from './Button'
import { FormMessage } from './FormMessage'

type QueryFeedbackProps = {
  isPending: boolean
  isError: boolean
  error: unknown
  onRetry: () => void
}

const LOAD_ERROR = 'Não foi possível carregar. Confira sua internet e tente de novo.'

// Mostra o carregamento ou o erro de uma consulta; sem nada para mostrar, não aparece.
export function QueryFeedback({ isPending, isError, error, onRetry }: QueryFeedbackProps) {
  const { colors } = useTheme()

  if (isError) {
    return (
      <>
        <FormMessage tone="error">
          {error instanceof ApiError ? error.message : LOAD_ERROR}
        </FormMessage>
        <Button variant="outlined" label="Tentar de novo" onPress={onRetry} />
      </>
    )
  }

  if (isPending) {
    return <ActivityIndicator color={colors.primary} accessibilityLabel="Carregando" />
  }

  return null
}
