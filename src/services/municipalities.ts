import { api } from '@/lib/api-client'
import type { Municipality } from '@/types/municipality'

let cache: Promise<Municipality[]> | null = null

// A lista inteira (~5.600 municípios, ~300 KB) é baixada uma vez por sessão do app:
// a busca da API diferencia acentos ("belem" não acha "Belém"), então o filtro roda no aparelho.
export function listMunicipalities() {
  if (!cache) {
    cache = api
      .get<Municipality[]>('/municipalities')
      .then(({ data }) => data)
      .catch((error) => {
        cache = null
        throw error
      })
  }

  return cache
}
