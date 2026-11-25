import { ActivityIndicator, Pressable } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

type ButtonVariant = 'filled' | 'outlined' | 'text'

type ButtonProps = {
  label: string
  onPress: () => void
  variant?: ButtonVariant
  // `inverse` é para botões sobre o azul da marca (tela de abertura).
  tone?: 'default' | 'inverse'
  loading?: boolean
  disabled?: boolean
}

const Label = styled.Text`
  font-size: ${({ theme }) => theme.typography.label.fontSize}px;
  line-height: ${({ theme }) => theme.typography.label.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  letter-spacing: ${({ theme }) => theme.typography.label.letterSpacing}px;
  text-align: center;
`

export function Button({
  label,
  onPress,
  variant = 'filled',
  tone = 'default',
  loading = false,
  disabled = false,
}: ButtonProps) {
  const { colors, size, space, radius } = useTheme()
  const inverse = tone === 'inverse'
  const inactive = disabled || loading

  const palette = {
    filled: {
      background: inverse ? colors.surface : colors.primary,
      pressed: inverse ? colors.primaryContainer : colors.primaryPressed,
      content: inverse ? colors.primary : colors.onPrimary,
      border: 'transparent',
    },
    outlined: {
      background: 'transparent',
      pressed: inverse ? 'rgba(255, 255, 255, 0.12)' : 'rgba(37, 99, 235, 0.08)',
      content: inverse ? colors.onPrimary : colors.primary,
      border: inverse ? colors.onPrimary : colors.outline,
    },
    text: {
      background: 'transparent',
      pressed: 'rgba(37, 99, 235, 0.08)',
      content: inverse ? colors.onPrimary : colors.primary,
      border: 'transparent',
    },
  }[variant]

  const content = disabled ? colors.disabledContent : palette.content
  // A onda do toque no Android usa a cor do conteúdo: clara sobre azul, azul sobre claro.
  const rippleOnBlue = inverse !== (variant === 'filled')

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled, busy: loading }}
      android_ripple={{
        color: rippleOnBlue ? 'rgba(255, 255, 255, 0.24)' : 'rgba(37, 99, 235, 0.16)',
        foreground: true,
      }}
      style={({ pressed }) => ({
        minHeight: variant === 'text' ? size.iconButton : size.control,
        paddingHorizontal: variant === 'text' ? space.md : space.xl,
        paddingVertical: space.md,
        borderRadius: radius.full,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: variant === 'text' ? 'center' : 'stretch',
        borderWidth: variant === 'outlined' ? (inverse ? 2 : 1) : 0,
        borderColor: disabled && variant === 'outlined' ? colors.disabledContainer : palette.border,
        backgroundColor:
          disabled && variant === 'filled'
            ? colors.disabledContainer
            : pressed && process.env.EXPO_OS !== 'android'
              ? palette.pressed
              : palette.background,
      })}
    >
      {loading ? (
        <ActivityIndicator color={content} accessibilityLabel="Carregando" />
      ) : (
        <Label style={{ color: content }}>{label}</Label>
      )}
    </Pressable>
  )
}
