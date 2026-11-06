import { router } from 'expo-router'
import { ScrollView } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { QueryFeedback } from '@/components/QueryFeedback'
import { TopAppBar } from '@/components/TopAppBar'
import { HISTORY_HREF } from '@/config/routes'
import { useOpenDrawer } from '@/hooks/use-open-drawer'

import { useFishingRecords } from '../api/get-fishing-records'
import { ReapPeriodPicker } from '../components/reap-period-picker'
import { ReapSummaryView } from '../components/reap-summary'
import { useReapCatalogs } from '../hooks/use-reap-catalogs'
import { useReapPeriod } from '../hooks/use-reap-period'
import { summarizeReap } from '../utils/summarize-reap'

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`

const Intro = styled.Text`
  font-size: ${({ theme }) => theme.typography.bodyLarge.fontSize}px;
  line-height: ${({ theme }) => theme.typography.bodyLarge.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`

// Resumo das pescas de um mês ou de um ano, na ordem do REAP, para copiar no PesqBrasil.
// Só lê o que já foi registrado: nada aqui é enviado ao governo.
export function ReapScreen() {
  const { space } = useTheme()
  const openDrawer = useOpenDrawer()
  const reapPeriod = useReapPeriod()
  const recordsQuery = useFishingRecords()
  const catalogs = useReapCatalogs()
  const summary = summarizeReap(recordsQuery.data ?? [], reapPeriod.period)

  return (
    <Container>
      <TopAppBar title="REAP" onMenu={openDrawer} />
      <ScrollView contentContainerStyle={{ padding: space.lg, gap: space.xl }}>
        <Intro>Use estes dados para preencher o REAP.</Intro>
        <ReapPeriodPicker
          period={reapPeriod.period}
          canGoNext={reapPeriod.canGoNext}
          onKindChange={reapPeriod.changeKind}
          onPrevious={reapPeriod.goPrevious}
          onNext={reapPeriod.goNext}
        />
        <QueryFeedback
          isPending={recordsQuery.isPending}
          isError={recordsQuery.isError}
          error={recordsQuery.error}
          onRetry={() => recordsQuery.refetch()}
        />
        {recordsQuery.isSuccess && (
          <ReapSummaryView
            summary={summary}
            isYear={reapPeriod.period.kind === 'YEAR'}
            catalogs={catalogs}
            onOpenHistory={() => router.push(HISTORY_HREF)}
          />
        )}
      </ScrollView>
    </Container>
  )
}
