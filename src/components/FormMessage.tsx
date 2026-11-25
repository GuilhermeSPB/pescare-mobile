import styled, { useTheme } from 'styled-components/native'

import { Icon } from './Icon'

type FormMessageProps = {
  tone: 'error' | 'success'
  children: string
}

const Container = styled.View<{ $background: string }>`
  flex-direction: row;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space.md}px;
  padding: ${({ theme }) => theme.space.lg}px;
  border-radius: 12px;
  background-color: ${({ $background }) => $background};
`

const Message = styled.Text`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.bodyLarge.fontSize}px;
  line-height: ${({ theme }) => theme.typography.bodyLarge.lineHeight}px;
`

// Aviso no corpo do formulário, para o que não pertence a um campo só
// (servidor fora do ar, senha errada, conta criada).
export function FormMessage({ tone, children }: FormMessageProps) {
  const { colors } = useTheme()
  const color = tone === 'error' ? colors.error : colors.onPrimaryContainer

  return (
    <Container
      $background={tone === 'error' ? colors.errorContainer : colors.primaryContainer}
      accessibilityLiveRegion="polite"
      accessibilityRole={tone === 'error' ? 'alert' : 'text'}
    >
      <Icon name={tone === 'error' ? 'error' : 'success'} color={color} />
      <Message style={{ color }}>{children}</Message>
    </Container>
  )
}
