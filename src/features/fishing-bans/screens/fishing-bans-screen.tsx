import { router } from 'expo-router'
import { useState } from 'react'
import { FlatList } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { Button } from '@/components/Button'
import { EmptyState } from '@/components/EmptyState'
import { FishingBanCard } from '@/components/fishing-ban-card'
import { MunicipalityPicker } from '@/components/MunicipalityPicker'
import { QueryFeedback } from '@/components/QueryFeedback'
import { TextField } from '@/components/TextField'
import { TopAppBar } from '@/components/TopAppBar'
import { fishingBanHref } from '@/config/routes'
import { useMe } from '@/hooks/use-me'
import { useMunicipalities } from '@/hooks/use-municipalities'
import { useOpenDrawer } from '@/hooks/use-open-drawer'
import type { Municipality } from '@/types/municipality'
import { describeMunicipality } from '@/utils/municipalities'

import { useMunicipalityFishingBans } from '../api/get-municipality-fishing-bans'
import { BanStatusChips } from '../components/ban-status-chips'
import { filterFishingBans, type BanStatusFilter } from '../utils/filter-fishing-bans'
import { toFishingBanCardData } from '../utils/to-fishing-ban-card-data'

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`

const Header = styled.View`
  gap: ${({ theme }) => theme.space.md}px;
`

const CityTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.title.fontSize}px;
  line-height: ${({ theme }) => theme.typography.title.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.title.fontWeight};
  color: ${({ theme }) => theme.colors.onSurface};
`

type BansEmptyProps = {
  hasBans: boolean
  cityLabel: string
  onClearFilters: () => void
}

// Sem defeso nenhum na cidade: a frase com o nome dela. Com defesos, mas nenhum na busca: limpar.
function BansEmpty({ hasBans, cityLabel, onClearFilters }: BansEmptyProps) {
  if (!hasBans) {
    return <EmptyState message={`Nenhum defeso previsto para ${cityLabel}.`} />
  }

  return (
    <>
      <EmptyState message="Nenhum defeso com essa busca." />
      <Button variant="text" label="Limpar filtros" onPress={onClearFilters} />
    </>
  )
}

// Defesos da cidade do cadastro, ou de outra cidade escolhida na busca, com filtro por situação
// e por espécie ou portaria.
export function FishingBansScreen() {
  const { space } = useTheme()
  const meQuery = useMe()
  const municipalitiesQuery = useMunicipalities()
  const [chosenCity, setChosenCity] = useState<Municipality | null>(null)
  const [isSearchingCity, setIsSearchingCity] = useState(false)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<BanStatusFilter>('TODOS')
  const homeCode = meQuery.data?.fk_municipality_ibge_code ?? null
  const activeCode = chosenCity?.ibge_code ?? homeCode
  const bansQuery = useMunicipalityFishingBans(activeCode)
  const openDrawer = useOpenDrawer()

  const bans = bansQuery.data ?? []
  const visible = filterFishingBans(bans, { query, status })
  const cityLabel = describeMunicipality(municipalitiesQuery.data, activeCode ?? '')

  function retry() {
    meQuery.refetch()
    bansQuery.refetch()
  }

  function chooseCity(municipality: Municipality) {
    setChosenCity(municipality)
    setIsSearchingCity(false)
  }

  function clearFilters() {
    setQuery('')
    setStatus('TODOS')
  }

  return (
    <Container>
      <TopAppBar title="Defesos" onMenu={openDrawer} />
      <FlatList
        data={visible.map(toFishingBanCardData)}
        keyExtractor={(card) => String(card.id)}
        renderItem={({ item }) => (
          <FishingBanCard
            ban={item}
            onPress={() => router.push(fishingBanHref(item.id, activeCode ?? undefined))}
          />
        )}
        contentContainerStyle={{ padding: space.lg, gap: space.md }}
        ListHeaderComponent={
          <Header>
            <QueryFeedback
              isPending={meQuery.isPending || bansQuery.isLoading}
              isError={meQuery.isError || bansQuery.isError}
              error={meQuery.isError ? meQuery.error : bansQuery.error}
              onRetry={retry}
            />
            <CityTitle accessibilityRole="header">Defesos de {cityLabel}</CityTitle>
            {isSearchingCity ? (
              <>
                <MunicipalityPicker
                  label="Buscar cidade"
                  municipalities={municipalitiesQuery.data}
                  selectedCode={activeCode}
                  onSelect={chooseCity}
                />
                <Button variant="text" label="Cancelar" onPress={() => setIsSearchingCity(false)} />
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  label="Ver outra cidade"
                  onPress={() => setIsSearchingCity(true)}
                />
                {chosenCity && (
                  <Button
                    variant="text"
                    label="Voltar para minha cidade"
                    onPress={() => setChosenCity(null)}
                  />
                )}
              </>
            )}
            <TextField
              label="Buscar espécie ou portaria"
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              leadingIcon="search"
            />
            <BanStatusChips status={status} onStatusChange={setStatus} />
          </Header>
        }
        ListEmptyComponent={
          bansQuery.isSuccess ? (
            <BansEmpty
              hasBans={bans.length > 0}
              cityLabel={cityLabel}
              onClearFilters={clearFilters}
            />
          ) : null
        }
      />
    </Container>
  )
}
