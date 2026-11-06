import { formatBrl } from '@/utils/format-currency'
import { formatFishingEnvironment } from '@/utils/fishing-environment'
import { formatQuantity } from '@/utils/format-quantity'
import { describeMunicipality, findMunicipality, stateName } from '@/utils/municipalities'

import type { ReapArea, ReapCatalogs, ReapCatch } from '../types/reap'
import { labelFor } from './label-for'

// Uma linha de "Onde pescou", já em texto.
export type ReapAreaRow = {
  key: string
  placeName: string
  locationLabel: string
  environmentLabel: string
  cityLabel: string
  methodLabel: string
}

// Uma linha de "O que pescou", já em texto.
export type ReapCatchRow = {
  key: string
  speciesName: string
  quantityLabel: string
  priceLabel: string
}

/**
 * Troca os ids das áreas de pesca por nomes. Enquanto um catálogo não chega, o campo mostra "—".
 *
 * @example
 * toReapAreaRows(summary.areas, catalogs)[0].cityLabel // "Belmonte (Bahia)"
 */
export function toReapAreaRows(areas: ReapArea[], catalogs: ReapCatalogs): ReapAreaRow[] {
  return areas.map((area) => {
    const locationType = catalogs.locationTypes?.find((item) => item.id === area.typeLocationId)

    return {
      key: area.key,
      placeName: area.locationName ?? 'Lugar sem nome',
      locationLabel: locationType?.name ?? '—',
      environmentLabel: formatFishingEnvironment(locationType?.environment ?? null),
      cityLabel: describeMunicipality(catalogs.municipalities, area.municipalityCode),
      methodLabel: labelFor(catalogs.methods, area.fishingMethodId, (item) => item.name, '—'),
    }
  })
}

/**
 * Quantidade e preço de cada espécie, como o REAP pede: "Preço do quilo: R$ 12,00".
 *
 * @example
 * toReapCatchRows(summary.catches)[0].priceLabel // "Não vendeu"
 */
export function toReapCatchRows(catches: ReapCatch[]): ReapCatchRow[] {
  return catches.map((item) => ({
    key: item.key,
    speciesName: item.speciesName,
    quantityLabel: `Quantidade: ${formatQuantity(item.quantity, item.unit)}`,
    priceLabel: describePrice(item),
  }))
}

function describePrice(item: ReapCatch): string {
  if (item.averagePrice === null) return 'Não vendeu'

  const unitName = item.unit === 'KG' ? 'do quilo' : 'da unidade'

  return `Preço ${unitName}: ${formatBrl(item.averagePrice)}`
}

/**
 * Nomes dos grupos alvo das espécies pescadas, sem repetir e em ordem alfabética.
 *
 * @example
 * toTargetGroupNames([1, 2], catalogs) // ["Crustáceos", "Peixes de água doce"]
 */
export function toTargetGroupNames(speciesIds: number[], catalogs: ReapCatalogs): string[] {
  const groupIds = speciesIds.flatMap((speciesId) => {
    const species = catalogs.species?.find((item) => item.id === speciesId)

    return species ? [species.fk_target_group_id] : []
  })
  const names = groupIds.flatMap((groupId) => {
    const group = catalogs.targetGroups?.find((item) => item.id === groupId)

    return group ? [group.name] : []
  })

  return [...new Set(names)].sort((a, b) => a.localeCompare(b, 'pt-BR'))
}

/**
 * Estados onde houve venda (REAP: "Estado de comercialização"), por extenso e sem repetir.
 *
 * @example
 * toSaleStateNames(['2903300'], catalogs) // ["Bahia"]
 */
export function toSaleStateNames(municipalityCodes: string[], catalogs: ReapCatalogs): string[] {
  const states = municipalityCodes.flatMap((code) => {
    const city = findMunicipality(catalogs.municipalities, code)

    return city ? [stateName(city.uf)] : []
  })

  return [...new Set(states)].sort((a, b) => a.localeCompare(b, 'pt-BR'))
}
