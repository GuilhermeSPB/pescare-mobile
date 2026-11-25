import { router } from 'expo-router'
import { FlatList } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { Button } from '@/components/Button'
import { EmptyState } from '@/components/EmptyState'
import { FishingRecordRow } from '@/components/fishing-record-row'
import { QueryFeedback } from '@/components/QueryFeedback'
import { TopAppBar } from '@/components/TopAppBar'
import { fishingRecordHref } from '@/config/routes'
import { useOpenDrawer } from '@/hooks/use-open-drawer'

import { useFishingRecords } from '../api/get-fishing-records'
import { HistoryFilterChips } from '../components/history-filter-chips'
import { HistoryPeriodPanel } from '../components/history-period-panel'
import { useFishingHistoryFilters } from '../hooks/use-fishing-history-filters'
import { filterFishingRecords } from '../utils/filter-fishing-records'
import { toFishingRecordRowData } from '../utils/to-fishing-record-row'

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`

const Header = styled.View`
  gap: ${({ theme }) => theme.space.md}px;
`

const RowCard = styled.View`
  padding-horizontal: ${({ theme }) => theme.space.lg}px;
  border-radius: ${({ theme }) => theme.radius.card}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.outlineVariant};
  background-color: ${({ theme }) => theme.colors.surface};
`

type HistoryEmptyProps = {
  hasRecords: boolean
  onClearFilters: () => void
}

// Sem nenhuma pesca: a frase de sempre. Com pescas, mas nenhuma no filtro: a saída é limpar.
function HistoryEmpty({ hasRecords, onClearFilters }: HistoryEmptyProps) {
  if (!hasRecords) {
    return <EmptyState message="Suas pescas aparecem aqui depois que você registrar a primeira." />
  }

  return (
    <>
      <EmptyState message="Nenhuma pesca com esses filtros." />
      <Button variant="text" label="Limpar filtros" onPress={onClearFilters} />
    </>
  )
}

// Histórico: todas as pescas do pescador, com filtro por situação e por período.
export function FishingHistoryScreen() {
  const { space } = useTheme()
  const recordsQuery = useFishingRecords()
  const history = useFishingHistoryFilters()
  const openDrawer = useOpenDrawer()
  const records = recordsQuery.data ?? []
  const rows = filterFishingRecords(records, history.filters).map(toFishingRecordRowData)

  return (
    <Container>
      <TopAppBar title="Histórico" onMenu={openDrawer} />
      <FlatList
        data={rows}
        keyExtractor={(row) => String(row.id)}
        renderItem={({ item }) => (
          <RowCard>
            <FishingRecordRow item={item} onPress={() => router.push(fishingRecordHref(item.id))} />
          </RowCard>
        )}
        contentContainerStyle={{ padding: space.lg, gap: space.md }}
        ListHeaderComponent={
          <Header>
            <QueryFeedback
              isPending={recordsQuery.isPending}
              isError={recordsQuery.isError}
              error={recordsQuery.error}
              onRetry={() => recordsQuery.refetch()}
            />
            <HistoryFilterChips
              status={history.status}
              period={history.period}
              isPeriodOpen={history.isPeriodOpen}
              onStatusChange={history.setStatus}
              onTogglePeriod={history.togglePeriodPanel}
            />
            {history.isPeriodOpen && history.period && (
              <HistoryPeriodPanel
                period={history.period}
                onFromChange={history.changeFrom}
                onToChange={history.changeTo}
                onClear={history.clearPeriod}
              />
            )}
          </Header>
        }
        ListEmptyComponent={
          recordsQuery.isSuccess ? (
            <HistoryEmpty hasRecords={records.length > 0} onClearFilters={history.clearAll} />
          ) : null
        }
      />
    </Container>
  )
}
