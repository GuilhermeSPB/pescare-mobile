import type { FishingBanWindow } from '@/types/fishing-ban'

/**
 * Mostra a janela do defeso como o pescador lê: "01-11" vira "01/11".
 *
 * @example
 * formatBanWindow({ start_date: '11-01', end_date: '02-28' }) // "01/11 a 28/02"
 */
export function formatBanWindow(window: FishingBanWindow): string {
  const toDayMonth = (value: string) => value.split('-').reverse().join('/')

  return `${toDayMonth(window.start_date)} a ${toDayMonth(window.end_date)}`
}
