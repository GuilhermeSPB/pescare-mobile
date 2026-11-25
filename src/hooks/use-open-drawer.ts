import { useNavigation } from 'expo-router'
import type { DrawerNavigationProp } from 'expo-router/drawer'

/**
 * Função que abre o menu lateral. Vale para as telas dentro do layout de menu (src/app/(drawer)).
 *
 * @example
 * const openDrawer = useOpenDrawer()
 * <TopAppBar title="Histórico" onMenu={openDrawer} />
 */
export function useOpenDrawer() {
  const navigation = useNavigation<DrawerNavigationProp<ReactNavigation.RootParamList>>()

  return () => navigation.openDrawer()
}
