import type { FishingBanWindow } from '@/types/fishing-ban'
import type { FishingEnvironment } from '@/types/fishing-environment'

// Situação do defeso no dia: vale agora na cidade, ou começa depois.
export type FishingBanStatus = 'EM_VIGOR' | 'PROXIMO'

// Defeso da cidade como a API devolve em GET /fishing-ban-periods/for-municipality.
// Datas em "AAAA-MM-DD"; janelas em "MM-DD". Campos em snake_case, como o resto da API.
export type MunicipalityFishingBan = {
  id: number
  status: FishingBanStatus
  // Só em PROXIMO: quando a próxima janela começa.
  starts_on: string | null
  // Só em EM_VIGOR: quando a janela atual acaba (limitada pelo fim da norma).
  ends_on: string | null
  start_in: string
  valid_until: string | null
  fishing_ban: {
    id: number
    rule: string
    fishing_ban_type: FishingEnvironment
  }
  windows: FishingBanWindow[]
  applies_to_all_species: boolean
  species: { id: number; main_name: string; scientific_name: string }[]
  applies_to_all_location_types: boolean
  location_types: { id: number; name: string }[]
  observation: string | null
}
