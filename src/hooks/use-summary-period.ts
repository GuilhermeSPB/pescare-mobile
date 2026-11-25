import { useState } from 'react'

import type { SummaryPeriod, SummaryPeriodKind } from '@/types/summary-period'
import {
  currentSummaryPeriod,
  isLatestSummaryPeriod,
  shiftSummaryPeriod,
  switchSummaryPeriodKind,
} from '@/utils/summary-period'

/**
 * Período escolhido numa tela de resumo. Abre no mês ou no ano de hoje, conforme `initialKind`:
 * o REAP abre no ano, porque é entregue por ano; Minha produção abre no mês, como a home.
 * "Próximo" para no mês ou no ano de hoje: não há pesca no futuro.
 *
 * @param initialKind tipo do período com que a tela abre
 * @example
 * const summaryPeriod = useSummaryPeriod('YEAR')
 * summaryPeriod.changeKind('MONTH')
 */
export function useSummaryPeriod(initialKind: SummaryPeriodKind) {
  const [period, setPeriod] = useState<SummaryPeriod>(() =>
    currentSummaryPeriod(initialKind, new Date()),
  )

  return {
    period,
    canGoNext: !isLatestSummaryPeriod(period, new Date()),
    changeKind: (kind: SummaryPeriodKind) =>
      setPeriod((current) => switchSummaryPeriodKind(current, kind, new Date())),
    goPrevious: () => setPeriod((current) => shiftSummaryPeriod(current, -1)),
    goNext: () =>
      setPeriod((current) =>
        isLatestSummaryPeriod(current, new Date()) ? current : shiftSummaryPeriod(current, 1),
      ),
  }
}
