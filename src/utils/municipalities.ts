import type { Municipality } from '@/types/municipality'

import { normalize } from './text'

const STATE_NAMES: Record<string, string> = {
  AC: 'Acre',
  AL: 'Alagoas',
  AM: 'Amazonas',
  AP: 'Amapá',
  BA: 'Bahia',
  CE: 'Ceará',
  DF: 'Distrito Federal',
  ES: 'Espírito Santo',
  GO: 'Goiás',
  MA: 'Maranhão',
  MG: 'Minas Gerais',
  MS: 'Mato Grosso do Sul',
  MT: 'Mato Grosso',
  PA: 'Pará',
  PB: 'Paraíba',
  PE: 'Pernambuco',
  PI: 'Piauí',
  PR: 'Paraná',
  RJ: 'Rio de Janeiro',
  RN: 'Rio Grande do Norte',
  RO: 'Rondônia',
  RR: 'Roraima',
  RS: 'Rio Grande do Sul',
  SC: 'Santa Catarina',
  SE: 'Sergipe',
  SP: 'São Paulo',
  TO: 'Tocantins',
}

export function stateName(uf: string) {
  return STATE_NAMES[uf] ?? uf
}

/**
 * Acha o município pelo código do IBGE. Devolve `undefined` quando a lista ainda não carregou
 * ou o código não existe.
 *
 * @example
 * findMunicipality(list, '3550308') // { ibge_code: '3550308', name: 'São Paulo', uf: 'SP' }
 */
export function findMunicipality(list: Municipality[] | undefined, ibgeCode: string) {
  return list?.find((municipality) => municipality.ibge_code === ibgeCode)
}

/**
 * Cidade e estado como o pescador lê: "Campinas (São Paulo)". Sem a lista ainda, "—".
 *
 * @example
 * describeMunicipality(list, '3509502') // "Campinas (São Paulo)"
 */
export function describeMunicipality(list: Municipality[] | undefined, ibgeCode: string) {
  const city = findMunicipality(list, ibgeCode)

  return city ? `${city.name} (${stateName(city.uf)})` : '—'
}

// Quem começa com o texto vem primeiro, depois quem tem uma palavra começando com ele,
// por último quem só contém o texto no meio.
export function searchMunicipalities(list: Municipality[], query: string, limit = 30) {
  const term = normalize(query)

  if (!term) return { results: [], total: 0 }

  const ranked: { municipality: Municipality; rank: number }[] = []

  for (const municipality of list) {
    const name = normalize(municipality.name)

    if (name.startsWith(term)) ranked.push({ municipality, rank: 0 })
    else if (name.includes(` ${term}`)) ranked.push({ municipality, rank: 1 })
    else if (name.includes(term)) ranked.push({ municipality, rank: 2 })
  }

  ranked.sort(
    (a, b) => a.rank - b.rank || a.municipality.name.localeCompare(b.municipality.name, 'pt-BR'),
  )

  return {
    results: ranked.slice(0, limit).map(({ municipality }) => municipality),
    total: ranked.length,
  }
}
