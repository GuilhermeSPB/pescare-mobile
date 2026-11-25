import type { ReactNode } from 'react'
import styled from 'styled-components/native'

type SectionCardProps = {
  title: string
  children: ReactNode
}

const Container = styled.View`
  gap: ${({ theme }) => theme.space.md}px;
  padding: ${({ theme }) => theme.space.lg}px;
  border-radius: ${({ theme }) => theme.radius.card}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.outlineVariant};
  background-color: ${({ theme }) => theme.colors.surface};
`

const Title = styled.Text`
  font-size: ${({ theme }) => theme.typography.title.fontSize}px;
  line-height: ${({ theme }) => theme.typography.title.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.title.fontWeight};
  color: ${({ theme }) => theme.colors.onSurface};
`

// Bloco com título para agrupar informações numa tela (ex.: "Últimas pescas").
export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <Container>
      <Title accessibilityRole="header">{title}</Title>
      {children}
    </Container>
  )
}
