import type { DrawerContentComponentProps } from 'expo-router/drawer'
import { DrawerContentScrollView, DrawerItemList } from 'expo-router/drawer'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { Button } from './Button'

type FooterAction = {
  label: string
  onPress: () => void
}

type MenuDrawerContentProps = DrawerContentComponentProps & {
  // Ação principal do menu: fica fixa no rodapé, enquanto a lista de telas rola por cima.
  footerAction: FooterAction
}

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.surface};
`

const Footer = styled.View`
  padding-horizontal: ${({ theme }) => theme.space.lg}px;
  padding-top: ${({ theme }) => theme.space.md}px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.outlineVariant};
`

// Conteúdo do menu lateral: a lista de telas no alto e o botão no rodapé. O inset de baixo do
// sistema vai para o rodapé, para o botão não ficar sob a barra de gestos.
export function MenuDrawerContent({ footerAction, ...props }: MenuDrawerContentProps) {
  const insets = useSafeAreaInsets()
  const { space } = useTheme()

  return (
    <Container>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <Footer style={{ paddingBottom: insets.bottom + space.lg }}>
        <Button label={footerAction.label} onPress={footerAction.onPress} />
      </Footer>
    </Container>
  )
}
