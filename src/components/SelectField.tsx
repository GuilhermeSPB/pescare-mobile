import { useState } from 'react'
import { Pressable } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { normalize } from '@/utils/text'

import { FormMessage } from './FormMessage'
import { Icon } from './Icon'
import { TextField } from './TextField'

export type SelectOption = {
  id: number
  label: string
}

type SelectFieldProps = {
  label: string
  options: SelectOption[]
  selectedId: number | null
  onSelect: (id: number) => void
  error?: string
  // Mensagem quando a lista de opções vem vazia (ex.: nenhuma espécie cadastrada).
  emptyMessage?: string
}

const Trigger = styled.View<{ $borderColor: string; $borderWidth: number }>`
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

const TriggerText = styled.View`
  flex: 1;
  padding-vertical: ${({ theme }) => theme.space.md}px;
`

const TriggerLabel = styled.Text`
  font-size: ${({ theme }) => theme.typography.fieldLabel.fontSize}px;
  line-height: ${({ theme }) => theme.typography.fieldLabel.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.fieldLabel.fontWeight};
`

const ChosenText = styled.Text`
  font-size: ${({ theme }) => theme.typography.bodyLarge.fontSize}px;
  line-height: ${({ theme }) => theme.typography.bodyLarge.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurface};
`

const Results = styled.View`
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.outlineVariant};
`

const Hint = styled.Text`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  line-height: ${({ theme }) => theme.typography.body.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`

const OptionText = styled.Text`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.bodyLarge.fontSize}px;
  line-height: ${({ theme }) => theme.typography.bodyLarge.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurface};
`

// Escolha de uma opção de catálogo: o pescador toca no campo, procura pelo nome e toca na opção.
export function SelectField({
  label,
  options,
  selectedId,
  onSelect,
  error,
  emptyMessage,
}: SelectFieldProps) {
  const { colors, space, size } = useTheme()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const selected = options.find((option) => option.id === selectedId)
  const term = normalize(query.trim())
  const results = options.filter((option) => normalize(option.label).includes(term))

  function choose(id: number) {
    onSelect(id)
    setOpen(false)
    setQuery('')
  }

  return (
    <>
      <Pressable
        onPress={() => setOpen((current) => !current)}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${selected?.label ?? 'nenhuma escolha'}`}
        accessibilityHint={error}
        accessibilityState={{ expanded: open }}
      >
        <Trigger $borderColor={error ? colors.error : colors.outline} $borderWidth={error ? 2 : 1}>
          <TriggerText>
            <TriggerLabel style={{ color: error ? colors.error : colors.onSurfaceVariant }}>
              {label}
            </TriggerLabel>
            <ChosenText>{selected?.label ?? ' '}</ChosenText>
          </TriggerText>
          <Icon name="chevronDown" color={colors.onSurfaceVariant} />
        </Trigger>
      </Pressable>
      {error && <FormMessage tone="error">{error}</FormMessage>}
      {open && (
        <>
          {options.length === 0 ? (
            <Hint>{emptyMessage ?? 'Nenhuma opção disponível.'}</Hint>
          ) : (
            <>
              <TextField
                label={`Buscar em ${label.toLowerCase()}`}
                leadingIcon="search"
                value={query}
                onChangeText={setQuery}
                autoCorrect={false}
                autoCapitalize="none"
              />
              <Results accessibilityRole="radiogroup">
                {results.map((option) => (
                  <Pressable
                    key={option.id}
                    onPress={() => choose(option.id)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: option.id === selectedId }}
                    accessibilityLabel={option.label}
                    android_ripple={{ color: 'rgba(37, 99, 235, 0.12)' }}
                    style={{
                      minHeight: size.control,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: space.lg,
                      paddingHorizontal: space.lg,
                      borderBottomWidth: 1,
                      borderBottomColor: colors.outlineVariant,
                      backgroundColor:
                        option.id === selectedId ? colors.primaryContainer : colors.surface,
                    }}
                  >
                    <OptionText>{option.label}</OptionText>
                    {option.id === selectedId && <Icon name="check" color={colors.primary} />}
                  </Pressable>
                ))}
              </Results>
              {results.length === 0 && (
                <Hint accessibilityLiveRegion="polite">Nada com “{query.trim()}”.</Hint>
              )}
            </>
          )}
        </>
      )}
    </>
  )
}
