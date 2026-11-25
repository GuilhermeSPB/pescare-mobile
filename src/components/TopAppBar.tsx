import { StatusBar } from 'expo-status-bar'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { Icon } from './Icon'
import { IconButton } from './IconButton'

type TopAppBarProps = {
  title: string
  onBack?: () => void
  // Abre o menu lateral. O ícone vem com o texto "Menu": ícone sozinho não diz o que faz.
  onMenu?: () => void
  // Conteúdo rolou por baixo da barra: mostra a linha que separa os dois.
  elevated?: boolean
}

const Container = styled.View<{ $elevated: boolean }>`
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme, $elevated }) => ($elevated ? theme.colors.outlineVariant : 'transparent')};
  background-color: ${({ theme }) => theme.colors.surface};
`

const Bar = styled.View`
  height: ${({ theme }) => theme.size.appBar}px;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs}px;
  padding-horizontal: ${({ theme }) => theme.space.xs}px;
`

const MenuButton = styled.Pressable`
  min-height: ${({ theme }) => theme.size.iconButton}px;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs}px;
  padding-horizontal: ${({ theme }) => theme.space.sm}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
`

const MenuLabel = styled.Text`
  font-size: ${({ theme }) => theme.typography.label.fontSize}px;
  line-height: ${({ theme }) => theme.typography.label.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  color: ${({ theme }) => theme.colors.onSurface};
`

const Title = styled.Text<{ $inset: boolean }>`
  flex: 1;
  margin-left: ${({ theme, $inset }) => ($inset ? theme.space.md : 0)}px;
  font-size: ${({ theme }) => theme.typography.title.fontSize}px;
  line-height: ${({ theme }) => theme.typography.title.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.title.fontWeight};
  color: ${({ theme }) => theme.colors.onSurface};
`

// Barra superior pequena do Material 3. Também fixa a barra de status escura,
// já que só a tela de abertura usa fundo azul.
export function TopAppBar({ title, onBack, onMenu, elevated = false }: TopAppBarProps) {
  const insets = useSafeAreaInsets()
  const { colors } = useTheme()

  return (
    <Container $elevated={elevated} style={{ paddingTop: insets.top }}>
      <StatusBar style="dark" />
      <Bar>
        {onBack && (
          <IconButton
            icon="back"
            accessibilityLabel="Voltar"
            onPress={onBack}
            color={colors.onSurface}
          />
        )}
        {onMenu && (
          <MenuButton
            onPress={onMenu}
            accessibilityRole="button"
            accessibilityLabel="Abrir menu"
            android_ripple={{ color: 'rgba(17, 24, 39, 0.12)' }}
          >
            <Icon name="menu" color={colors.onSurface} />
            <MenuLabel>Menu</MenuLabel>
          </MenuButton>
        )}
        <Title $inset={!onBack && !onMenu} accessibilityRole="header" numberOfLines={1}>
          {title}
        </Title>
      </Bar>
    </Container>
  )
}
