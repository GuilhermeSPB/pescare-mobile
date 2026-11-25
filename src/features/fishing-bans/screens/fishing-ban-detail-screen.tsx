import { router } from 'expo-router'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { EmptyState } from '@/components/EmptyState'
import { QueryFeedback } from '@/components/QueryFeedback'
import { SectionCard } from '@/components/SectionCard'
import { TopAppBar } from '@/components/TopAppBar'
import { useMe } from '@/hooks/use-me'
import { formatBanWindow } from '@/utils/format-ban-window'

import { useMunicipalityFishingBans } from '../api/get-municipality-fishing-bans'
import type { MunicipalityFishingBan } from '../types/municipality-fishing-ban'
import {
  describeDate,
  describeLocations,
  describeNormType,
  describeSpecies,
  describeStatus,
} from '../utils/describe-fishing-ban'

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

const Line = styled.Text`
  font-size: ${({ theme }) => theme.typography.bodyLarge.fontSize}px;
  line-height: ${({ theme }) => theme.typography.bodyLarge.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurface};
`

const Note = styled.Text`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  line-height: ${({ theme }) => theme.typography.body.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`

const StatusBox = styled.View<{ $highlight: boolean }>`
  padding: ${({ theme }) => theme.space.lg}px;
  border-radius: ${({ theme }) => theme.radius.card}px;
  border-width: ${({ $highlight }) => ($highlight ? 2 : 1)}px;
  border-color: ${({ theme, $highlight }) =>
    $highlight ? theme.colors.error : theme.colors.outlineVariant};
  background-color: ${({ theme, $highlight }) =>
    $highlight ? theme.colors.errorContainer : theme.colors.surface};
`

const StatusText = styled.Text<{ $highlight: boolean }>`
  font-size: ${({ theme }) => theme.typography.title.fontSize}px;
  line-height: ${({ theme }) => theme.typography.title.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.title.fontWeight};
  color: ${({ theme, $highlight }) =>
    $highlight ? theme.colors.onErrorContainer : theme.colors.onSurface};
`

// Vigência da norma: a data em que ela começa e, se houver, a data em que termina.
function normValidityText(ban: MunicipalityFishingBan): string {
  const end = ban.valid_until ? `até ${describeDate(ban.valid_until)}` : 'sem data para terminar'

  return `Vale de ${describeDate(ban.start_in)} ${end}.`
}

// Situação, norma, janelas, espécies, locais e observação de um defeso. Só leitura.
function FishingBanSections({ ban }: { ban: MunicipalityFishingBan }) {
  const highlight = ban.status === 'EM_VIGOR'

  return (
    <>
      <SectionCard title="Situação">
        <StatusBox $highlight={highlight}>
          <StatusText $highlight={highlight}>{describeStatus(ban)}</StatusText>
        </StatusBox>
      </SectionCard>
      <SectionCard title="Norma">
        <Line>{ban.fishing_ban.rule}</Line>
        <Note>Tipo: {describeNormType(ban)}</Note>
        <Note>{normValidityText(ban)}</Note>
      </SectionCard>
      <SectionCard title="Período">
        <Note>Todos os anos, nestes dias:</Note>
        {ban.windows.map((window) => (
          <Line key={`${window.start_date}-${window.end_date}`}>{formatBanWindow(window)}</Line>
        ))}
      </SectionCard>
      <SectionCard title="Espécies">
        <Line>{describeSpecies(ban)}</Line>
      </SectionCard>
      <SectionCard title="Locais">
        <Line>{describeLocations(ban)}</Line>
      </SectionCard>
      {ban.observation && (
        <SectionCard title="Observação">
          <Note>{ban.observation}</Note>
        </SectionCard>
      )}
    </>
  )
}

type FishingBanDetailScreenProps = {
  banId: number
  // Cidade de onde o defeso veio na listagem; null = a do cadastro.
  cityCode: string | null
}

// Um defeso da cidade por inteiro. Lê o que a listagem já trouxe, pelo id, sem outra consulta.
export function FishingBanDetailScreen({ banId, cityCode }: FishingBanDetailScreenProps) {
  const meQuery = useMe()
  const activeCode = cityCode ?? meQuery.data?.fk_municipality_ibge_code ?? null
  const bansQuery = useMunicipalityFishingBans(activeCode)
  const ban = bansQuery.data?.find((item) => item.id === banId)

  return (
    <Container>
      <TopAppBar title="Defeso" onBack={() => router.back()} />
      <Content>
        <Inner>
          <QueryFeedback
            isPending={bansQuery.isLoading}
            isError={bansQuery.isError}
            error={bansQuery.error}
            onRetry={() => bansQuery.refetch()}
          />
          {bansQuery.isSuccess && !ban && (
            <EmptyState message="Este defeso não está mais na lista desta cidade." />
          )}
          {ban && <FishingBanSections ban={ban} />}
        </Inner>
      </Content>
    </Container>
  )
}
