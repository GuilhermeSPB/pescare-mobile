import { focusManager, QueryClient, onlineManager } from '@tanstack/react-query'
import NetInfo from '@react-native-community/netinfo'
import { AppState, type AppStateStatus } from 'react-native'

// React Native não tem `window.focus` nem `navigator.onLine`: o estado do app e da rede
// vêm do sistema, para os dados se atualizarem ao voltar ao app e ao reconectar.
focusManager.setEventListener((handleFocus) => {
  const subscription = AppState.addEventListener('change', (status: AppStateStatus) => {
    handleFocus(status === 'active')
  })

  return () => subscription.remove()
})

onlineManager.setEventListener((setOnline) =>
  NetInfo.addEventListener((state) => setOnline(!!state.isConnected)),
)

/**
 * QueryClient único da aplicação. Os catálogos mudam pouco, então 1 minuto de cache
 * evita refetch a cada troca de tela sem deixar dado velho por muito tempo.
 *
 * @example
 * queryClient.invalidateQueries({ queryKey: ['fishing-methods'] })
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
})
