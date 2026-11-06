import type { CatchUnit } from '../types/fishing-record'

// Como a unidade aparece para o pescador. O valor enviado à API continua KG ou UNIDADE.
export const CATCH_UNIT_OPTIONS: { value: CatchUnit; label: string }[] = [
  { value: 'KG', label: 'Quilos' },
  { value: 'UNIDADE', label: 'Unidades' },
]

/**
 * Nome da unidade como o pescador lê: "Quilos" ou "Unidades".
 *
 * @example
 * catchUnitLabel('KG') // "Quilos"
 */
export function catchUnitLabel(unit: CatchUnit): string {
  return CATCH_UNIT_OPTIONS.find((option) => option.value === unit)?.label ?? unit
}
