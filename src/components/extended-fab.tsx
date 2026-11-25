import { Pressable } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { Icon, type IconName } from './Icon'

type ExtendedFabProps = {
  label: string
  icon: IconName
  onPress: () => void
}

const FabLabel = styled.Text`
  font-size: ${({ theme }) => theme.typography.label.fontSize}px;
  line-height: ${({ theme }) => theme.typography.label.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  letter-spacing: ${({ theme }) => theme.typography.label.letterSpacing}px;
  color: ${({ theme }) => theme.colors.onPrimary};
`

// Ação principal flutuante (M3 "extended FAB"): ícone e texto juntos, sempre.
export function ExtendedFab({ label, icon, onPress }: ExtendedFabProps) {
  const { colors, size, space, radius } = useTheme()

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      android_ripple={{ color: 'rgba(255, 255, 255, 0.24)', foreground: true }}
      style={({ pressed }) => ({
        height: size.control,
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.sm,
        paddingHorizontal: space.xl,
        borderRadius: radius.card,
        overflow: 'hidden',
        elevation: 3,
        backgroundColor:
          pressed && process.env.EXPO_OS !== 'android' ? colors.primaryPressed : colors.primary,
      })}
    >
      <Icon name={icon} color={colors.onPrimary} />
      <FabLabel>{label}</FabLabel>
    </Pressable>
  )
}
