import type { Municipality } from '@/types/municipality'
import type { SummaryPeriod } from '@/types/summary-period'

import type { FishingLocationType, NamedCatalogItem, Species } from './catalogs'
import type { CatchUnit } from './fishing-record'

// O período do resumo é o `SummaryPeriod` compartilhado (@/types/summary-period): o REAP é anual,
// mas os dados são os mesmos mês a mês.

// Dias com pesca terminada num mês (1 a 12). Mês sem pesca entra com 0, como o REAP pede.
export type ReapWorkedMonth = {
  month: number
  workedDays: number
}

// Uma linha de "Área de realização da pesca": cada combinação de tipo de local, cidade, nome do
// lugar e método que aparece nas pescas do período.
export type ReapArea = {
  key: string
  typeLocationId: number
  municipalityCode: string
  // null em pescas gravadas antes de o nome do lugar ser pedido.
  locationName: string | null
  fishingMethodId: number
}

// Uma linha de "Resultado da operação de pesca": a espécie somada no período, numa unidade.
export type ReapCatch = {
  key: string
  speciesName: string
  unit: CatchUnit
  quantity: number
  // Preço médio do quilo ou da unidade vendida, pesado pela quantidade. null quando não vendeu.
  averagePrice: number | null
}

// Tudo o que o REAP pede sobre a atividade, tirado das pescas terminadas do período.
export type ReapSummary = {
  hasFished: boolean
  workedDays: number
  workedMonths: ReapWorkedMonth[]
  areas: ReapArea[]
  catches: ReapCatch[]
  // Espécies pescadas, para achar os grupos alvo no catálogo.
  speciesIds: number[]
  hasSold: boolean
  saleMunicipalityCodes: string[]
  // Pescas do período que ficaram sem terminar: não entram em nada acima.
  unfinishedCount: number
}

// No REAP anual, o resumo de cada mês (1 a 12), mostrado mês a mês como na escolha "Por mês".
export type ReapMonthSummary = {
  month: number
  summary: ReapSummary
}

// Catálogos que trocam os ids do resumo por nomes. Cada um pode ainda não ter chegado.
export type ReapCatalogs = {
  locationTypes: FishingLocationType[] | undefined
  methods: NamedCatalogItem[] | undefined
  municipalities: Municipality[] | undefined
  species: Species[] | undefined
  targetGroups: NamedCatalogItem[] | undefined
}

// O que vai no PDF do REAP: quem é o pescador (nome e cidade, decisão do time de 2026-11-04) e o
// mesmo resumo da tela. CPF e RGP não existem no sistema e ficam de fora.
export type ReapPdfContent = {
  fisherName: string
  // Cidade do cadastro já em texto: "Belmonte (Bahia)".
  cityLabel: string
  period: SummaryPeriod
  summary: ReapSummary
  // Os meses do ano, como na tela. Vazio quando o período é um mês.
  monthSummaries: ReapMonthSummary[]
  catalogs: ReapCatalogs
  generatedOn: Date
}
