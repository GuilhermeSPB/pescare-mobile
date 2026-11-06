import styled from 'styled-components/native'

import { Button } from '@/components/Button'
import { EmptyState } from '@/components/EmptyState'

import type { ReapCatalogs, ReapSummary } from '../types/reap'
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
import { RecordNote } from './record-text'

type ReapSummaryViewProps = {
  summary: ReapSummary
  isYear: boolean
  catalogs: ReapCatalogs
  onOpenHistory: () => void
}

const Notice = styled.View`
  gap: ${({ theme }) => theme.space.xs}px;
  align-items: flex-start;
`

function unfinishedMessage(count: number): string {
  if (count === 1) return '1 pesca deste período está sem terminar e não entra aqui.'

  return `${count} pescas deste período estão sem terminar e não entram aqui.`
}

// Os cartões do REAP na ordem do formulário do PesqBrasil. Sem pesca terminada, a resposta é
// só "Não pescou": os outros campos não se aplicam.
export function ReapSummaryView({
  summary,
  isYear,
  catalogs,
  onOpenHistory,
}: ReapSummaryViewProps) {
  return (
    <>
      {summary.unfinishedCount > 0 && (
        <Notice>
          <RecordNote>{unfinishedMessage(summary.unfinishedCount)}</RecordNote>
          <Button variant="text" label="Ver no histórico" onPress={onOpenHistory} />
        </Notice>
      )}
      <ReapFishedCard hasFished={summary.hasFished} />
      {!summary.hasFished && <EmptyState message="Nenhuma pesca terminada neste período." />}
      {summary.hasFished && (
        <>
          <ReapWorkedDaysCard
            workedMonths={summary.workedMonths}
            workedDays={summary.workedDays}
            isYear={isYear}
          />
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
