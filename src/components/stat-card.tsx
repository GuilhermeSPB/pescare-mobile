import styled from 'styled-components/native'

type StatCardProps = {
  label: string
  value: string
  // Linha de apoio abaixo do valor, como a unidade em "8 unidades". Some quando não há.
  detail?: string
}

const Container = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.space.xs}px;
  padding: ${({ theme }) => theme.space.lg}px;
  border-radius: ${({ theme }) => theme.radius.card}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.outlineVariant};
  background-color: ${({ theme }) => theme.colors.surface};
`

const CardLabel = styled.Text`
  font-size: ${({ theme }) => theme.typography.bodyLarge.fontSize}px;
  line-height: ${({ theme }) => theme.typography.bodyLarge.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`

const CardValue = styled.Text`
  font-size: ${({ theme }) => theme.typography.title.fontSize}px;
  line-height: ${({ theme }) => theme.typography.title.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.title.fontWeight};
  color: ${({ theme }) => theme.colors.onSurface};
`

const CardDetail = styled.Text`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  line-height: ${({ theme }) => theme.typography.body.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`

// Um número com rótulo. `accessible` faz o leitor de tela ler o cartão inteiro de uma vez.
export function StatCard({ label, value, detail }: StatCardProps) {
  return (
    <Container accessible>
      <CardLabel>{label}</CardLabel>
      <CardValue>{value}</CardValue>
      {detail && <CardDetail>{detail}</CardDetail>}
    </Container>
  )
}
