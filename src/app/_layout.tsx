import { QueryClientProvider } from '@tanstack/react-query'
import { SplashScreen, Stack } from 'expo-router'
import { useEffect } from 'react'

import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { queryClient } from '@/lib/react-query'
import { ThemeProvider, theme } from '@/theme/theme'

// A splash nativa (só o azul da marca) fica até a sessão salva ser lida;
// assim quem já entrou vai direto para as abas, sem espera artificial.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SplashScreenController />
          <RootNavigator />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

function SplashScreenController() {
  const { isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) SplashScreen.hide()
  }, [isLoading])

  return null
}

function RootNavigator() {
  const { session } = useAuth()

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.surface },
      }}
    >
      <Stack.Protected guard={!session}>
        <Stack.Screen
          name="index"
          options={{ contentStyle: { backgroundColor: theme.colors.primary } }}
        />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(drawer)" />
        <Stack.Screen name="fishing-records" />
        <Stack.Screen name="account" />
      </Stack.Protected>
    </Stack>
  )
}
