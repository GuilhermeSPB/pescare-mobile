import { Pressable } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { Icon } from './Icon'

type CheckRowProps = {
  label: string
  checked: boolean
  onPress: () => void
}

const Box = styled.View<{ $checked: boolean }>`
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.field}px;
  border-width: 2px;
  border-color: ${({ theme, $checked }) => ($checked ? theme.colors.primary : theme.colors.outline)};
  background-color: ${({ theme, $checked }) => ($checked ? theme.colors.primary : theme.colors.surface)};
`

const Label = styled.Text`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.bodyLarge.fontSize}px;
  line-height: ${({ theme }) => theme.typography.bodyLarge.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurface};
`

// Opção marcável de uma lista (ex.: tipos de comprador). Vários podem ficar marcados.
export function CheckRow({ label, checked, onPress }: CheckRowProps) {
  const { colors, space, size } = useTheme()

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      android_ripple={{ color: 'rgba(37, 99, 235, 0.12)' }}
      style={{
        minHeight: size.control,
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.lg,
      }}
    >
      <Box $checked={checked}>
        {checked && <Icon name="check" color={colors.onPrimary} size={20} />}
      </Box>
      <Label>{label}</Label>
    </Pressable>
  )
}
