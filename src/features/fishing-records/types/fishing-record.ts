// Situação do registro. "Em andamento" é o que o pescador deixa para terminar depois.
// Valores provisórios: ver `fishing_record.status` em ../pescareSQL_v1.sql.
export type FishingRecordStatus = 'EM_ANDAMENTO' | 'FINALIZADO'

// Unidade da captura. Valores provisórios: ver `fishing_record_species.unit_measure`.
export type CatchUnit = 'KG' | 'UNIDADE'

// Uma linha de captura no formulário, ainda sem ser enviada. `sold` é null até a pessoa responder.
export type CatchDraft = {
  key: string
  speciesId: number | null
  quantity: string
  unit: CatchUnit
  sold: boolean | null
  // Preço de cada quilo ou unidade vendida. Só é pedido quando a espécie foi vendida.
  unitValue: string
}

export type SaleDraft = {
  date: Date
  totalValue: string
  buyerTypeIds: number[]
}

// Tudo que o fluxo de registro junta enquanto a pessoa passa pelos passos. Houve venda quando
// alguma captura foi marcada como vendida: a pergunta é feita por espécie, não duas vezes.
export type FishingRecordDraft = {
  fishingDate: Date
  // Cidade onde pescou, quando é outra que não a do cadastro. null = usa a do cadastro.
  municipalityCode: string | null
  typeLocationId: number | null
  // Nome do lugar, como o pescador chama (REAP: "Nome do local"). Obrigatório.
  locationName: string
  fishingMethodId: number | null
  catches: CatchDraft[]
  sale: SaleDraft
}

// Corpo do POST /fishing-records (fishing-records.schema.ts no backend).
// Datas em "AAAA-MM-DD"; campos em snake_case, como o resto da API.
export type CreateFishingRecordInput = {
  fishing_date: string
  fk_municipality_ibge_code: string
  fk_type_location_id: number
  fk_fishing_method_id: number
  location_name: string
  status: FishingRecordStatus
  species: {
    fk_species_id: number
    quantity: number
    unit_measure: CatchUnit
    commercialized: boolean
    unit_value?: number
  }[]
  commercialization: {
    commercialization_date: string
    total_value: number
    buyer_type_ids: number[]
  } | null
}

// Pesca como a API devolve em GET /fishing-records e GET /fishing-records/:id (formato do
// fishing-records.mapper.ts no backend). Valores decimais já chegam como número.
export type FishingRecord = {
  id: number
  fishing_date: string
  status: FishingRecordStatus
  fk_municipality_ibge_code: string
  fk_type_location_id: number
  fk_fishing_method_id: number
  // null só em pescas gravadas antes de o nome do lugar ser pedido.
  location_name: string | null
  species: SpeciesCatch[]
  commercialization: FishingRecordSale | null
}

// Uma espécie capturada na pesca, com o nome que a API já traz.
export type SpeciesCatch = {
  id: number
  fk_species_id: number
  main_name: string
  quantity: number
  unit_measure: CatchUnit
  unit_value: number | null
  commercialized: boolean
}

// A venda de uma pesca (o app grava uma por pesca). `buyer_types` já vem com o nome.
export type FishingRecordSale = {
  id: number
  commercialization_date: string
  total_value: number
  buyer_types: { id: number; name: string }[]
}
