import { useQuery } from '@tanstack/react-query'

import { listMunicipalities } from '@/services/municipalities'

/**
 * Lista de municípios (cache de 1 dia no app, a mesma usada pelo cadastro).
 *
 * @example
 * const { data: municipalities } = useMunicipalities()
 */
export function useMunicipalities() {
  return useQuery({
    queryKey: ['municipalities'],
    queryFn: listMunicipalities,
    staleTime: 24 * 60 * 60_000,
  })
}
