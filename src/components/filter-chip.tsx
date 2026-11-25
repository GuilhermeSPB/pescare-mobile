import { Pressable } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { Icon } from './Icon'

type FilterChipProps = {
  label: string
  selected: boolean
  onPress: () => void
  // "radio" para escolher uma entre várias opções; "button" para o chip que abre um painel.
  role: 'radio' | 'button'
  // Só para o papel "button": o painel que ele abre está aberto?
  expanded?: boolean
}

const Pill = styled.View<{ $selected: boolean }>`
  min-height: ${({ theme }) => theme.size.control}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space.sm}px;
  padding-horizontal: ${({ theme }) => theme.space.lg}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  border-width: ${({ $selected }) => ($selected ? 2 : 1)}px;
  border-color: ${({ theme, $selected }) => ($selected ? theme.colors.primary : theme.colors.outline)};
  background-color: ${({ theme, $selected }) => ($selected ? theme.colors.primaryContainer : theme.colors.surface)};
`

const PillText = styled.Text<{ $selected: boolean }>`
  font-size: ${({ theme }) => theme.typography.label.fontSize}px;
  line-height: ${({ theme }) => theme.typography.label.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  color: ${({ theme, $selected }) => ($selected ? theme.colors.onPrimaryContainer : theme.colors.onSurface)};
`

// Chip de filtro, como o ChoiceGroup, mas feito para uma linha que rola na horizontal.
// A marca de check mostra a escolha além da cor.
export function FilterChip({ label, selected, onPress, role, expanded }: FilterChipProps) {
  const { colors } = useTheme()

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={role}
      accessibilityLabel={label}
      accessibilityState={role === 'radio' ? { checked: selected } : { expanded }}
      android_ripple={{ color: 'rgba(37, 99, 235, 0.12)' }}
    >
      <Pill $selected={selected}>
        {selected && <Icon name="check" color={colors.primary} size={20} />}
        <PillText $selected={selected}>{label}</PillText>
      </Pill>
    </Pressable>
  )
}
