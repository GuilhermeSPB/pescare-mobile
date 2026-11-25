import type { ReactNode } from 'react'
import styled from 'styled-components/native'

import { SectionCard } from '@/components/SectionCard'

import { formatDays } from '../utils/format-worked-days'
import { formatSaleStates, formatSoldAnswer, formatYesNo, REAP_SECTIONS } from '../utils/reap-texts'
import type { ReapAreaRow, ReapCatchRow } from '../utils/to-reap-rows'
import { ReapAreaList, ReapCatchList } from './reap-lists'
import { RecordBlock, RecordLine, RecordNote } from './record-text'

// A resposta principal do cartão ("Sim", "12 dias"), maior que o resto.
const Answer = styled.Text`
  font-size: ${({ theme }) => theme.typography.title.fontSize}px;
  line-height: ${({ theme }) => theme.typography.title.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.title.fontWeight};
  color: ${({ theme }) => theme.colors.onSurface};
`

type ReapCardProps = {
  // Título e campo do PesqBrasil de uma das seções de REAP_SECTIONS.
  section: { title: string; reapField: string }
  children: ReactNode
}

function ReapCard({ section, children }: ReapCardProps) {
  return (
    <SectionCard title={section.title}>
      <RecordNote>No REAP: {section.reapField}</RecordNote>
      {children}
    </SectionCard>
  )
}

export function ReapFishedCard({ hasFished }: { hasFished: boolean }) {
  return (
    <ReapCard section={REAP_SECTIONS.fished}>
      <Answer>{formatYesNo(hasFished)}</Answer>
    </ReapCard>
  )
}

// Dias com pesca no mês. No ano, os dias aparecem mês a mês na lista de meses.
export function ReapWorkedDaysCard({ workedDays }: { workedDays: number }) {
  return (
    <ReapCard section={REAP_SECTIONS.workedDays}>
      <Answer>{formatDays(workedDays)}</Answer>
    </ReapCard>
  )
}

export function ReapAreasCard({ rows }: { rows: ReapAreaRow[] }) {
  return (
    <ReapCard section={REAP_SECTIONS.areas}>
      <ReapAreaList rows={rows} />
    </ReapCard>
  )
}

export function ReapCatchesCard({ rows }: { rows: ReapCatchRow[] }) {
  return (
    <ReapCard section={REAP_SECTIONS.catches}>
      <ReapCatchList rows={rows} />
    </ReapCard>
  )
}

export function ReapTargetGroupsCard({ names }: { names: string[] }) {
  return (
    <ReapCard section={REAP_SECTIONS.targetGroups}>
      <RecordBlock>
        {names.length === 0 && <RecordLine>—</RecordLine>}
        {names.map((name) => (
          <RecordLine key={name}>{name}</RecordLine>
        ))}
      </RecordBlock>
    </ReapCard>
  )
}

type ReapSaleCardProps = {
  hasSold: boolean
  stateNames: string[]
}

export function ReapSaleCard({ hasSold, stateNames }: ReapSaleCardProps) {
  return (
    <ReapCard section={REAP_SECTIONS.sale}>
      <Answer>{formatSoldAnswer(hasSold)}</Answer>
      {hasSold && <RecordLine>{formatSaleStates(stateNames)}</RecordLine>}
    </ReapCard>
  )
}
