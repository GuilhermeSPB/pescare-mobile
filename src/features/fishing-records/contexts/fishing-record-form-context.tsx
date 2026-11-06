import { createContext, use, useState, type PropsWithChildren } from 'react'

import type { CatchDraft, FishingRecordDraft, SaleDraft } from '../types/fishing-record'

type FishingRecordFormValue = {
  draft: FishingRecordDraft
  update: (changes: Partial<FishingRecordDraft>) => void
  updateSale: (changes: Partial<SaleDraft>) => void
  addCatch: () => void
  updateCatch: (key: string, changes: Partial<Omit<CatchDraft, 'key'>>) => void
  removeCatch: (key: string) => void
}

const FishingRecordFormContext = createContext<FishingRecordFormValue | null>(null)

// A chave só serve para o React identificar a linha; não vai para a API.
let catchCounter = 0

function createCatch(): CatchDraft {
  catchCounter += 1

  return {
    key: `catch-${catchCounter}`,
    speciesId: null,
    quantity: '',
    unit: 'KG',
    sold: null,
    unitValue: '',
  }
}

function createDraft(): FishingRecordDraft {
  return {
    fishingDate: new Date(),
    municipalityCode: null,
    typeLocationId: null,
    locationName: '',
    fishingMethodId: null,
    catches: [createCatch()],
    sale: { date: new Date(), totalValue: '', buyerTypeIds: [] },
  }
}

// Guarda o que a pessoa já respondeu enquanto anda pelos passos do registro.
// Some quando o fluxo fecha: nada aqui é guardado no aparelho.
export function FishingRecordFormProvider({ children }: PropsWithChildren) {
  const [draft, setDraft] = useState<FishingRecordDraft>(createDraft)

  const value: FishingRecordFormValue = {
    draft,
    update: (changes) => setDraft((current) => ({ ...current, ...changes })),
    updateSale: (changes) =>
      setDraft((current) => ({ ...current, sale: { ...current.sale, ...changes } })),
    addCatch: () =>
      setDraft((current) => ({ ...current, catches: [...current.catches, createCatch()] })),
    updateCatch: (key, changes) =>
      setDraft((current) => ({
        ...current,
        catches: current.catches.map((item) => (item.key === key ? { ...item, ...changes } : item)),
      })),
    removeCatch: (key) =>
      setDraft((current) => ({
        ...current,
        catches: current.catches.filter((item) => item.key !== key),
      })),
  }

  return <FishingRecordFormContext value={value}>{children}</FishingRecordFormContext>
}

/**
 * Acesso ao rascunho do registro de pesca. Só funciona dentro de `FishingRecordFormProvider`.
 *
 * @example
 * const { draft, update } = useFishingRecordForm()
 */
export function useFishingRecordForm() {
  const value = use(FishingRecordFormContext)

  if (!value) {
    throw new Error('useFishingRecordForm precisa estar dentro de <FishingRecordFormProvider />')
  }

  return value
}
