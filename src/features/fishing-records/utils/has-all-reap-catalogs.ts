import type { ReapCatalogs } from '../types/reap'

/**
 * Diz se todos os catálogos do REAP já chegaram. Antes disso, o PDF sairia com "—" no lugar de
 * nomes de cidade, método e tipo de local.
 *
 * @example
 * hasAllReapCatalogs(useReapCatalogs()) // false enquanto algum ainda carrega
 */
export function hasAllReapCatalogs(catalogs: ReapCatalogs): boolean {
  return Object.values(catalogs).every((items) => items !== undefined)
}
