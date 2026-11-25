import type { ReactNode } from 'react'
import styled from 'styled-components/native'

import type { ReapCatalogs, ReapSummary } from '../types/reap'
import { formatDays } from '../utils/format-worked-days'
import {
  formatSaleStates,
  formatSoldAnswer,
  formatTargetGroups,
  REAP_SECTIONS,
} from '../utils/reap-texts'
import {
  toReapAreaRows,
  toReapCatchRows,
  toSaleStateNames,
  toTargetGroupNames,
} from '../utils/to-reap-rows'
import { ReapAreaList, ReapCatchList } from './reap-lists'
import { RecordLine } from './record-text'

// Cada parte começa numa linha fina: separa do cabeçalho do cartão e da parte anterior.
const Section = styled.View`
  gap: ${({ theme }) => theme.space.sm}px;
  padding-top: ${({ theme }) => theme.space.md}px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.outlineVariant};
`

const SectionTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.label.fontSize}px;
  line-height: ${({ theme }) => theme.typography.label.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`

const Sections = styled.View`
  gap: ${({ theme }) => theme.space.lg}px;
`

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Section>
      <SectionTitle accessibilityRole="header">{title}</SectionTitle>
      {children}
    </Section>
  )
}

type ReapPeriodDetailsProps = {
  summary: ReapSummary
  catalogs: ReapCatalogs
}

// O que o REAP pede de um mês, sem a moldura de cartão: vai dentro do cartão de cada mês do ano.
// A ordem é a dos cartões da escolha "Por mês".
export function ReapPeriodDetails({ summary, catalogs }: ReapPeriodDetailsProps) {
  const stateNames = toSaleStateNames(summary.saleMunicipalityCodes, catalogs)

  return (
    <Sections>
      <DetailSection title={REAP_SECTIONS.workedDays.title}>
        <RecordLine>{formatDays(summary.workedDays)}</RecordLine>
      </DetailSection>
      <DetailSection title={REAP_SECTIONS.areas.title}>
        <ReapAreaList rows={toReapAreaRows(summary.areas, catalogs)} />
      </DetailSection>
      <DetailSection title={REAP_SECTIONS.catches.title}>
        <ReapCatchList rows={toReapCatchRows(summary.catches)} />
      </DetailSection>
      <DetailSection title={REAP_SECTIONS.targetGroups.title}>
        <RecordLine>
          {formatTargetGroups(toTargetGroupNames(summary.speciesIds, catalogs))}
        </RecordLine>
      </DetailSection>
      <DetailSection title={REAP_SECTIONS.sale.title}>
        <RecordLine>{formatSoldAnswer(summary.hasSold)}</RecordLine>
        {summary.hasSold && <RecordLine>{formatSaleStates(stateNames)}</RecordLine>}
      </DetailSection>
    </Sections>
  )
}
