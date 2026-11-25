import type { SelectOption } from '@/components/SelectField'

type ActiveItem = {
  id: number
  is_active: boolean
}

/**
 * Transforma um catálogo em opções para o pescador: só os itens ativos, na ordem do catálogo.
 * Itens inativos deixam de ser oferecidos, mas as pescas já gravadas continuam mostrando eles.
 *
 * @example
 * activeOptions(methods, (method) => method.name) // [{ id: 1, label: 'Rede' }]
 */
export function activeOptions<T extends ActiveItem>(
  items: T[] | undefined,
  getLabel: (item: T) => string,
): SelectOption[] {
  return (items ?? [])
    .filter((item) => item.is_active)
    .map((item) => ({ id: item.id, label: getLabel(item) }))
}
