import { router } from 'expo-router'
import { ScrollView } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { Button } from '@/components/Button'
import { QueryFeedback } from '@/components/QueryFeedback'
import { SectionCard } from '@/components/SectionCard'
import { TopAppBar } from '@/components/TopAppBar'
import { CHANGE_PASSWORD_HREF, EDIT_CITY_HREF, EDIT_NAME_HREF } from '@/config/routes'
import { useAuth } from '@/contexts/AuthContext'
import { useMe } from '@/hooks/use-me'
import { useMunicipalities } from '@/hooks/use-municipalities'
import { useOpenDrawer } from '@/hooks/use-open-drawer'
import { describeMunicipality } from '@/utils/municipalities'

import { ProfileField } from '../components/profile-field'

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`

// Perfil: dados da conta, com o que dá para mudar, e a saída. O botão de sair fica aqui, fora da
// tela inicial. O e-mail não muda: a API não aceita.
export function ProfileScreen() {
  const { space } = useTheme()
  const { signOut } = useAuth()
  const meQuery = useMe()
  const municipalitiesQuery = useMunicipalities()
  const openDrawer = useOpenDrawer()

  const cityLabel =
    meQuery.data && municipalitiesQuery.data
      ? describeMunicipality(municipalitiesQuery.data, meQuery.data.fk_municipality_ibge_code)
      : 'Carregando cidade…'

  return (
    <Container>
      <TopAppBar title="Perfil" onMenu={openDrawer} />
      <ScrollView contentContainerStyle={{ gap: space.xl, padding: space.lg }}>
        <QueryFeedback
          isPending={meQuery.isPending}
          isError={meQuery.isError}
          error={meQuery.error}
          onRetry={() => meQuery.refetch()}
        />
        {meQuery.data && (
          <SectionCard title="Seus dados">
            <ProfileField
              label="Nome"
              value={meQuery.data.name}
              action={
                <Button
                  variant="text"
                  label="Mudar nome"
                  onPress={() => router.push(EDIT_NAME_HREF)}
                />
              }
            />
            <ProfileField label="E-mail" value={meQuery.data.email} />
            <ProfileField
              label="Cidade"
              value={cityLabel}
              action={
                <Button
                  variant="text"
                  label="Mudar cidade"
                  onPress={() => router.push(EDIT_CITY_HREF)}
                />
              }
            />
          </SectionCard>
        )}
        <Button
          variant="outlined"
          label="Trocar senha"
          onPress={() => router.push(CHANGE_PASSWORD_HREF)}
        />
        <Button variant="outlined" label="Sair da conta" onPress={signOut} />
      </ScrollView>
    </Container>
  )
}
