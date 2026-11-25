import type { ReactNode } from 'react'
import { Pressable } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { Icon } from './Icon'

type ExpandableCardProps = {
  title: string
  // Linha curta sob o título, que aparece mesmo fechado (ex.: "12 dias de pesca").
  summary: string
  isExpanded: boolean
  onToggle: () => void
  children: ReactNode
}

// Mesmo contorno do SectionCard; o cabeçalho é o alvo de toque inteiro, não só a seta.
const Container = styled.View`
  border-radius: ${({ theme }) => theme.radius.card}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.outlineVariant};
  background-color: ${({ theme }) => theme.colors.surface};
  overflow: hidden;
`

const Header = styled.View`
  min-height: ${({ theme }) => theme.size.control}px;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.space.md}px;
  padding: ${({ theme }) => theme.space.lg}px;
`

const HeaderText = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.space.xs}px;
`

const Title = styled.Text`
  font-size: ${({ theme }) => theme.typography.title.fontSize}px;
  line-height: ${({ theme }) => theme.typography.title.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.title.fontWeight};
  color: ${({ theme }) => theme.colors.onSurface};
`

const Summary = styled.Text`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  line-height: ${({ theme }) => theme.typography.body.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`

// A seta vem com a palavra: ícone sozinho não diz o que faz para quem lê pouco.
const ToggleLabel = styled.Text`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  line-height: ${({ theme }) => theme.typography.body.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  color: ${({ theme }) => theme.colors.primary};
`

const Toggle = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs}px;
`

const Content = styled.View`
  padding: 0 ${({ theme }) => theme.space.lg}px ${({ theme }) => theme.space.lg}px;
`

// Cartão que abre e fecha: fechado mostra só o título e o resumo; aberto, o conteúdo embaixo.
export function ExpandableCard({
  title,
  summary,
  isExpanded,
  onToggle,
  children,
}: ExpandableCardProps) {
  const { colors } = useTheme()

  return (
    <Container>
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityLabel={`${title}, ${summary}`}
        accessibilityState={{ expanded: isExpanded }}
        accessibilityHint={isExpanded ? 'Toque para fechar' : 'Toque para ver os detalhes'}
        android_ripple={{ color: 'rgba(37, 99, 235, 0.12)' }}
        style={({ pressed }) => ({
          backgroundColor:
            pressed && process.env.EXPO_OS !== 'android' ? 'rgba(17, 24, 39, 0.06)' : 'transparent',
        })}
      >
        <Header>
          <HeaderText>
            <Title>{title}</Title>
            <Summary>{summary}</Summary>
          </HeaderText>
          <Toggle>
            <ToggleLabel>{isExpanded ? 'Fechar' : 'Ver'}</ToggleLabel>
            <Icon name={isExpanded ? 'chevronUp' : 'chevronDown'} color={colors.primary} />
          </Toggle>
        </Header>
      </Pressable>
      {isExpanded && <Content>{children}</Content>}
    </Container>
  )
}
