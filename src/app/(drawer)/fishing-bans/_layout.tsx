import { Stack } from 'expo-router'

import { theme } from '@/theme/theme'

// Defesos: a lista é a primeira tela e o detalhe abre por cima dela, com o voltar do sistema.
export default function FishingBansLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    />
  )
}
