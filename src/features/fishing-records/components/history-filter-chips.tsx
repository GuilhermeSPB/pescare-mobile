import { ScrollView } from 'react-native'
import { useTheme } from 'styled-components/native'

import { FilterChip } from '@/components/filter-chip'

import type { HistoryPeriod } from '../hooks/use-fishing-history-filters'
import type { HistoryStatus } from '../utils/filter-fishing-records'
import { formatPeriod } from '../utils/format-period'

type HistoryFilterChipsProps = {
  status: HistoryStatus
  period: HistoryPeriod | null
  isPeriodOpen: boolean
  onStatusChange: (status: HistoryStatus) => void
  onTogglePeriod: () => void
}

const STATUS_OPTIONS: { value: HistoryStatus; label: string }[] = [
  { value: 'TODAS', label: 'Todas' },
  { value: 'FINALIZADO', label: 'Finalizadas' },
  { value: 'EM_ANDAMENTO', label: 'Falta terminar' },
]

// Linha de chips que rola na horizontal: a situação (uma escolha) e o período, que abre as datas.
export function HistoryFilterChips({
  status,
  period,
  isPeriodOpen,
  onStatusChange,
  onTogglePeriod,
}: HistoryFilterChipsProps) {
  const { space } = useTheme()

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: space.sm }}
    >
      {STATUS_OPTIONS.map((option) => (
        <FilterChip
          key={option.value}
          label={option.label}
          role="radio"
          selected={status === option.value}
          onPress={() => onStatusChange(option.value)}
        />
      ))}
      <FilterChip
        label={period ? formatPeriod(period.from, period.to) : 'Período'}
        role="button"
        selected={period !== null}
        expanded={isPeriodOpen}
        onPress={onTogglePeriod}
      />
    </ScrollView>
  )
}
