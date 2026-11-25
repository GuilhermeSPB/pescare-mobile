import styled from 'styled-components/native'

import { Button } from '@/components/Button'
import { ChoiceGroup, type ChoiceOption } from '@/components/ChoiceGroup'
import { FormMessage } from '@/components/FormMessage'
import { SelectField, type SelectOption } from '@/components/SelectField'
import { TextField } from '@/components/TextField'

import type { CatchDraft } from '../types/fishing-record'
import type { SpeciesFishingBanCheck } from '../types/fishing-ban-check'
import { CATCH_UNIT_OPTIONS } from '../utils/catch-unit'
import { formatBanWindow } from '@/utils/format-ban-window'

type CatchChanges = Partial<Omit<CatchDraft, 'key'>>

type CatchCardProps = {
  index: number
  item: CatchDraft
  speciesOptions: SelectOption[]
  // Resultado da checagem de defeso dessa espécie, quando já foi consultada.
  banCheck?: SpeciesFishingBanCheck
  error?: string
  onChange: (changes: CatchChanges) => void
  onRemove: () => void
}

type SoldAnswer = 'SIM' | 'NAO'

const SOLD_OPTIONS: ChoiceOption<SoldAnswer>[] = [
  { value: 'SIM', label: 'Sim' },
  { value: 'NAO', label: 'Não' },
]

const UNIT_OPTIONS: ChoiceOption<'KG' | 'UNIDADE'>[] = CATCH_UNIT_OPTIONS

const Container = styled.View`
  gap: ${({ theme }) => theme.space.lg}px;
  padding: ${({ theme }) => theme.space.lg}px;
  border-radius: ${({ theme }) => theme.radius.card}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.outlineVariant};
  background-color: ${({ theme }) => theme.colors.surface};
`

const Heading = styled.Text`
  font-size: ${({ theme }) => theme.typography.title.fontSize}px;
  line-height: ${({ theme }) => theme.typography.title.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.title.fontWeight};
  color: ${({ theme }) => theme.colors.onSurface};
`

const Question = styled.Text`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  line-height: ${({ theme }) => theme.typography.body.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`

function soldAnswer(sold: boolean | null): SoldAnswer | null {
  if (sold === null) return null

  return sold ? 'SIM' : 'NAO'
}

// Texto do defeso para o pescador: o que está proibido, de quando a quando, pela norma.
function banMessage(banCheck: SpeciesFishingBanCheck): string {
  const periods = banCheck.periods.map((period) => {
    const windows = period.windows.map(formatBanWindow).join(', ')

    return `${period.rule}, de ${windows}`
  })

  return `Esta espécie está em defeso nesta data (${periods.join('; ')}). Você ainda pode salvar a pesca.`
}

// Uma espécie do registro: o que foi pescado, quanto, e se foi vendido.
export function CatchCard({
  index,
  item,
  speciesOptions,
  banCheck,
  error,
  onChange,
  onRemove,
}: CatchCardProps) {
  return (
    <Container>
      <Heading accessibilityRole="header">Espécie {index}</Heading>
      <SelectField
        label="Espécie"
        options={speciesOptions}
        selectedId={item.speciesId}
        onSelect={(speciesId) => onChange({ speciesId })}
        emptyMessage="Nenhuma espécie cadastrada ainda."
      />
      {banCheck?.is_in_fishing_ban && (
        <FormMessage tone="error">{banMessage(banCheck)}</FormMessage>
      )}
      <TextField
        label="Quantidade"
        value={item.quantity}
        onChangeText={(quantity) => onChange({ quantity })}
        keyboardType="decimal-pad"
        returnKeyType="done"
      />
      <Question>Medida</Question>
      <ChoiceGroup
        label="Medida"
        options={UNIT_OPTIONS}
        value={item.unit}
        onChange={(unit) => onChange({ unit })}
      />
      <Question>Vendeu esta espécie?</Question>
      <ChoiceGroup
        label="Vendeu esta espécie?"
        options={SOLD_OPTIONS}
        value={soldAnswer(item.sold)}
        onChange={(answer) => onChange({ sold: answer === 'SIM' })}
      />
      {item.sold === true && (
        <TextField
          label={item.unit === 'KG' ? 'Preço de cada quilo (R$)' : 'Preço de cada unidade (R$)'}
          value={item.unitValue}
          onChangeText={(unitValue) => onChange({ unitValue })}
          keyboardType="decimal-pad"
          returnKeyType="done"
        />
      )}
      {error && <FormMessage tone="error">{error}</FormMessage>}
      <Button variant="text" label="Tirar esta espécie" onPress={onRemove} />
    </Container>
  )
}
