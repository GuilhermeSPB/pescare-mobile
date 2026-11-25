// Período de um resumo: um mês (1 a 12) ou o ano inteiro. Usado pelo REAP e por Minha produção.
export type SummaryPeriod =
  { kind: 'MONTH'; year: number; month: number } | { kind: 'YEAR'; year: number }

export type SummaryPeriodKind = SummaryPeriod['kind']
