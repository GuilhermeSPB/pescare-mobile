import { router } from 'expo-router'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { Button } from '@/components/Button'
import { EmptyState } from '@/components/EmptyState'
import { ExtendedFab } from '@/components/extended-fab'
import { FishingBanCard, type FishingBanCardData } from '@/components/fishing-ban-card'
import type { FishingRecordRowData } from '@/components/fishing-record-row'
import { QueryFeedback } from '@/components/QueryFeedback'
import { TopAppBar } from '@/components/TopAppBar'
import {
  FISHING_BANS_HREF,
  fishingBanHref,
  fishingRecordHref,
  HISTORY_HREF,
  NEW_RECORD_HREF,
  PRODUCTION_HREF,
} from '@/config/routes'
import { useOpenDrawer } from '@/hooks/use-open-drawer'
import { firstName } from '@/utils/text'

import { MonthStats } from '../components/month-stats'
import { RecentFishingsCard } from '../components/recent-fishings-card'
import { formatMonthCards, type MonthStatsInput } from '../utils/format-month-stats'

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`

const Content = styled(ScrollView)`
  flex: 1;
`

// Espaço extra embaixo para o botão flutuante não cobrir a última pesca.
const Inner = styled.View`
  gap: ${({ theme }) => theme.space.xl}px;
  padding: ${({ theme }) => theme.space.lg}px;
  padding-bottom: ${({ theme }) => theme.size.control + theme.space.xxl}px;
`

const Greeting = styled.Text`
  font-size: ${({ theme }) => theme.typography.headline.fontSize}px;
  line-height: ${({ theme }) => theme.typography.headline.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.headline.fontWeight};
  color: ${({ theme }) => theme.colors.onSurface};
`

const BansBlock = styled.View`
  gap: ${({ theme }) => theme.space.md}px;
`

const BansTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.title.fontSize}px;
  line-height: ${({ theme }) => theme.typography.title.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.title.fontWeight};
  color: ${({ theme }) => theme.colors.onSurface};
`

// Canto inferior direito, sobre a lista.
const FabSlot = styled.View`
  position: absolute;
  right: ${({ theme }) => theme.space.lg}px;
  bottom: ${({ theme }) => theme.space.lg}px;
`

// Estado da consulta de pescas: os números do mês e a lista dependem dela ao mesmo tempo.
type RecordsQuery = {
  isPending: boolean
  isError: boolean
  error: unknown
  onRetry: () => void
}

// Defesos da cidade que valem agora. A consulta é própria: se falhar, o resto da home segue.
type FishingBansState = {
  cityLabel: string
  // Só os defesos que valem agora; undefined enquanto a consulta não chegou.
  cards: FishingBanCardData[] | undefined
  isLoading: boolean
  isError: boolean
  error: unknown
  onRetry: () => void
}

type HomeScreenProps = {
  // Nome completo de GET /users/me; undefined enquanto não chegou. Não vem da sessão do login,
  // que fica com o nome antigo depois de "Mudar nome".
  fisherName: string | undefined
  monthLabel: string
  // undefined enquanto as pescas não chegaram.
  stats: MonthStatsInput | undefined
  recent: FishingRecordRowData[] | undefined
  query: RecordsQuery
  fishingBans: FishingBansState
}

type FishingBansSectionProps = {
  bans: FishingBansState
}

// Destaque dos defesos que valem agora, com o botão para a lista completa.
function FishingBansSection({ bans }: FishingBansSectionProps) {
  const cards = bans.cards

  return (
    <BansBlock>
      <QueryFeedback
        isPending={bans.isLoading}
        isError={bans.isError}
        error={bans.error}
        onRetry={bans.onRetry}
      />
      {cards && cards.length > 0 && (
        <>
          <BansTitle accessibilityRole="header">
            {cards.length > 1 ? 'Defesos em vigor' : 'Defeso em vigor'}
          </BansTitle>
          {cards.map((card) => (
            <FishingBanCard
              key={card.id}
              ban={card}
              onPress={() => router.push(fishingBanHref(card.id))}
            />
          ))}
        </>
      )}
      {cards?.length === 0 && !bans.isLoading && !bans.isError && (
        <EmptyState
          message={
            bans.cityLabel === '—'
              ? 'Nenhum defeso em vigor agora.'
              : `Nenhum defeso em vigor em ${bans.cityLabel} agora.`
          }
        />
      )}
      <Button
        variant="outlined"
        label="Ver todos os defesos"
        onPress={() => router.push(FISHING_BANS_HREF)}
      />
    </BansBlock>
  )
}

// Início: o defeso que vale na cidade, o mês do pescador, as últimas pescas e os atalhos.
export function HomeScreen({
  fisherName,
  monthLabel,
  stats,
  recent,
  query,
  fishingBans,
}: HomeScreenProps) {
  const openDrawer = useOpenDrawer()

  return (
    <Container>
      <TopAppBar title="Pescare" onMenu={openDrawer} />
      <Content contentContainerStyle={{ flexGrow: 1 }}>
        <Inner>
          <Greeting accessibilityRole="header">
            {fisherName ? `Olá, ${firstName(fisherName)}!` : 'Olá!'}
          </Greeting>
          <FishingBansSection bans={fishingBans} />
          <QueryFeedback
            isPending={query.isPending}
            isError={query.isError}
            error={query.error}
            onRetry={query.onRetry}
          />
          {stats && <MonthStats title={monthLabel} cards={formatMonthCards(stats)} />}
          {stats && (
            <Button
              variant="outlined"
              label="Ver minha produção"
              onPress={() => router.push(PRODUCTION_HREF)}
            />
          )}
          {recent && (
            <RecentFishingsCard
              items={recent}
              onOpen={(recordId) => router.push(fishingRecordHref(recordId))}
            />
          )}
          <Button
            variant="outlined"
            label="Ver todas as pescas"
            onPress={() => router.push(HISTORY_HREF)}
          />
        </Inner>
      </Content>
      <FabSlot>
        <ExtendedFab
          label="Registrar pesca"
          icon="add"
          onPress={() => router.push(NEW_RECORD_HREF)}
        />
      </FabSlot>
    </Container>
  )
}
