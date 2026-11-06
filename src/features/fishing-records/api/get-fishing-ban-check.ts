import { queryOptions, useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api-client'

import type { FishingBanCheckInput, SpeciesFishingBanCheck } from '../types/fishing-ban-check'

/**
 * Diz, para cada espécie, se ela está em defeso na data, no município e no tipo de local
 * (GET /fishing-ban-periods/in-effect). Só informa: não bloqueia o registro.
 *
 * @example
 * const checks = await getFishingBanCheck({ date: '2026-11-02', municipality: '3550308', typeLocationId: 1, speciesIds: [4] })
 */
export const getFishingBanCheck = async (
  input: FishingBanCheckInput,
): Promise<SpeciesFishingBanCheck[]> => {
  const { data } = await api.get<SpeciesFishingBanCheck[]>('/fishing-ban-periods/in-effect', {
    params: {
      date: input.date,
      municipality: input.municipality,
      typeLocationId: input.typeLocationId,
      speciesIds: input.speciesIds.join(','),
    },
  })

  return data
}

/**
 * Query options da checagem de defeso. Só roda com espécies escolhidas e local definido.
 *
 * @example
 * const query = useFishingBanCheck({ date, municipality, typeLocationId, speciesIds })
 */
export const getFishingBanCheckQueryOptions = (input: FishingBanCheckInput) =>
  queryOptions({
    queryKey: ['fishing-ban-periods', 'in-effect', input],
    queryFn: () => getFishingBanCheck(input),
  })

// Usado só quando não há dados ainda: a consulta fica desligada (`enabled: false`).
const EMPTY_INPUT: FishingBanCheckInput = {
  date: '',
  municipality: '',
  typeLocationId: 0,
  speciesIds: [],
}

/**
 * Checagem de defeso das espécies do registro, desligada enquanto faltar algum dado.
 *
 * @example
 * const banQuery = useFishingBanCheck(input)
 */
export const useFishingBanCheck = (input: FishingBanCheckInput | null) =>
  useQuery({
    ...getFishingBanCheckQueryOptions(input ?? EMPTY_INPUT),
    enabled: input !== null && input.speciesIds.length > 0,
  })
