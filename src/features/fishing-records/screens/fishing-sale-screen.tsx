import { router } from 'expo-router'
import { useState } from 'react'
import styled from 'styled-components/native'

import { Button } from '@/components/Button'
import { CheckRow } from '@/components/CheckRow'
import { DateField } from '@/components/DateField'
import { FormMessage } from '@/components/FormMessage'
import { FormScreen } from '@/components/FormScreen'
import { QueryFeedback } from '@/components/QueryFeedback'
import { TextField } from '@/components/TextField'

import { useBuyerTypes } from '../api/get-buyer-types'
import { useFishingRecordForm } from '../contexts/fishing-record-form-context'
import { activeOptions } from '../utils/catalog-options'
import { hasAnyError, validateSale, type SaleErrors } from '../utils/validate-fishing-record'

const Question = styled.Text`
  font-size: ${({ theme }) => theme.typography.bodyLarge.fontSize}px;
  line-height: ${({ theme }) => theme.typography.bodyLarge.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  color: ${({ theme }) => theme.colors.onSurface};
`

// Passo 4 de 5: só aparece quando alguma espécie foi marcada como vendida.
export function FishingSaleScreen() {
  const { draft, updateSale } = useFishingRecordForm()
  const [errors, setErrors] = useState<SaleErrors>({})
  const buyerTypesQuery = useBuyerTypes()
  const buyerOptions = activeOptions(buyerTypesQuery.data, (item) => item.name)

  function toggleBuyerType(id: number) {
    const buyerTypeIds = draft.sale.buyerTypeIds.includes(id)
      ? draft.sale.buyerTypeIds.filter((current) => current !== id)
      : [...draft.sale.buyerTypeIds, id]

    updateSale({ buyerTypeIds })
    setErrors((current) => ({ ...current, buyerTypes: undefined }))
  }

  function next() {
    const nextErrors = validateSale(draft.sale)

    setErrors(nextErrors)
    if (hasAnyError(nextErrors)) return

    router.push('/fishing-records/new/review')
  }

  return (
    <FormScreen
      appBarTitle="Registrar pesca"
      progress={{ step: 4, total: 5 }}
      headline="Como foi a venda?"
      example="Escreva o valor total que recebeu por tudo o que vendeu nesta pesca."
      footer={<Button label="Continuar" onPress={next} />}
    >
      <DateField
        label="Dia da venda"
        value={draft.sale.date}
        maximumDate={new Date()}
        onChange={(date) => updateSale({ date })}
      />
      <TextField
        label="Valor total vendido (R$)"
        value={draft.sale.totalValue}
        onChangeText={(totalValue) => {
          updateSale({ totalValue })
          setErrors((current) => ({ ...current, totalValue: undefined }))
        }}
        error={errors.totalValue}
        keyboardType="decimal-pad"
        returnKeyType="done"
      />
      <Question>Para quem você vendeu?</Question>
      <QueryFeedback
        isPending={buyerTypesQuery.isPending}
        isError={buyerTypesQuery.isError}
        error={buyerTypesQuery.error}
        onRetry={() => buyerTypesQuery.refetch()}
      />
      {buyerTypesQuery.isSuccess &&
        buyerOptions.map((option) => (
          <CheckRow
            key={option.id}
            label={option.label}
            checked={draft.sale.buyerTypeIds.includes(option.id)}
            onPress={() => toggleBuyerType(option.id)}
          />
        ))}
      {errors.buyerTypes && <FormMessage tone="error">{errors.buyerTypes}</FormMessage>}
    </FormScreen>
  )
}
