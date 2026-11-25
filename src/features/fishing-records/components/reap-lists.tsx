import styled from 'styled-components/native'

import { describeReapArea, type ReapAreaRow, type ReapCatchRow } from '../utils/to-reap-rows'
import { RecordLine } from './record-text'

// Listas do REAP usadas nos cartões do mês e no detalhe de cada mês do ano: o mesmo texto nos dois.

// Um item da lista (um lugar, uma espécie), separado do anterior por linha.
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

// Cada lugar com tipo de local, ambiente, cidade e método (REAP: "Área de realização da pesca").
export function ReapAreaList({ rows }: { rows: ReapAreaRow[] }) {
  return (
    <List>
      {rows.map((row, index) => (
        <Entry key={row.key} $isFirst={index === 0}>
          <EntryTitle>{row.placeName}</EntryTitle>
          {describeReapArea(row).map((line) => (
            <RecordLine key={line}>{line}</RecordLine>
          ))}
        </Entry>
      ))}
    </List>
  )
}

// Cada espécie com quantidade e preço (REAP: "Resultado da operação de pesca").
export function ReapCatchList({ rows }: { rows: ReapCatchRow[] }) {
  return (
    <List>
      {rows.map((row, index) => (
        <Entry key={row.key} $isFirst={index === 0}>
          <EntryTitle>{row.speciesName}</EntryTitle>
          <RecordLine>{row.quantityLabel}</RecordLine>
          <RecordLine>{row.priceLabel}</RecordLine>
        </Entry>
      ))}
    </List>
  )
}
