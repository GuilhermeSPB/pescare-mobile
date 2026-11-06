/**
 * Nome de um item de catálogo pelo id guardado. Enquanto o catálogo não chega, mostra o `fallback`.
 *
 * @example
 * labelFor(methods, record.fk_fishing_method_id, (item) => item.name, '—')
 */
export function labelFor<T extends { id: number }>(
  items: T[] | undefined,
  id: number | null,
  getLabel: (item: T) => string,
  fallback: string,
): string {
  const found = items?.find((item) => item.id === id)

  return found ? getLabel(found) : fallback
}
