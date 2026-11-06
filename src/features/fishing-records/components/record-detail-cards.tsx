import { SectionCard } from '@/components/SectionCard'
import { formatBrl } from '@/utils/format-currency'
import { formatQuantity } from '@/utils/format-quantity'
import { formatDateLabel, parseIsoDate } from '@/utils/iso-date'

import type { FishingRecordSale, SpeciesCatch } from '../types/fishing-record'
import { RecordBlock, RecordLine, RecordNote } from './record-text'

type RecordPlaceCardProps = {
  fishingDate: string
  isFinished: boolean
  cityLabel: string
  locationLabel: string
  // Nome do lugar. null em pescas gravadas antes de o nome ser pedido: a linha não aparece.
  placeName: string | null
  methodLabel: string
}

// Quando e onde foi a pesca. Avisa quando ela ainda não foi terminada.
export function RecordPlaceCard({
  fishingDate,
  isFinished,
  cityLabel,
  locationLabel,
  placeName,
  methodLabel,
}: RecordPlaceCardProps) {
  return (
    <SectionCard title="Pesca">
      <RecordBlock>
        <RecordLine>Dia: {formatDateLabel(parseIsoDate(fishingDate))}</RecordLine>
        <RecordLine>Cidade: {cityLabel}</RecordLine>
        <RecordLine>Onde: {locationLabel}</RecordLine>
        {placeName && <RecordLine>Lugar: {placeName}</RecordLine>}
        <RecordLine>Como: {methodLabel}</RecordLine>
        {!isFinished && <RecordNote>Falta terminar essa pesca.</RecordNote>}
      </RecordBlock>
    </SectionCard>
  )
}

type RecordCatchesCardProps = {
  species: SpeciesCatch[]
}

// Cada espécie com a quantidade. "(vendida)" marca o que entrou na venda.
export function RecordCatchesCard({ species }: RecordCatchesCardProps) {
  return (
    <SectionCard title="O que você pescou">
      <RecordBlock>
        {species.length === 0 && <RecordNote>Nenhuma captura registrada.</RecordNote>}
        {species.map((item) => (
          <RecordLine key={item.id}>
            {item.main_name}: {formatQuantity(item.quantity, item.unit_measure)}
            {item.commercialized ? ' (vendida)' : ''}
          </RecordLine>
        ))}
      </RecordBlock>
    </SectionCard>
  )
}

type RecordSaleCardProps = {
  sale: FishingRecordSale
}

// Venda da pesca: data, valor total e para quem foi vendido.
export function RecordSaleCard({ sale }: RecordSaleCardProps) {
  const buyers = sale.buyer_types.map((buyer) => buyer.name).join(', ')

  return (
    <SectionCard title="Venda">
      <RecordBlock>
        <RecordLine>Data: {formatDateLabel(parseIsoDate(sale.commercialization_date))}</RecordLine>
        <RecordLine>Valor: {formatBrl(sale.total_value)}</RecordLine>
        <RecordLine>Para: {buyers}</RecordLine>
      </RecordBlock>
    </SectionCard>
  )
}
