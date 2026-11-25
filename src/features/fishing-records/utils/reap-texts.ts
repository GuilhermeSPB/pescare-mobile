import type { SummaryPeriodKind } from '@/types/summary-period'

import type { ReapSummary } from '../types/reap'

// Textos do REAP usados nos cartões, no detalhe de cada mês do ano e no PDF: os três dizem o
// mesmo. `title` é como o pescador lê; `reapField` é o nome do campo no PesqBrasil, para achar
// onde copiar.
export const REAP_SECTIONS = {
  fished: { title: 'Pescou neste período?', reapField: 'Realizou pesca no período?' },
  workedDays: { title: 'Dias trabalhados', reapField: 'Meses trabalhados e dias de cada mês' },
  areas: { title: 'Onde pescou', reapField: 'Área de realização da pesca' },
  catches: { title: 'O que pescou', reapField: 'Resultado da operação de pesca' },
  targetGroups: { title: 'Tipos de pescado', reapField: 'Grupo alvo da pescaria' },
  sale: { title: 'Venda', reapField: 'Houve comercialização e Estado de comercialização' },
} as const

/**
 * Resposta de sim ou não, como o REAP pede.
 *
 * @example
 * formatYesNo(true) // "Sim"
 */
export function formatYesNo(value: boolean): string {
  return value ? 'Sim' : 'Não'
}

/**
 * Linha "Vendeu" da seção Venda.
 *
 * @example
 * formatSoldAnswer(false) // "Vendeu: Não"
 */
export function formatSoldAnswer(hasSold: boolean): string {
  return `Vendeu: ${formatYesNo(hasSold)}`
}

/**
 * Linha dos estados onde vendeu. Sem o catálogo de cidades ainda, "—".
 *
 * @example
 * formatSaleStates(['Bahia', 'Sergipe']) // "Estado: Bahia, Sergipe"
 */
export function formatSaleStates(stateNames: string[]): string {
  return `Estado: ${stateNames.join(', ') || '—'}`
}

/**
 * Grupos alvo numa linha só, separados por vírgula. Sem nenhum, "—".
 *
 * @example
 * formatTargetGroups(['Crustáceos', 'Peixes']) // "Crustáceos, Peixes"
 */
export function formatTargetGroups(names: string[]): string {
  return names.join(', ') || '—'
}

/**
 * Frase do período sem nenhuma pesca terminada, abaixo do "Não".
 *
 * @example
 * describeNoFinishedFishing('YEAR') // "Nenhuma pesca terminada neste ano."
 */
export function describeNoFinishedFishing(kind: SummaryPeriodKind): string {
  if (kind === 'YEAR') return 'Nenhuma pesca terminada neste ano.'

  return 'Nenhuma pesca terminada neste período.'
}

/**
 * Frase do mês sem pesca terminada no REAP do ano. Se só tem pesca sem terminar, diz isso em vez
 * de "não houve pesca".
 *
 * @example
 * describeMonthWithoutFishing(summary) // "Não houve pesca no período."
 */
export function describeMonthWithoutFishing(summary: ReapSummary): string {
  if (summary.unfinishedCount > 0) return 'Só tem pesca sem terminar neste mês.'

  return 'Não houve pesca no período.'
}
