import { parseDecimal } from '@/utils/parse-decimal'

import type { CatchDraft, FishingRecordDraft, SaleDraft } from '../types/fishing-record'

// Mensagens do passo "Como pescou", por campo.
export type HowErrors = {
  typeLocation?: string
  locationName?: string
  fishingMethod?: string
}

// Mensagens das linhas de captura, pela chave da linha, e uma geral para a lista vazia.
export type CatchErrors = {
  list?: string
  byKey: Record<string, string | undefined>
}

export type SaleErrors = {
  totalValue?: string
  buyerTypes?: string
}

/**
 * Confere o passo "Como pescou": tipo de local, nome do lugar e método são obrigatórios.
 *
 * @example
 * validateHow(draft) // { typeLocation: 'Escolha onde você pescou.' }
 */
export function validateHow(draft: FishingRecordDraft): HowErrors {
  return {
    typeLocation: draft.typeLocationId === null ? 'Escolha onde você pescou.' : undefined,
    locationName:
      draft.locationName.trim() === '' ? 'Escreva o nome do lugar onde pescou.' : undefined,
    fishingMethod: draft.fishingMethodId === null ? 'Escolha como você pescou.' : undefined,
  }
}

function validateCatch(item: CatchDraft, speciesIds: number[]): string | undefined {
  if (item.speciesId === null) return 'Escolha a espécie.'
  if (speciesIds.filter((id) => id === item.speciesId).length > 1)
    return 'Esta espécie já está na lista.'
  if (parseDecimal(item.quantity) === null)
    return 'Escreva a quantidade. Use números, como 12 ou 12,5.'
  if (item.sold === null) return 'Diga se você vendeu esta espécie.'
  // Mesma palavra do rótulo do campo (catch-card.tsx): "quilo" com Quilos, "unidade" com Unidades.
  if (item.sold && parseDecimal(item.unitValue) === null)
    return `Escreva o preço de cada ${item.unit === 'KG' ? 'quilo vendido' : 'unidade vendida'}, em reais. Use números, como 8 ou 8,50.`

  return undefined
}

/**
 * Confere as capturas: ao menos uma, cada uma com espécie, quantidade e resposta de venda.
 *
 * @example
 * validateCatches(draft.catches) // { list: undefined, byKey: { 'catch-1': 'Escolha a espécie.' } }
 */
export function validateCatches(catches: CatchDraft[]): CatchErrors {
  const speciesIds = catches.flatMap((item) => (item.speciesId === null ? [] : [item.speciesId]))
  const byKey = Object.fromEntries(
    catches.map((item) => [item.key, validateCatch(item, speciesIds)]),
  )

  return {
    list: catches.length === 0 ? 'Adicione pelo menos uma espécie.' : undefined,
    byKey,
  }
}

/**
 * Confere a venda, só quando a pessoa disse que vendeu: valor e ao menos um comprador.
 *
 * @example
 * validateSale(draft.sale) // { totalValue: 'Escreva o valor vendido.' }
 */
export function validateSale(sale: SaleDraft): SaleErrors {
  return {
    totalValue:
      parseDecimal(sale.totalValue) === null
        ? 'Escreva o valor total vendido, em reais.'
        : undefined,
    buyerTypes:
      sale.buyerTypeIds.length === 0 ? 'Escolha pelo menos um tipo de comprador.' : undefined,
  }
}

/**
 * Diz se há algum erro no objeto de mensagens (ex.: `hasAnyError(validateSale(sale))`).
 *
 * @example
 * hasAnyError({ totalValue: 'Escreva o valor.' }) // true
 */
export function hasAnyError(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some((message) => message !== undefined)
}
