import { toIsoDate } from '@/utils/iso-date'
import { parseDecimal } from '@/utils/parse-decimal'

import type {
  CatchDraft,
  CreateFishingRecordInput,
  FishingRecordDraft,
  FishingRecordStatus,
} from '../types/fishing-record'

type SpeciesInput = CreateFishingRecordInput['species'][number]
type CommercializationInput = NonNullable<CreateFishingRecordInput['commercialization']>

/**
 * Houve venda quando ao menos uma captura foi marcada como vendida.
 *
 * @example
 * hasSale(draft.catches) // true se alguma espécie foi vendida
 */
export function hasSale(catches: CatchDraft[]): boolean {
  return catches.some((item) => item.sold === true)
}

// Devolve null quando a linha ainda não está completa: quem chama deve ter validado antes.
function toSpeciesInput(item: CatchDraft): SpeciesInput | null {
  const quantity = parseDecimal(item.quantity)

  if (item.speciesId === null || quantity === null || item.sold === null) return null

  const unitValue = item.sold ? parseDecimal(item.unitValue) : null

  return {
    fk_species_id: item.speciesId,
    quantity,
    unit_measure: item.unit,
    commercialized: item.sold,
    ...(unitValue !== null && { unit_value: unitValue }),
  }
}

function toCommercializationInput(draft: FishingRecordDraft): CommercializationInput | null {
  const totalValue = parseDecimal(draft.sale.totalValue)

  if (!hasSale(draft.catches) || totalValue === null) return null

  return {
    commercialization_date: toIsoDate(draft.sale.date),
    total_value: totalValue,
    buyer_type_ids: draft.sale.buyerTypeIds,
  }
}

/**
 * Monta o corpo do POST /fishing-records a partir do rascunho. Devolve null quando algum
 * passo ainda está incompleto, para não gravar pesca pela metade.
 *
 * @example
 * const input = buildFishingRecordInput(draft, 'EM_ANDAMENTO', '3550308')
 */
export function buildFishingRecordInput(
  draft: FishingRecordDraft,
  status: FishingRecordStatus,
  municipalityCode: string,
): CreateFishingRecordInput | null {
  const species = draft.catches.map(toSpeciesInput)
  const locationName = draft.locationName.trim()

  if (draft.typeLocationId === null || draft.fishingMethodId === null) return null
  if (locationName === '') return null
  if (species.some((item) => item === null)) return null

  return {
    fishing_date: toIsoDate(draft.fishingDate),
    fk_municipality_ibge_code: municipalityCode,
    fk_type_location_id: draft.typeLocationId,
    fk_fishing_method_id: draft.fishingMethodId,
    location_name: locationName,
    status,
    species: species.filter((item): item is SpeciesInput => item !== null),
    commercialization: toCommercializationInput(draft),
  }
}
