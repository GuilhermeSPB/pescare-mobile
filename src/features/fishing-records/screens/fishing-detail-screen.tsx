import { router } from 'expo-router'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { QueryFeedback } from '@/components/QueryFeedback'
import { TopAppBar } from '@/components/TopAppBar'
import { useMunicipalities } from '@/hooks/use-municipalities'
import { formatDateLabel, parseIsoDate } from '@/utils/iso-date'
import { describeMunicipality } from '@/utils/municipalities'

import { useFishingLocationTypes } from '../api/get-fishing-location-types'
import { useFishingMethods } from '../api/get-fishing-methods'
import { useFishingRecord } from '../api/get-fishing-record'
import {
  RecordCatchesCard,
  RecordPlaceCard,
  RecordSaleCard,
} from '../components/record-detail-cards'
import { labelFor } from '../utils/label-for'

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`

const Content = styled(ScrollView)`
  flex: 1;
`

const Inner = styled.View`
  gap: ${({ theme }) => theme.space.xl}px;
  padding: ${({ theme }) => theme.space.lg}px;
`

type FishingDetailScreenProps = {
  recordId: number
}

// Leitura de uma pesca já gravada: onde, o que foi pescado e a venda. Não edita nada.
export function FishingDetailScreen({ recordId }: FishingDetailScreenProps) {
  const recordQuery = useFishingRecord(recordId)
  const municipalitiesQuery = useMunicipalities()
  const locationTypesQuery = useFishingLocationTypes()
  const methodsQuery = useFishingMethods()
  const record = recordQuery.data
  const title = record ? `Pesca de ${formatDateLabel(parseIsoDate(record.fishing_date))}` : 'Pesca'

  return (
    <Container>
      <TopAppBar title={title} onBack={() => router.back()} />
      <Content>
        <Inner>
          <QueryFeedback
            isPending={recordQuery.isPending}
            isError={recordQuery.isError}
            error={recordQuery.error}
            onRetry={() => recordQuery.refetch()}
          />
          {record && (
            <>
              <RecordPlaceCard
                fishingDate={record.fishing_date}
                isFinished={record.status === 'FINALIZADO'}
                cityLabel={describeMunicipality(
                  municipalitiesQuery.data,
                  record.fk_municipality_ibge_code,
                )}
                locationLabel={labelFor(
                  locationTypesQuery.data,
                  record.fk_type_location_id,
                  (item) => item.name,
                  '—',
                )}
                placeName={record.location_name}
                methodLabel={labelFor(
                  methodsQuery.data,
                  record.fk_fishing_method_id,
                  (item) => item.name,
                  '—',
                )}
              />
              <RecordCatchesCard species={record.species} />
              {record.commercialization && <RecordSaleCard sale={record.commercialization} />}
            </>
          )}
        </Inner>
      </Content>
    </Container>
  )
}
