import styled from 'styled-components/native'

import { StatCard } from '@/components/stat-card'

import type { MonthCard } from '../utils/format-month-stats'

type MonthStatsProps = {
  title: string
  // Quatro cartões, na ordem da grade.
  cards: MonthCard[]
}

const Container = styled.View`
  gap: ${({ theme }) => theme.space.md}px;
`

const Title = styled.Text`
  font-size: ${({ theme }) => theme.typography.title.fontSize}px;
  line-height: ${({ theme }) => theme.typography.title.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.title.fontWeight};
  color: ${({ theme }) => theme.colors.onSurface};
`

const Row = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.space.md}px;
`

// Números do mês em grade 2×2. Dois por linha: três colunas não cabem no celular com fonte grande.
export function MonthStats({ title, cards }: MonthStatsProps) {
  const rows = [cards.slice(0, 2), cards.slice(2, 4)]

  return (
    <Container>
      <Title accessibilityRole="header">{title}</Title>
      {rows.map((row) => (
        <Row key={row[0].label}>
          {row.map((card) => (
            <StatCard key={card.label} label={card.label} value={card.value} detail={card.detail} />
          ))}
        </Row>
      ))}
    </Container>
  )
}
