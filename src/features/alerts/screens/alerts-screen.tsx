import { router } from 'expo-router'
import { FlatList } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { EmptyState } from '@/components/EmptyState'
import { QueryFeedback } from '@/components/QueryFeedback'
import { TopAppBar } from '@/components/TopAppBar'
import { alertHref } from '@/config/routes'
import { useOpenDrawer } from '@/hooks/use-open-drawer'

import { useAlerts } from '../api/get-alerts'
import { AlertCard } from '../components/alert-card'

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`

// Comunicados que valem para o pescador, do mais novo ao mais antigo, como a API manda.
export function AlertsScreen() {
  const { space } = useTheme()
  const alertsQuery = useAlerts()
  const openDrawer = useOpenDrawer()

  return (
    <Container>
      <TopAppBar title="Comunicados" onMenu={openDrawer} />
      <FlatList
        data={alertsQuery.data ?? []}
        keyExtractor={(alert) => String(alert.id)}
        renderItem={({ item }) => (
          <AlertCard alert={item} onPress={() => router.push(alertHref(item.id))} />
        )}
        contentContainerStyle={{ padding: space.lg, gap: space.md }}
        ListHeaderComponent={
          <QueryFeedback
            isPending={alertsQuery.isPending}
            isError={alertsQuery.isError}
            error={alertsQuery.error}
            onRetry={() => alertsQuery.refetch()}
          />
        }
        ListEmptyComponent={
          alertsQuery.isSuccess ? (
            <EmptyState message="Nenhum comunicado para você por enquanto." />
          ) : null
        }
      />
    </Container>
  )
}
