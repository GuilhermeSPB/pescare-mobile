import { Stack } from 'expo-router'

import { theme } from '@/theme/theme'

// Telas de mudar os dados da conta, abertas pelo Perfil. Ficam fora do menu lateral, como o
// fluxo de registro de pesca, para o "voltar" do sistema voltar ao Perfil.
export default function AccountLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.surface },
      }}
    />
  )
}
