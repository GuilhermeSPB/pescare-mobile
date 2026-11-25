import { Stack } from 'expo-router'

import { theme } from '@/theme/theme'

// Comunicados: a lista é a primeira tela e a leitura abre por cima dela, com o voltar do sistema.
export default function AlertsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    />
  )
}
