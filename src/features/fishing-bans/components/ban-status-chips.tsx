import { ScrollView } from 'react-native'
import { useTheme } from 'styled-components/native'

import { FilterChip } from '@/components/filter-chip'

import type { BanStatusFilter } from '../utils/filter-fishing-bans'

type BanStatusChipsProps = {
  status: BanStatusFilter
  onStatusChange: (status: BanStatusFilter) => void
}

const STATUS_OPTIONS: { value: BanStatusFilter; label: string }[] = [
  { value: 'TODOS', label: 'Todos' },
  { value: 'EM_VIGOR', label: 'Vigentes' },
  { value: 'PROXIMO', label: 'Próximos' },
]

// Escolha entre todos, vigentes e próximos. A linha rola na horizontal, como no Histórico.
export function BanStatusChips({ status, onStatusChange }: BanStatusChipsProps) {
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
    </ScrollView>
  )
}
