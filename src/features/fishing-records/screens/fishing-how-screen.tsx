import { router } from 'expo-router'
import { useState } from 'react'
import styled from 'styled-components/native'

import { Button } from '@/components/Button'
import { FilterChip } from '@/components/filter-chip'
import { FormScreen } from '@/components/FormScreen'
import { QueryFeedback } from '@/components/QueryFeedback'
import { SelectField } from '@/components/SelectField'
import { TextField } from '@/components/TextField'
import { normalize } from '@/utils/text'

import { useFishingRecordForm } from '../contexts/fishing-record-form-context'
import { useFishingLocationTypes } from '../api/get-fishing-location-types'
import { useFishingMethods } from '../api/get-fishing-methods'
import { useFishingRecords } from '../api/get-fishing-records'
import { activeOptions } from '../utils/catalog-options'
import { recentLocationNames } from '../utils/recent-location-names'
import { hasAnyError, validateHow, type HowErrors } from '../utils/validate-fishing-record'

// Quantos lugares já usados aparecem como atalho embaixo do nome.
const RECENT_PLACES_LIMIT = 4

const RecentPlaces = styled.View`
  gap: ${({ theme }) => theme.space.sm}px;
`

const RecentPlacesLabel = styled.Text`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  line-height: ${({ theme }) => theme.typography.body.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`

// Quebra de linha em vez de rolar de lado: todos os atalhos ficam à vista.
const RecentPlacesRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.sm}px;
`

// Passo 2 de 5: onde e como pescou. Tipo de local e método vêm do catálogo; o nome do lugar é
// escrito, ou tocado entre os que o pescador já usou.
export function FishingHowScreen() {
  const { draft, update } = useFishingRecordForm()
  const [errors, setErrors] = useState<HowErrors>({})
  const locationTypesQuery = useFishingLocationTypes()
  const methodsQuery = useFishingMethods()
  const recordsQuery = useFishingRecords()

  const locationOptions = activeOptions(locationTypesQuery.data, (item) => item.name)
  const methodOptions = activeOptions(methodsQuery.data, (item) => item.name)
  const recentPlaces = recentLocationNames(recordsQuery.data ?? [], RECENT_PLACES_LIMIT)

  function next() {
    const nextErrors = validateHow(draft)

    setErrors(nextErrors)
    if (hasAnyError(nextErrors)) return

    router.push('/fishing-records/new/catches')
  }

  function retryCatalogs() {
    locationTypesQuery.refetch()
    methodsQuery.refetch()
  }

  function changeLocationName(locationName: string) {
    update({ locationName })
    setErrors((current) => ({ ...current, locationName: undefined }))
  }

  return (
    <FormScreen
      appBarTitle="Registrar pesca"
      progress={{ step: 2, total: 5 }}
      headline="Onde e como você pescou?"
      example="Escolha o tipo de lugar, escreva o nome dele e escolha como pescou."
      footer={<Button label="Continuar" onPress={next} />}
    >
      <QueryFeedback
        isPending={locationTypesQuery.isPending || methodsQuery.isPending}
        isError={locationTypesQuery.isError || methodsQuery.isError}
        error={locationTypesQuery.error ?? methodsQuery.error}
        onRetry={retryCatalogs}
      />
      {locationTypesQuery.isSuccess && (
        <SelectField
          label="Onde você pescou"
          options={locationOptions}
          selectedId={draft.typeLocationId}
          onSelect={(typeLocationId) => {
            update({ typeLocationId })
            setErrors((current) => ({ ...current, typeLocation: undefined }))
          }}
          error={errors.typeLocation}
          emptyMessage="Nenhum tipo de local cadastrado ainda."
        />
      )}
      <TextField
        label="Nome do lugar"
        helper="Ex.: Rio Pardo"
        value={draft.locationName}
        onChangeText={changeLocationName}
        error={errors.locationName}
        autoCapitalize="words"
        maxLength={120}
        returnKeyType="done"
      />
      {recentPlaces.length > 0 && (
        <RecentPlaces>
          <RecentPlacesLabel>Lugares que você já usou:</RecentPlacesLabel>
          <RecentPlacesRow>
            {recentPlaces.map((place) => (
              <FilterChip
                key={place}
                label={place}
                role="radio"
                selected={normalize(place) === normalize(draft.locationName)}
                onPress={() => changeLocationName(place)}
              />
            ))}
          </RecentPlacesRow>
        </RecentPlaces>
      )}
      {methodsQuery.isSuccess && (
        <SelectField
          label="Como você pescou"
          options={methodOptions}
          selectedId={draft.fishingMethodId}
          onSelect={(fishingMethodId) => {
            update({ fishingMethodId })
            setErrors((current) => ({ ...current, fishingMethod: undefined }))
          }}
          error={errors.fishingMethod}
          emptyMessage="Nenhum método de pesca cadastrado ainda."
        />
      )}
    </FormScreen>
  )
}
