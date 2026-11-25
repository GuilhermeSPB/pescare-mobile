import { Pressable } from 'react-native'
import { useTheme } from 'styled-components/native'

import { Icon, type IconName } from './Icon'

type IconButtonProps = {
  icon: IconName
  accessibilityLabel: string
  onPress: () => void
  color?: string
  // Sem ação no momento (ex.: "Próximo mês" no mês atual): o ícone esmaece e o toque é ignorado.
  disabled?: boolean
}

export function IconButton({
  icon,
  accessibilityLabel,
  onPress,
  color,
  disabled,
}: IconButtonProps) {
  const theme = useTheme()
  const tint = disabled ? theme.colors.disabledContent : (color ?? theme.colors.onSurfaceVariant)

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: Boolean(disabled) }}
      android_ripple={{ color: 'rgba(17, 24, 39, 0.12)', borderless: true, radius: 24 }}
      hitSlop={4}
      style={({ pressed }) => ({
        width: theme.size.iconButton,
        height: theme.size.iconButton,
        borderRadius: theme.radius.full,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:
          pressed && process.env.EXPO_OS !== 'android' ? 'rgba(17, 24, 39, 0.08)' : 'transparent',
      })}
    >
      <Icon name={icon} color={tint} />
    </Pressable>
  )
}
