import type { FishingBanWindow } from '@/types/fishing-ban'

// Resposta de GET /fishing-ban-periods/in-effect, uma entrada por espécie consultada.
export type SpeciesFishingBanCheck = {
  species_id: number
  is_in_fishing_ban: boolean
  periods: {
    id: number
    rule: string
    windows: FishingBanWindow[]
  }[]
}

export type FishingBanCheckInput = {
  date: string
  municipality: string
  typeLocationId: number
  speciesIds: number[]
}
