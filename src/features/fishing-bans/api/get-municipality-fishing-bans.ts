import { queryOptions, useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api-client'
import { toIsoDate } from '@/utils/iso-date'

import type { MunicipalityFishingBan } from '../types/municipality-fishing-ban'

/**
 * Defesos que valem na cidade no dia e os que vão começar
 * (GET /fishing-ban-periods/for-municipality).
 *
 * @example
 * const bans = await getMunicipalityFishingBans('3550308', '2026-11-03')
 */
export const getMunicipalityFishingBans = async (
  municipality: string,
  date: string,
): Promise<MunicipalityFishingBan[]> => {
  const { data } = await api.get<MunicipalityFishingBan[]>(
    '/fishing-ban-periods/for-municipality',
    {
      params: { municipality, date },
    },
  )

  return data
}

/**
 * Query options dos defesos da cidade. A chave começa com `['fishing-bans']`.
 *
 * @example
 * queryClient.invalidateQueries({ queryKey: ['fishing-bans'] })
 */
export const getMunicipalityFishingBansQueryOptions = (municipality: string, date: string) =>
  queryOptions({
    queryKey: ['fishing-bans', 'municipality', municipality, date],
    queryFn: () => getMunicipalityFishingBans(municipality, date),
  })

/**
 * Defesos da cidade do pescador como estado do servidor. Fica parada enquanto a cidade não chega.
 * A data é a do aparelho, para "hoje" bater com o dia do pescador.
 *
 * @example
 * const bansQuery = useMunicipalityFishingBans(me?.fk_municipality_ibge_code ?? null)
 */
export const useMunicipalityFishingBans = (municipality: string | null) => {
  const date = toIsoDate(new Date())

  return useQuery({
    ...getMunicipalityFishingBansQueryOptions(municipality ?? '', date),
    enabled: municipality !== null,
  })
}
