import { Pressable } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { Icon } from './Icon'

export type ChoiceOption<T extends string> = {
  value: T
  label: string
}

type ChoiceGroupProps<T extends string> = {
  label: string
  options: ChoiceOption<T>[]
  value: T | null
  onChange: (value: T) => void
}

const Row = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.sm}px;
`

const Option = styled.View<{ $selected: boolean }>`
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

const OptionText = styled.Text<{ $selected: boolean }>`
  font-size: ${({ theme }) => theme.typography.label.fontSize}px;
  line-height: ${({ theme }) => theme.typography.label.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  color: ${({ theme, $selected }) => ($selected ? theme.colors.onPrimaryContainer : theme.colors.onSurface)};
`

// Escolha entre poucas opções (ex.: Sim ou Não). A marca de check mostra a escolha
// além da cor, para quem não distingue as cores.
export function ChoiceGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: ChoiceGroupProps<T>) {
  const { colors } = useTheme()

  return (
    <Row accessibilityRole="radiogroup" accessibilityLabel={label}>
      {options.map((option) => {
        const selected = option.value === value

        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            accessibilityLabel={option.label}
            android_ripple={{ color: 'rgba(37, 99, 235, 0.12)' }}
            style={{ alignSelf: 'flex-start' }}
          >
            <Option $selected={selected}>
              {selected && <Icon name="check" color={colors.primary} size={20} />}
              <OptionText $selected={selected}>{option.label}</OptionText>
            </Option>
          </Pressable>
        )
      })}
    </Row>
  )
}
