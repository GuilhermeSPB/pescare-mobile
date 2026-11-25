import { router, useNavigation } from 'expo-router'

/**
 * Fecha o fluxo de registro inteiro e volta para onde a pessoa estava (as abas).
 * `router.dismissAll()` não serve: ele só volta ao primeiro passo do próprio fluxo.
 *
 * @returns função que fecha o fluxo
 * @example
 * const exitFlow = useExitFishingRecordFlow()
 * createMutation.mutate(input, { onSuccess: exitFlow })
 */
export function useExitFishingRecordFlow() {
  const navigation = useNavigation()

  return () => {
    // O pai é a pilha raiz: voltar nela tira a rota "fishing-records" com todos os passos.
    const rootStack = navigation.getParent()

    if (rootStack?.canGoBack()) {
      rootStack.goBack()
      return
    }

    router.dismissAll()
  }
}
