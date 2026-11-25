import { ScrollView } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { QueryFeedback } from '@/components/QueryFeedback'
import { SummaryPeriodPicker } from '@/components/summary-period-picker'
import { TopAppBar } from '@/components/TopAppBar'
import { useOpenDrawer } from '@/hooks/use-open-drawer'
import { useSummaryPeriod } from '@/hooks/use-summary-period'

import { useProductionIndicators } from '../api/get-production-indicators'
import { ProductionIndicatorsView } from '../components/production-indicators-view'

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`

// Minha produção: o que o pescador pescou e vendeu num mês ou num ano, para decidir onde, como e
// o que pescar. Os números vêm prontos do backend (GET /production-indicators).
export function ProductionScreen() {
  const { space } = useTheme()
  const openDrawer = useOpenDrawer()
  // Abre no mês atual, como a home.
  const summaryPeriod = useSummaryPeriod('MONTH')
  const indicatorsQuery = useProductionIndicators(summaryPeriod.period)

  return (
    <Container>
      <TopAppBar title="Minha produção" onMenu={openDrawer} />
      <ScrollView contentContainerStyle={{ padding: space.lg, gap: space.xl }}>
        <SummaryPeriodPicker
          period={summaryPeriod.period}
          canGoNext={summaryPeriod.canGoNext}
          onKindChange={summaryPeriod.changeKind}
          onPrevious={summaryPeriod.goPrevious}
          onNext={summaryPeriod.goNext}
        />
        <QueryFeedback
          isPending={indicatorsQuery.isPending}
          isError={indicatorsQuery.isError}
          error={indicatorsQuery.error}
          onRetry={() => indicatorsQuery.refetch()}
        />
        {indicatorsQuery.data && <ProductionIndicatorsView indicators={indicatorsQuery.data} />}
      </ScrollView>
    </Container>
  )
}
