// Datas do backend chegam como texto "AAAA-MM-DD". `new Date('AAAA-MM-DD')` lê como UTC e
// mostra o dia anterior no Brasil (UTC−3), então a conversão é feita aqui, na data local.

/**
 * Converte uma data local para "AAAA-MM-DD", o formato que a API espera.
 *
 * @example
 * toIsoDate(new Date(2026, 10, 2)) // "2026-11-02"
 */
export function toIsoDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

/**
 * Lê "AAAA-MM-DD" como data local, sem deslocar o dia.
 *
 * @example
 * parseIsoDate('2026-11-02') // 2 de novembro de 2026, à meia-noite local
 */
export function parseIsoDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)

  return new Date(year, month - 1, day)
}

/**
 * Mostra a data como o pescador lê: "02/11/2026".
 *
 * @example
 * formatDateLabel(new Date(2026, 10, 2)) // "02/11/2026"
 */
export function formatDateLabel(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')

  return `${day}/${month}/${date.getFullYear()}`
}

/**
 * Prefixo "AAAA-MM" de uma data local, para casar com as datas "AAAA-MM-DD" da API.
 *
 * @example
 * monthPrefix(new Date(2026, 10, 2)) // "2026-11"
 */
export function monthPrefix(date: Date): string {
  return toIsoDate(date).slice(0, 7)
}

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

/**
 * Nome do mês pelo índice do `Date.getMonth()` (0 é janeiro). Sem `Intl`, como `formatBrl`.
 *
 * @example
 * formatMonthName(10) // "Novembro"
 */
export function formatMonthName(monthIndex: number): string {
  return MONTH_NAMES[monthIndex] ?? ''
}

/**
 * Nome do mês com o ano, como título da home: "Novembro de 2026".
 *
 * @example
 * formatMonthLabel(new Date(2026, 10, 2)) // "Novembro de 2026"
 */
export function formatMonthLabel(date: Date): string {
  return `${formatMonthName(date.getMonth())} de ${date.getFullYear()}`
}
