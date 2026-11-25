import type { FishingEnvironment } from '@/types/fishing-environment'

// Catálogos que o formulário oferece. Itens inativos existem na resposta, mas não viram opção
// para o pescador (ver PRODUCT.md): o filtro fica em ../utils/catalog-options.ts.
export type Species = {
  id: number
  main_name: string
  scientific_name: string
  is_active: boolean
  // Grupo alvo da espécie (peixes, crustáceos…): o REAP pede os grupos pescados.
  fk_target_group_id: number
}

// Métodos de pesca, tipos de comprador e grupos alvo têm o mesmo formato.
export type NamedCatalogItem = {
  id: number
  name: string
  is_active: boolean
}

// Tipo de local (rio, mar…). O ambiente vem dele, sem o pescador escolher; é null num tipo
// que o painel cadastrou sem informar o ambiente.
export type FishingLocationType = NamedCatalogItem & {
  environment: FishingEnvironment | null
}
