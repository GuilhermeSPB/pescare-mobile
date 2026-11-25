import { ScrollView } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { QueryFeedback } from '@/components/QueryFeedback'
import { SummaryPeriodPicker } from '@/components/summary-period-picker'
import { TopAppBar } from '@/components/TopAppBar'
import { useMe } from '@/hooks/use-me'
import { useOpenDrawer } from '@/hooks/use-open-drawer'
import { useSummaryPeriod } from '@/hooks/use-summary-period'
import type { User } from '@/types/user'
import { describeMunicipality } from '@/utils/municipalities'

import { useFishingRecords } from '../api/get-fishing-records'
import { ReapPdfAction } from '../components/reap-pdf-action'
import { ReapMonthSummaryView, ReapYearSummaryView } from '../components/reap-summary'
import { useReapCatalogs } from '../hooks/use-reap-catalogs'
import { useReapPdf } from '../hooks/use-reap-pdf'
import type { ReapPdfContent } from '../types/reap'
import { hasAllReapCatalogs } from '../utils/has-all-reap-catalogs'
import { summarizeReap } from '../utils/summarize-reap'
import { summarizeReapMonths } from '../utils/summarize-reap-months'

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`

// Resumo das pescas de um mês ou de um ano, na ordem do REAP, para copiar no PesqBrasil.
// Só lê o que já foi registrado: nada aqui é enviado ao governo. O PDF sai do celular só se a
// pessoa escolher para onde mandar.
export function ReapScreen() {
  const { space } = useTheme()
  const openDrawer = useOpenDrawer()
  // Abre no ano atual, porque o REAP é entregue por ano.
  const reapPeriod = useSummaryPeriod('YEAR')
  const recordsQuery = useFishingRecords()
  const meQuery = useMe()
  const catalogs = useReapCatalogs()
  const reapPdf = useReapPdf()
  const { period } = reapPeriod
  const records = recordsQuery.data ?? []
  const summary = summarizeReap(records, period)
  const monthSummaries =
    period.kind === 'YEAR' ? summarizeReapMonths(records, period.year, new Date()) : []

  // O que vai no PDF: o pescador e o mesmo resumo da tela.
  const toPdfContent = (user: User): ReapPdfContent => ({
    fisherName: user.name,
    cityLabel: describeMunicipality(catalogs.municipalities, user.fk_municipality_ibge_code),
    period,
    summary,
    monthSummaries,
    catalogs,
    generatedOn: new Date(),
  })

  // Sem o usuário ainda, os botões ficam desligados; o retorno cedo só protege o tipo.
  const handleSendPdf = () => {
    if (meQuery.data) reapPdf.sendPdf(toPdfContent(meQuery.data))
  }

  const handleSavePdf = () => {
    if (meQuery.data) reapPdf.savePdf(toPdfContent(meQuery.data))
  }

  return (
    <Container>
      <TopAppBar title="REAP" onMenu={openDrawer} />
      <ScrollView contentContainerStyle={{ padding: space.lg, gap: space.xl }}>
        <SummaryPeriodPicker
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
        {recordsQuery.isSuccess && period.kind === 'YEAR' && (
          <ReapYearSummaryView
            year={period.year}
            summary={summary}
            monthSummaries={monthSummaries}
            catalogs={catalogs}
          />
        )}
        {recordsQuery.isSuccess && period.kind === 'MONTH' && (
          <ReapMonthSummaryView summary={summary} catalogs={catalogs} />
        )}
        {recordsQuery.isSuccess && (
          <ReapPdfAction
            canUsePdf={meQuery.isSuccess && hasAllReapCatalogs(catalogs)}
            isPdfSending={reapPdf.isPdfSending}
            isPdfSaving={reapPdf.isPdfSaving}
            pdfMessage={reapPdf.pdfMessage}
            onSendPdf={handleSendPdf}
            onSavePdf={handleSavePdf}
          />
        )}
      </ScrollView>
    </Container>
  )
}
