import { useState, type ReactNode, type Ref } from 'react'
import { Platform, TextInput, type TextInputProps } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { Icon, type IconName } from './Icon'

export type TextFieldProps = Omit<TextInputProps, 'style'> & {
  label: string
  error?: string
  helper?: string
  leadingIcon?: IconName
  trailing?: ReactNode
  ref?: Ref<TextInput>
}

// Campo contornado do Material 3 com o rótulo sempre no alto da borda: o pescador
// nunca perde de vista o que está preenchendo.
const Wrapper = styled.View`
  padding-top: 10px;
`

const Box = styled.View<{ $borderColor: string; $borderWidth: number }>`
  min-height: ${({ theme }) => theme.size.control}px;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.space.md}px;
  border-radius: ${({ theme }) => theme.radius.field}px;
  border-width: ${({ $borderWidth }) => $borderWidth}px;
  border-color: ${({ $borderColor }) => $borderColor};
  padding-horizontal: ${({ theme, $borderWidth }) => theme.space.lg - ($borderWidth - 1)}px;
  background-color: ${({ theme }) => theme.colors.surface};
`

const FloatingLabel = styled.Text`
  position: absolute;
  top: 0;
  left: ${({ theme }) => theme.space.md}px;
  padding-horizontal: ${({ theme }) => theme.space.xs}px;
  background-color: ${({ theme }) => theme.colors.surface};
  font-size: ${({ theme }) => theme.typography.fieldLabel.fontSize}px;
  line-height: ${({ theme }) => theme.typography.fieldLabel.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.fieldLabel.fontWeight};
`

const Input = styled(TextInput)`
  flex: 1;
  padding-vertical: ${({ theme }) => theme.space.md}px;
  font-size: ${({ theme }) => theme.typography.bodyLarge.fontSize}px;
  color: ${({ theme }) => theme.colors.onSurface};
`

const Supporting = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space.sm}px;
  margin-top: ${({ theme }) => theme.space.xs}px;
  padding-horizontal: ${({ theme }) => theme.space.lg}px;
`

const SupportingText = styled.Text`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  line-height: ${({ theme }) => theme.typography.body.lineHeight}px;
`

export function TextField({
  label,
  error,
  helper,
  leadingIcon,
  trailing,
  onFocus,
  onBlur,
  ...inputProps
}: TextFieldProps) {
  const { colors } = useTheme()
  const [focused, setFocused] = useState(false)

  const accent = error ? colors.error : focused ? colors.primary : colors.outline
  const supporting = error ?? helper

  return (
    <Wrapper>
      <Box $borderColor={accent} $borderWidth={error || focused ? 2 : 1}>
        {leadingIcon && <Icon name={leadingIcon} color={colors.onSurfaceVariant} />}
        <Input
          {...inputProps}
          accessibilityLabel={label}
          // O erro já é anunciado pela região viva abaixo; repetir aqui faria o leitor falar duas vezes.
          accessibilityHint={helper}
          placeholderTextColor={colors.onSurfaceVariant}
          selectionColor={Platform.OS === 'android' ? colors.primaryTrack : colors.primary}
          cursorColor={colors.primary}
          selectionHandleColor={colors.primary}
          onFocus={(event) => {
            setFocused(true)
            onFocus?.(event)
          }}
          onBlur={(event) => {
            setFocused(false)
            onBlur?.(event)
          }}
        />
        {trailing}
      </Box>
      <FloatingLabel
        importantForAccessibility="no"
        accessibilityElementsHidden
        style={{ color: error ? colors.error : focused ? colors.primary : colors.onSurfaceVariant }}
      >
        {label}
      </FloatingLabel>
      {supporting ? (
        <Supporting accessibilityLiveRegion={error ? 'polite' : 'none'}>
          {error && <Icon name="error" color={colors.error} size={20} />}
          <SupportingText style={{ color: error ? colors.error : colors.onSurfaceVariant }}>
            {supporting}
          </SupportingText>
        </Supporting>
      ) : null}
    </Wrapper>
  )
}
