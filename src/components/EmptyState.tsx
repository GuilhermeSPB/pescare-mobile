import styled from 'styled-components/native'

type EmptyStateProps = {
  message: string
}

const Message = styled.Text`
  font-size: ${({ theme }) => theme.typography.bodyLarge.fontSize}px;
  line-height: ${({ theme }) => theme.typography.bodyLarge.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`

// Texto simples para listas sem itens: nada de ilustração, o pescador lê a frase.
export function EmptyState({ message }: EmptyStateProps) {
  return <Message>{message}</Message>
}
