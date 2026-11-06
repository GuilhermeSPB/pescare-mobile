import { Stack } from 'expo-router'

import { SignUpProvider } from '@/contexts/SignUpContext'
import { theme } from '@/theme/theme'

// Cada passo é uma rota: o "voltar" do sistema (botão, gesto) volta um passo.
export default function SignUpLayout() {
  return (
    <SignUpProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.surface } }} />
    </SignUpProvider>
  )
}
