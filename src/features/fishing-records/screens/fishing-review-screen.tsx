import { Button } from '@/components/Button'
import { FormMessage } from '@/components/FormMessage'
import { FormScreen } from '@/components/FormScreen'
import { SectionCard } from '@/components/SectionCard'
import { useMe } from '@/hooks/use-me'
import { useMunicipalities } from '@/hooks/use-municipalities'
import { ApiError } from '@/lib/api-client'
import { formatBrl } from '@/utils/format-currency'
import { formatDateLabel } from '@/utils/iso-date'
import { parseDecimal } from '@/utils/parse-decimal'
import { findMunicipality, stateName } from '@/utils/municipalities'

import { useBuyerTypes } from '../api/get-buyer-types'
import { useCreateFishingRecord } from '../api/create-fishing-record'
import { useFishingLocationTypes } from '../api/get-fishing-location-types'
import { useFishingMethods } from '../api/get-fishing-methods'
import { useSpecies } from '../api/get-species'
import { RecordBlock, RecordLine, RecordNote } from '../components/record-text'
import { useExitFishingRecordFlow } from '../hooks/use-exit-fishing-record-flow'
import { useFishingRecordForm } from '../contexts/fishing-record-form-context'
import type { FishingRecordDraft, FishingRecordStatus } from '../types/fishing-record'
import { buildFishingRecordInput, hasSale } from '../utils/build-fishing-record-input'
import { catchUnitLabel } from '../utils/catch-unit'
import { labelFor } from '../utils/label-for'

const SUBMIT_ERROR = 'Não foi possível salvar a pesca. Confira sua internet e tente de novo.'

// Venda em uma frase: "Venda em 02/11/2026, por R$ 300,00".
function saleLine(draft: FishingRecordDraft): string | null {
  const totalValue = parseDecimal(draft.sale.totalValue)

  if (!hasSale(draft.catches) || totalValue === null) return null

  return `Venda em ${formatDateLabel(draft.sale.date)}, por ${formatBrl(totalValue)}`
}

// Passo 5 de 5: confere o que foi digitado e grava. Terminar agora ou guardar para completar depois.
export function FishingReviewScreen() {
  const { draft } = useFishingRecordForm()
  const meQuery = useMe()
  const municipalitiesQuery = useMunicipalities()
  const speciesQuery = useSpecies()
  const locationTypesQuery = useFishingLocationTypes()
  const methodsQuery = useFishingMethods()
  const buyerTypesQuery = useBuyerTypes()
  const createMutation = useCreateFishingRecord()
  const exitFlow = useExitFishingRecordFlow()

  function save(status: FishingRecordStatus) {
    const municipalityCode = draft.municipalityCode ?? meQuery.data?.fk_municipality_ibge_code
    const input = municipalityCode ? buildFishingRecordInput(draft, status, municipalityCode) : null

    if (!input) return

    createMutation.mutate(input, {
      // A lista de pescas se atualiza sozinha (ver useCreateFishingRecord); aqui só volta à área logada.
      onSuccess: exitFlow,
    })
  }

  const sale = saleLine(draft)
  const city = findMunicipality(
    municipalitiesQuery.data,
    draft.municipalityCode ?? meQuery.data?.fk_municipality_ibge_code ?? '',
  )
  // Depois de gravar, os botões ficam travados: um novo toque criaria a pesca em duplicidade.
  const readyToSave = meQuery.isSuccess && !createMutation.isPending && !createMutation.isSuccess

  return (
    <FormScreen
      appBarTitle="Registrar pesca"
      progress={{ step: 5, total: 5 }}
      headline="Confira antes de salvar"
      example="Você pode terminar agora ou guardar para completar depois."
      footer={
        <>
          {createMutation.isError && (
            <FormMessage tone="error">
              {createMutation.error instanceof ApiError
                ? createMutation.error.message
                : SUBMIT_ERROR}
            </FormMessage>
          )}
          <Button
            label="Terminar agora"
            onPress={() => save('FINALIZADO')}
            loading={createMutation.isPending}
            disabled={!readyToSave}
          />
          <Button
            variant="outlined"
            label="Salvar e terminar depois"
            onPress={() => save('EM_ANDAMENTO')}
            disabled={!readyToSave}
          />
        </>
      }
    >
      <SectionCard title="Pesca">
        <RecordBlock>
          <RecordLine>Dia: {formatDateLabel(draft.fishingDate)}</RecordLine>
          <RecordLine>Cidade: {city ? `${city.name} (${stateName(city.uf)})` : '—'}</RecordLine>
          <RecordLine>
            Onde:{' '}
            {labelFor(locationTypesQuery.data, draft.typeLocationId, (item) => item.name, '—')}
          </RecordLine>
          <RecordLine>Lugar: {draft.locationName.trim() || '—'}</RecordLine>
          <RecordLine>
            Como: {labelFor(methodsQuery.data, draft.fishingMethodId, (item) => item.name, '—')}
          </RecordLine>
        </RecordBlock>
      </SectionCard>
      <SectionCard title="O que você pescou">
        <RecordBlock>
          {draft.catches.map((item) => (
            <RecordLine key={item.key}>
              {labelFor(
                speciesQuery.data,
                item.speciesId,
                (species) => species.main_name,
                'Espécie',
              )}
              : {item.quantity} {catchUnitLabel(item.unit).toLowerCase()}
              {item.sold ? ' (vendida)' : ''}
            </RecordLine>
          ))}
          {sale && <RecordNote>{sale}</RecordNote>}
          {sale && (
            <RecordNote>
              Para:{' '}
              {draft.sale.buyerTypeIds
                .map((id) => labelFor(buyerTypesQuery.data, id, (item) => item.name, ''))
                .join(', ')}
            </RecordNote>
          )}
        </RecordBlock>
      </SectionCard>
    </FormScreen>
  )
}
