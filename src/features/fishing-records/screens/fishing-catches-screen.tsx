import { router } from 'expo-router'
import { useState } from 'react'

import { Button } from '@/components/Button'
import { FormMessage } from '@/components/FormMessage'
import { FormScreen } from '@/components/FormScreen'
import { QueryFeedback } from '@/components/QueryFeedback'
import { useMe } from '@/hooks/use-me'
import { toIsoDate } from '@/utils/iso-date'

import { useFishingBanCheck } from '../api/get-fishing-ban-check'
import { useSpecies } from '../api/get-species'
import { CatchCard } from '../components/catch-card'
import { useFishingRecordForm } from '../contexts/fishing-record-form-context'
import type { FishingBanCheckInput } from '../types/fishing-ban-check'
import { activeOptions } from '../utils/catalog-options'
import { hasSale } from '../utils/build-fishing-record-input'
import { hasAnyError, validateCatches, type CatchErrors } from '../utils/validate-fishing-record'

// Passo 3 de 5: as espécies, a quantidade e a venda de cada uma.
export function FishingCatchesScreen() {
  const { draft, addCatch, updateCatch, removeCatch } = useFishingRecordForm()
  const [errors, setErrors] = useState<CatchErrors>({ byKey: {} })
  const speciesQuery = useSpecies()
  const meQuery = useMe()

  const speciesOptions = activeOptions(speciesQuery.data, (item) => item.main_name)
  const speciesIds = draft.catches.flatMap((item) =>
    item.speciesId === null ? [] : [item.speciesId],
  )
  const banInput: FishingBanCheckInput | null =
    draft.typeLocationId !== null && meQuery.data && speciesIds.length > 0
      ? {
          date: toIsoDate(draft.fishingDate),
          municipality: meQuery.data.fk_municipality_ibge_code,
          typeLocationId: draft.typeLocationId,
          speciesIds,
        }
      : null
  const banQuery = useFishingBanCheck(banInput)

  function next() {
    const nextErrors = validateCatches(draft.catches)

    setErrors(nextErrors)
    if (hasAnyError({ list: nextErrors.list, ...nextErrors.byKey })) return

    router.push(
      hasSale(draft.catches) ? '/fishing-records/new/sale' : '/fishing-records/new/review',
    )
  }

  return (
    <FormScreen
      appBarTitle="Registrar pesca"
      progress={{ step: 3, total: 5 }}
      headline="O que você pescou?"
      example="Escolha a espécie, a quantidade e se vendeu."
      footer={<Button label="Continuar" onPress={next} />}
    >
      <QueryFeedback
        isPending={speciesQuery.isPending}
        isError={speciesQuery.isError}
        error={speciesQuery.error}
        onRetry={() => speciesQuery.refetch()}
      />
      {speciesQuery.isSuccess &&
        draft.catches.map((item, position) => (
          <CatchCard
            key={item.key}
            index={position + 1}
            item={item}
            speciesOptions={speciesOptions}
            banCheck={banQuery.data?.find((check) => check.species_id === item.speciesId)}
            error={errors.byKey[item.key]}
            onChange={(changes) => updateCatch(item.key, changes)}
            onRemove={() => removeCatch(item.key)}
          />
        ))}
      {banQuery.isError && (
        <FormMessage tone="error">
          Não foi possível checar o defeso agora. Você pode continuar.
        </FormMessage>
      )}
      {speciesQuery.isSuccess && (
        <Button variant="outlined" label="Adicionar outra espécie" onPress={addCatch} />
      )}
      {errors.list && <FormMessage tone="error">{errors.list}</FormMessage>}
    </FormScreen>
  )
}
