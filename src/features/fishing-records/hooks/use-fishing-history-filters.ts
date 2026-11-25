import { useState } from 'react'

import type { HistoryFilters, HistoryStatus } from '../utils/filter-fishing-records'

export type HistoryPeriod = {
  from: Date
  to: Date
}

// Período que o chip oferece quando é aberto pela primeira vez: do dia 1 do mês até hoje.
function defaultPeriod(today: Date): HistoryPeriod {
  return { from: new Date(today.getFullYear(), today.getMonth(), 1), to: today }
}

/**
 * Filtros da tela de Histórico: situação e período. É estado da tela, não persiste.
 *
 * @example
 * const history = useFishingHistoryFilters()
 * const visible = filterFishingRecords(records, history.filters)
 */
export function useFishingHistoryFilters() {
  const [status, setStatus] = useState<HistoryStatus>('TODAS')
  const [period, setPeriod] = useState<HistoryPeriod | null>(null)
  const [isPeriodOpen, setIsPeriodOpen] = useState(false)

  // Abre o painel de datas (começando no mês atual) ou fecha, mantendo o período escolhido.
  function togglePeriodPanel() {
    if (isPeriodOpen) {
      setIsPeriodOpen(false)
      return
    }

    setPeriod((current) => current ?? defaultPeriod(new Date()))
    setIsPeriodOpen(true)
  }

  // "De" não fica depois de "Até": se passar, "Até" acompanha.
  function changeFrom(from: Date) {
    setPeriod((current) => current && { from, to: current.to < from ? from : current.to })
  }

  function changeTo(to: Date) {
    setPeriod((current) => current && { from: current.from, to })
  }

  function clearPeriod() {
    setPeriod(null)
    setIsPeriodOpen(false)
  }

  function clearAll() {
    setStatus('TODAS')
    clearPeriod()
  }

  const filters: HistoryFilters = {
    status,
    from: period?.from ?? null,
    to: period?.to ?? null,
  }

  return {
    status,
    period,
    isPeriodOpen,
    filters,
    hasActiveFilters: status !== 'TODAS' || period !== null,
    setStatus,
    togglePeriodPanel,
    changeFrom,
    changeTo,
    clearPeriod,
    clearAll,
  }
}
