import { useState } from 'react'

import type { ReapPeriod, ReapPeriodKind } from '../types/reap'
import { isLatestReapPeriod, shiftReapPeriod, switchReapPeriodKind } from '../utils/reap-period'

/**
 * Período escolhido na tela do REAP. Abre no ano atual, porque o REAP é entregue por ano.
 * "Próximo" para no mês ou no ano de hoje: não há pesca no futuro.
 *
 * @example
 * const reapPeriod = useReapPeriod()
 * reapPeriod.changeKind('MONTH')
 */
export function useReapPeriod() {
  const [period, setPeriod] = useState<ReapPeriod>(() => ({
    kind: 'YEAR',
    year: new Date().getFullYear(),
  }))

  return {
    period,
    canGoNext: !isLatestReapPeriod(period, new Date()),
    changeKind: (kind: ReapPeriodKind) =>
      setPeriod((current) => switchReapPeriodKind(current, kind, new Date())),
    goPrevious: () => setPeriod((current) => shiftReapPeriod(current, -1)),
    goNext: () =>
      setPeriod((current) =>
        isLatestReapPeriod(current, new Date()) ? current : shiftReapPeriod(current, 1),
      ),
  }
}
