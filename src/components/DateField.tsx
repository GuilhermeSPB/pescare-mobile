import DateTimePicker from '@react-native-community/datetimepicker'
import { useState } from 'react'
import { Platform, Pressable } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { formatDateLabel } from '@/utils/iso-date'

import { FormMessage } from './FormMessage'
import { Icon } from './Icon'

type DateFieldProps = {
  label: string
  value: Date
  onChange: (date: Date) => void
  // Data mais nova que pode ser escolhida (ex.: hoje, para não registrar pesca do futuro).
  maximumDate?: Date
  // Data mais antiga que pode ser escolhida (ex.: "Até" não antes de "De").
  minimumDate?: Date
  error?: string
}

const Field = styled.View<{ $borderColor: string; $borderWidth: number }>`
  min-height: ${({ theme }) => theme.size.control}px;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.space.md}px;
  padding-horizontal: ${({ theme }) => theme.space.lg}px;
  border-radius: ${({ theme }) => theme.radius.field}px;
  border-width: ${({ $borderWidth }) => $borderWidth}px;
  border-color: ${({ $borderColor }) => $borderColor};
  background-color: ${({ theme }) => theme.colors.surface};
`

const TextArea = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.space.xs}px;
  padding-vertical: ${({ theme }) => theme.space.md}px;
`

const FieldLabel = styled.Text`
  font-size: ${({ theme }) => theme.typography.fieldLabel.fontSize}px;
  line-height: ${({ theme }) => theme.typography.fieldLabel.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.fieldLabel.fontWeight};
`

const Value = styled.Text`
  font-size: ${({ theme }) => theme.typography.bodyLarge.fontSize}px;
  line-height: ${({ theme }) => theme.typography.bodyLarge.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurface};
`

// Campo de data com o seletor nativo: o pescador toca e escolhe no calendário,
// sem digitar "AAAA-MM-DD".
export function DateField({
  label,
  value,
  onChange,
  maximumDate,
  minimumDate,
  error,
}: DateFieldProps) {
  const { colors } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Pressable
        onPress={() => setOpen((current) => !current)}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${formatDateLabel(value)}`}
        accessibilityHint={error}
        accessibilityState={{ expanded: open }}
      >
        <Field $borderColor={error ? colors.error : colors.outline} $borderWidth={error ? 2 : 1}>
          <TextArea>
            <FieldLabel style={{ color: error ? colors.error : colors.onSurfaceVariant }}>
              {label}
            </FieldLabel>
            <Value>{formatDateLabel(value)}</Value>
          </TextArea>
          <Icon name="calendar" color={colors.onSurfaceVariant} />
        </Field>
      </Pressable>
      {error && <FormMessage tone="error">{error}</FormMessage>}
      {open && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          onValueChange={(_event, date) => {
            setOpen(Platform.OS === 'ios')
            onChange(date)
          }}
          onDismiss={() => setOpen(false)}
        />
      )}
    </>
  )
}
