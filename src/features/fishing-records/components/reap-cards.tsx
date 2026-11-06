import type { ReactNode } from 'react'
import styled from 'styled-components/native'

import { SectionCard } from '@/components/SectionCard'
import { formatMonthName } from '@/utils/iso-date'

import type { ReapWorkedMonth } from '../types/reap'
import type { ReapAreaRow, ReapCatchRow } from '../utils/to-reap-rows'
import { RecordBlock, RecordLine, RecordNote } from './record-text'

// A resposta principal do cartão ("Sim", "12 dias"), maior que o resto.
const Answer = styled.Text`
  font-size: ${({ theme }) => theme.typography.title.fontSize}px;
  line-height: ${({ theme }) => theme.typography.title.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.title.fontWeight};
  color: ${({ theme }) => theme.colors.onSurface};
`

// Um item de uma lista dentro do cartão (um lugar, uma espécie), separado do anterior por linha.
const Entry = styled.View<{ $isFirst: boolean }>`
  gap: ${({ theme }) => theme.space.xs}px;
  padding-top: ${({ theme, $isFirst }) => ($isFirst ? 0 : theme.space.md)}px;
  border-top-width: ${({ $isFirst }) => ($isFirst ? 0 : 1)}px;
  border-top-color: ${({ theme }) => theme.colors.outlineVariant};
`

const EntryTitle = styled(RecordLine)`
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
`

const List = styled.View`
  gap: ${({ theme }) => theme.space.md}px;
`

// Mês e dias na mesma linha, um em cada ponta, para ler de cima a baixo.
const MonthRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.md}px;
`

type ReapCardProps = {
  title: string
  // Nome do campo no formulário do PesqBrasil, para achar onde copiar.
  reapField: string
  children: ReactNode
}

function ReapCard({ title, reapField, children }: ReapCardProps) {
  return (
    <SectionCard title={title}>
      <RecordNote>No REAP: {reapField}</RecordNote>
      {children}
    </SectionCard>
  )
}

function formatDays(days: number): string {
  return days === 1 ? '1 dia' : `${days} dias`
}

function formatMonths(months: number): string {
  return months === 1 ? '1 mês' : `${months} meses`
}

export function ReapFishedCard({ hasFished }: { hasFished: boolean }) {
  return (
    <ReapCard title="Pescou neste período?" reapField="Realizou pesca no período?">
      <Answer>{hasFished ? 'Sim' : 'Não'}</Answer>
    </ReapCard>
  )
}

type ReapWorkedDaysCardProps = {
  workedMonths: ReapWorkedMonth[]
  workedDays: number
  isYear: boolean
}

// No ano, os 12 meses com os dias de cada um (mês parado fica com 0, como o REAP pede).
// No mês, só o número de dias.
export function ReapWorkedDaysCard({ workedMonths, workedDays, isYear }: ReapWorkedDaysCardProps) {
  const monthsWorked = workedMonths.filter((item) => item.workedDays > 0).length

  return (
    <ReapCard title="Dias trabalhados" reapField="Meses trabalhados e dias de cada mês">
      {!isYear && <Answer>{formatDays(workedDays)}</Answer>}
      {isYear && (
        <List>
          {workedMonths.map((item) => (
            <MonthRow key={item.month}>
              <RecordLine>{formatMonthName(item.month - 1)}</RecordLine>
              <RecordLine>{formatDays(item.workedDays)}</RecordLine>
            </MonthRow>
          ))}
          <Answer>
            Total: {formatDays(workedDays)} em {formatMonths(monthsWorked)}
          </Answer>
        </List>
      )}
    </ReapCard>
  )
}

export function ReapAreasCard({ rows }: { rows: ReapAreaRow[] }) {
  return (
    <ReapCard title="Onde pescou" reapField="Área de realização da pesca">
      <List>
        {rows.map((row, index) => (
          <Entry key={row.key} $isFirst={index === 0}>
            <EntryTitle>{row.placeName}</EntryTitle>
            <RecordLine>Tipo de local: {row.locationLabel}</RecordLine>
            <RecordLine>Ambiente: {row.environmentLabel}</RecordLine>
            <RecordLine>Cidade: {row.cityLabel}</RecordLine>
            <RecordLine>Como: {row.methodLabel}</RecordLine>
          </Entry>
        ))}
      </List>
    </ReapCard>
  )
}

export function ReapCatchesCard({ rows }: { rows: ReapCatchRow[] }) {
  return (
    <ReapCard title="O que pescou" reapField="Resultado da operação de pesca">
      <List>
        {rows.map((row, index) => (
          <Entry key={row.key} $isFirst={index === 0}>
            <EntryTitle>{row.speciesName}</EntryTitle>
            <RecordLine>{row.quantityLabel}</RecordLine>
            <RecordLine>{row.priceLabel}</RecordLine>
          </Entry>
        ))}
      </List>
    </ReapCard>
  )
}

export function ReapTargetGroupsCard({ names }: { names: string[] }) {
  return (
    <ReapCard title="Tipos de pescado" reapField="Grupo alvo da pescaria">
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
    <ReapCard title="Venda" reapField="Houve comercialização e Estado de comercialização">
      <Answer>Vendeu: {hasSold ? 'Sim' : 'Não'}</Answer>
      {hasSold && <RecordLine>Estado: {stateNames.join(', ') || '—'}</RecordLine>}
    </ReapCard>
  )
}
