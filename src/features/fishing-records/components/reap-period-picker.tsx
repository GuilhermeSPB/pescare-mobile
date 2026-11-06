import styled from 'styled-components/native'

import { FilterChip } from '@/components/filter-chip'
import { IconButton } from '@/components/IconButton'

import type { ReapPeriod, ReapPeriodKind } from '../types/reap'
import { formatReapPeriod } from '../utils/reap-period'

type ReapPeriodPickerProps = {
  period: ReapPeriod
  canGoNext: boolean
  onKindChange: (kind: ReapPeriodKind) => void
  onPrevious: () => void
  onNext: () => void
}

const KIND_OPTIONS: { value: ReapPeriodKind; label: string }[] = [
  { value: 'MONTH', label: 'Por mês' },
  { value: 'YEAR', label: 'Por ano' },
]

const Container = styled.View`
  gap: ${({ theme }) => theme.space.md}px;
`

const KindRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.sm}px;
`

const Stepper = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm}px;
`

const PeriodLabel = styled.Text`
  flex: 1;
  text-align: center;
  font-size: ${({ theme }) => theme.typography.headline.fontSize}px;
  line-height: ${({ theme }) => theme.typography.headline.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.headline.fontWeight};
  color: ${({ theme }) => theme.colors.onSurface};
`

// Escolha do período do REAP: mês ou ano, e setas para andar um de cada vez. Setas em vez de
// calendário: um toque por mês, sem abrir nada.
export function ReapPeriodPicker({
  period,
  canGoNext,
  onKindChange,
  onPrevious,
  onNext,
}: ReapPeriodPickerProps) {
  const isMonth = period.kind === 'MONTH'

  return (
    <Container>
      <KindRow accessibilityRole="radiogroup">
        {KIND_OPTIONS.map((option) => (
          <FilterChip
            key={option.value}
            label={option.label}
            role="radio"
            selected={period.kind === option.value}
            onPress={() => onKindChange(option.value)}
          />
        ))}
      </KindRow>
      <Stepper>
        <IconButton
          icon="chevronLeft"
          accessibilityLabel={isMonth ? 'Mês anterior' : 'Ano anterior'}
          onPress={onPrevious}
        />
        <PeriodLabel accessibilityRole="header" accessibilityLiveRegion="polite">
          {formatReapPeriod(period)}
        </PeriodLabel>
        <IconButton
          icon="chevronRight"
          accessibilityLabel={isMonth ? 'Próximo mês' : 'Próximo ano'}
          onPress={onNext}
          disabled={!canGoNext}
        />
      </Stepper>
    </Container>
  )
}
