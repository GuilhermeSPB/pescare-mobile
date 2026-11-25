import styled from 'styled-components/native'

import { Button } from '@/components/Button'
import { DateField } from '@/components/DateField'

import type { HistoryPeriod } from '../hooks/use-fishing-history-filters'

type HistoryPeriodPanelProps = {
  period: HistoryPeriod
  onFromChange: (date: Date) => void
  onToChange: (date: Date) => void
  onClear: () => void
}

const Panel = styled.View`
  gap: ${({ theme }) => theme.space.md}px;
  padding: ${({ theme }) => theme.space.lg}px;
  border-radius: ${({ theme }) => theme.radius.card}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.outlineVariant};
  background-color: ${({ theme }) => theme.colors.surface};
`

// Painel que abre embaixo dos chips: as datas "De" e "Até" e a saída para tirar o período.
export function HistoryPeriodPanel({
  period,
  onFromChange,
  onToChange,
  onClear,
}: HistoryPeriodPanelProps) {
  const today = new Date()

  return (
    <Panel>
      <DateField label="De" value={period.from} maximumDate={today} onChange={onFromChange} />
      <DateField
        label="Até"
        value={period.to}
        minimumDate={period.from}
        maximumDate={today}
        onChange={onToChange}
      />
      <Button variant="text" label="Limpar período" onPress={onClear} />
    </Panel>
  )
}
