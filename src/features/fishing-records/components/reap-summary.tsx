import { EmptyState } from '@/components/EmptyState'

import type { ReapCatalogs, ReapMonthSummary, ReapSummary } from '../types/reap'
import { describeNoFinishedFishing } from '../utils/reap-texts'
import {
  toReapAreaRows,
  toReapCatchRows,
  toSaleStateNames,
  toTargetGroupNames,
} from '../utils/to-reap-rows'
import {
  ReapAreasCard,
  ReapCatchesCard,
  ReapFishedCard,
  ReapSaleCard,
  ReapTargetGroupsCard,
  ReapWorkedDaysCard,
} from './reap-cards'
import { ReapYearMonths } from './reap-year-months'

type ReapMonthSummaryViewProps = {
  summary: ReapSummary
  catalogs: ReapCatalogs
}

// Um mês: os cartões do REAP na ordem do formulário do PesqBrasil. Sem pesca terminada, a
// resposta é só "Não pescou": os outros campos não se aplicam.
export function ReapMonthSummaryView({ summary, catalogs }: ReapMonthSummaryViewProps) {
  return (
    <>
      <ReapFishedCard hasFished={summary.hasFished} />
      {!summary.hasFished && <EmptyState message={describeNoFinishedFishing('MONTH')} />}
      {summary.hasFished && (
        <>
          <ReapWorkedDaysCard workedDays={summary.workedDays} />
          <ReapAreasCard rows={toReapAreaRows(summary.areas, catalogs)} />
          <ReapCatchesCard rows={toReapCatchRows(summary.catches)} />
          <ReapTargetGroupsCard names={toTargetGroupNames(summary.speciesIds, catalogs)} />
          <ReapSaleCard
            hasSold={summary.hasSold}
            stateNames={toSaleStateNames(summary.saleMunicipalityCodes, catalogs)}
          />
        </>
      )}
    </>
  )
}

type ReapYearSummaryViewProps = {
  year: number
  summary: ReapSummary
  monthSummaries: ReapMonthSummary[]
  catalogs: ReapCatalogs
}

// O ano: a resposta "Pescou?" e, se pescou, a lista de meses que abrem e fecham.
export function ReapYearSummaryView({
  year,
  summary,
  monthSummaries,
  catalogs,
}: ReapYearSummaryViewProps) {
  return (
    <>
      <ReapFishedCard hasFished={summary.hasFished} />
      {!summary.hasFished && <EmptyState message={describeNoFinishedFishing('YEAR')} />}
      {summary.hasFished && (
        // A chave pelo ano fecha os meses abertos quando a pessoa troca de ano.
        <ReapYearMonths key={year} monthSummaries={monthSummaries} catalogs={catalogs} />
      )}
    </>
  )
}
