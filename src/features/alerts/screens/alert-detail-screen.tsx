import { router } from 'expo-router'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { EmptyState } from '@/components/EmptyState'
import { QueryFeedback } from '@/components/QueryFeedback'
import { TopAppBar } from '@/components/TopAppBar'
import { ApiError } from '@/lib/api-client'

import { useAlertById } from '../api/get-alert-by-id'
import type { AlertDetails } from '../types/alert'
import { describePublication } from '../utils/describe-publication'

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`

const Content = styled(ScrollView)`
  flex: 1;
`

const Inner = styled.View`
  gap: ${({ theme }) => theme.space.md}px;
  padding: ${({ theme }) => theme.space.lg}px;
`

const Article = styled.View`
  gap: ${({ theme }) => theme.space.md}px;
  padding: ${({ theme }) => theme.space.lg}px;
  border-radius: ${({ theme }) => theme.radius.card}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.outlineVariant};
  background-color: ${({ theme }) => theme.colors.surface};
`

const Published = styled.Text`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  line-height: ${({ theme }) => theme.typography.body.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`

const ArticleTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.headline.fontSize}px;
  line-height: ${({ theme }) => theme.typography.headline.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.headline.fontWeight};
  color: ${({ theme }) => theme.colors.onSurface};
`

const ArticleBody = styled.Text`
  font-size: ${({ theme }) => theme.typography.bodyLarge.fontSize}px;
  line-height: ${({ theme }) => theme.typography.bodyLarge.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurface};
`

// O comunicado inteiro. O texto pode ser copiado: costuma trazer telefone, data ou endereço.
function AlertArticle({ alert }: { alert: AlertDetails }) {
  return (
    <Article>
      <Published>{describePublication(alert.publication_date)}</Published>
      <ArticleTitle accessibilityRole="header">{alert.title}</ArticleTitle>
      <ArticleBody selectable>{alert.description}</ArticleBody>
    </Article>
  )
}

type AlertDetailScreenProps = {
  alertId: number
}

// Leitura de um comunicado. O 404 é um comunicado que saiu do ar: tentar de novo não adianta,
// então a tela diz isso em vez de mostrar o erro com o botão.
export function AlertDetailScreen({ alertId }: AlertDetailScreenProps) {
  const alertQuery = useAlertById(alertId)
  const isAlertGone = alertQuery.error instanceof ApiError && alertQuery.error.status === 404

  return (
    <Container>
      <TopAppBar title="Comunicado" onBack={() => router.back()} />
      <Content>
        <Inner>
          {isAlertGone ? (
            <EmptyState message="Este comunicado não está mais disponível." />
          ) : (
            <QueryFeedback
              isPending={alertQuery.isPending}
              isError={alertQuery.isError}
              error={alertQuery.error}
              onRetry={() => alertQuery.refetch()}
            />
          )}
          {alertQuery.data && <AlertArticle alert={alertQuery.data} />}
        </Inner>
      </Content>
    </Container>
  )
}
